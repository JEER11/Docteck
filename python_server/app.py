from flask import Flask, jsonify, request, send_from_directory, render_template, redirect  # docteck
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
import os, json, time
from werkzeug.utils import secure_filename
from file_analysis import ocr_image
from tasks import create_ocr_task
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
import stripe
import pathlib
from datetime import datetime, timedelta

load_dotenv()
app = Flask(__name__)
# Trust a single reverse proxy (Nginx) to supply X-Forwarded-* so request.url, scheme, and remote IP are correct
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
# Allow CORS for /api/* endpoints.
# In production, restrict to ALLOWED_ORIGINS / CORS_ORIGINS (comma-separated).
# In development, allow localhost defaults.
raw = (os.environ.get('ALLOWED_ORIGINS') or os.environ.get('CORS_ORIGINS') or '').strip()
origins = [o.strip() for o in raw.split(',') if o.strip()]
is_prod = (os.environ.get('FLASK_ENV') == 'production' or os.environ.get('ENV') == 'production' or os.environ.get('APP_ENV') == 'production')
if not origins and not is_prod:
    origins = ['http://localhost:3000','http://127.0.0.1:3000','http://localhost:3001','http://127.0.0.1:3001']
CORS(app, resources={r"/api/*": {
    "origins": origins,
    "allow_headers": ["Content-Type","Authorization","X-Requested-With","X-API-SECRET"],
    "supports_credentials": True,
    "methods": ["GET","POST","PUT","PATCH","DELETE","OPTIONS"]
}})

# Optional API secret to protect /api/* routes in non-public deployments
API_SECRET = (os.environ.get('API_SECRET') or '').strip()
# If enabled (default: on), unauthorized /api/* requests return 404 instead of 401
API_STEALTH_404 = str(os.environ.get('API_STEALTH_404', '1')).lower() not in ('0','false','no')
# Simple per-IP rate limiting for /api/* (requests per minute). 0 disables.
try:
    API_RATE_LIMIT_PER_MINUTE = int(os.environ.get('API_RATE_LIMIT_PER_MINUTE', '60'))
except Exception:
    API_RATE_LIMIT_PER_MINUTE = 60
_RATE_BUCKETS = {}

@app.before_request
def _enforce_api_secret():
    # Only enforce for /api/*, skip preflight and health
    if not API_SECRET:
        return None
    p = request.path or ''
    if request.method == 'OPTIONS':
        return None
    if p.startswith('/api/'):
        # Accept via header or query string for convenience
        header = request.headers.get('X-API-SECRET', '')
        q = request.args.get('api_secret', '')
        if header == API_SECRET or q == API_SECRET:
            return None
        # Stealth 404 by default to avoid revealing API surface
        if API_STEALTH_404:
            return jsonify(message='Not found'), 404
        return jsonify(error='unauthorized'), 401
    return None

@app.before_request
def _rate_limit_api():
    # Apply only to API endpoints and only if limit > 0
    if API_RATE_LIMIT_PER_MINUTE <= 0:
        return None
    p = request.path or ''
    if not p.startswith('/api/'):
        return None
    if request.method == 'OPTIONS':
        return None
    try:
        import time as _t
        now = _t.time()
        # Determine client IP (respect basic x-forwarded-for first value if present)
        fwd = request.headers.get('X-Forwarded-For', '').split(',')[0].strip()
        ip = fwd or (request.remote_addr or 'unknown')
        bucket = _RATE_BUCKETS.get(ip)
        if bucket is None:
            bucket = []
            _RATE_BUCKETS[ip] = bucket
        # drop timestamps older than 60s
        cutoff = now - 60.0
        # in-place filter for performance
        i = 0
        for ts in bucket:
            if ts >= cutoff:
                break
            i += 1
        if i:
            del bucket[:i]
        if len(bucket) >= API_RATE_LIMIT_PER_MINUTE:
            # Too many requests
            resp = jsonify(error='rate_limited')
            # Advise retry in ~1s/min-window
            try:
                first = bucket[0] if bucket else now
                retry_after = max(1, int(round((first + 60.0) - now)))
            except Exception:
                retry_after = 30
            return resp, 429, { 'Retry-After': str(retry_after) }
        bucket.append(now)
    except Exception:
        # Fail-open on limiter errors
        return None
    return None

# Default uploads dir relative to repo root (../uploads)
UPLOAD_DIR = os.environ.get(
    'UPLOAD_DIR',
    os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads'))
)
os.makedirs(UPLOAD_DIR, exist_ok=True)
RECORDS_DIR = os.path.join(UPLOAD_DIR, 'records')
ASK_DIR = os.path.join(UPLOAD_DIR, 'ask')
REPORT_DIR = os.path.join(UPLOAD_DIR, 'report')
os.makedirs(RECORDS_DIR, exist_ok=True)
os.makedirs(ASK_DIR, exist_ok=True)
os.makedirs(REPORT_DIR, exist_ok=True)
RECORDS_JSON = os.path.join(RECORDS_DIR, 'records.json')
APPOINTMENTS_JSON = os.path.join(UPLOAD_DIR, 'appointments.json')
PROVIDERS_JSON = os.path.join(UPLOAD_DIR, 'providers.json')
PROFILE_JSON = os.path.join(UPLOAD_DIR, 'profile.json')

STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY
    # Dev-friendly JSON store (uploads/stripe-customers.json) to map userId -> customerId
    STRIPE_CUSTOMERS_JSON = os.path.join(UPLOAD_DIR, 'stripe-customers.json')
    def _stripe_store_read():
        try:
            if not os.path.exists(STRIPE_CUSTOMERS_JSON):
                return {}
            with open(STRIPE_CUSTOMERS_JSON, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    def _stripe_store_write(obj):
        try:
            os.makedirs(os.path.dirname(STRIPE_CUSTOMERS_JSON), exist_ok=True)
            with open(STRIPE_CUSTOMERS_JSON, 'w', encoding='utf-8') as f:
                json.dump(obj, f, indent=2)
        except Exception:
            pass


@app.route('/api/hello')
def hello():
    return jsonify(message="Hello from Flask", success=True)


@app.route('/api/echo', methods=['POST'])
def echo():
    data = request.get_json() or {}
    return jsonify(received=data)


@app.route('/health')
def health():
    return jsonify(status='ok'), 200

@app.get('/health/firebase')
def health_firebase():
    return jsonify(firebase=firebase_env_config(), has_keys=bool(firebase_env_config().get('apiKey') and firebase_env_config().get('appId')))

@app.get('/api/debug/routes')
def debug_routes():
    rules = []
    for r in app.url_map.iter_rules():
        methods = sorted(m for m in r.methods if m not in ('HEAD','OPTIONS'))
        rules.append({'rule': str(r), 'endpoint': r.endpoint, 'methods': methods})
    return jsonify(routes=sorted(rules, key=lambda x: x['rule']))


@app.route('/api/ocr', methods=['POST'])
def api_ocr():
    # Accept multipart/form-data file upload
    if 'file' not in request.files:
        return jsonify(error='no_file'), 400
    f = request.files['file']
    if f.filename == '':
        return jsonify(error='empty_filename'), 400
    filename = secure_filename(f.filename)
    dest = os.path.join(UPLOAD_DIR, filename)
    f.save(dest)

    # Option A: synchronous OCR (quick small files)
    if request.form.get('async') != '1':
        text = ocr_image(dest)
        try:
            os.remove(dest)
        except Exception:
            pass
        return jsonify(ok=True, text=text)

    # Option B: enqueue background OCR and return job id
    task_id = create_ocr_task.delay(dest).id
    return jsonify(ok=True, task_id=task_id)


 

BUILD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'build'))
# Persist a sanitized last-good index for resilience during rebuild windows
CACHE_PATH = os.path.join(BUILD_DIR, '.index-cache.html')

# Cache last good React index to avoid flashing the build splash during brief rebuild gaps
_INDEX_CACHE = { 'mtime': 0, 'html': None }

# Cache for resolving hashed main bundles so alias endpoints never 404 between builds
_BUNDLE_CACHE = {
    'manifest_mtime': 0,
    'js': None,
    'css': None,
}

def _manifest_mtime():
    try:
        p = os.path.join(BUILD_DIR, 'asset-manifest.json')
        return os.path.getmtime(p) if os.path.exists(p) else 0
    except Exception:
        return 0

def _resolve_main_bundle(kind: str):
    """
    Resolve the current main.*.{js,css} filename reliably using a cached value
    tied to asset-manifest mtime, with directory scan fallback. Returns a tuple
    (filename or None, absolute_dir) where absolute_dir is the folder to serve from.
    """
    try:
        # If manifest unchanged, prefer cached value
        mtime = _manifest_mtime()
        if _BUNDLE_CACHE.get('manifest_mtime') == mtime and _BUNDLE_CACHE.get(kind):
            folder = os.path.join(BUILD_DIR, 'static', 'js' if kind == 'js' else 'css')
            return _BUNDLE_CACHE.get(kind), folder

        # Try manifest first
        manifest_path = os.path.join(BUILD_DIR, 'asset-manifest.json')
        name = None
        if os.path.exists(manifest_path):
            try:
                with open(manifest_path, 'r', encoding='utf-8') as f:
                    m = json.load(f)
                files = m.get('files') or {}
                key = 'main.js' if kind == 'js' else 'main.css'
                path = files.get(key)
                if isinstance(path, str):
                    base = path.split('/')[-1]
                    if base.startswith('main.') and base.endswith('.' + kind):
                        name = base
            except Exception:
                name = None
        # Fallback to directory scan
        folder = os.path.join(BUILD_DIR, 'static', 'js' if kind == 'js' else 'css')
        if not name and os.path.isdir(folder):
            try:
                candidates = [n for n in os.listdir(folder) if n.startswith('main.') and n.endswith('.' + kind)]
                candidates.sort(reverse=True)
                if candidates:
                    name = candidates[0]
            except Exception:
                name = None
        # Update cache if we found a name
        if name:
            _BUNDLE_CACHE['manifest_mtime'] = mtime
            _BUNDLE_CACHE[kind] = name
        return name, folder
    except Exception:
        return None, os.path.join(BUILD_DIR, 'static', 'js' if kind == 'js' else 'css')

def _load_cached_react_index():
    """
    Load and cache build/index.html, rewriting asset paths for /app and injecting config.
    Returns cached HTML when build/index.html is temporarily missing (e.g., during CRA cleanup).
    """
    try:
        index_path = os.path.join(BUILD_DIR, 'index.html')
        if os.path.exists(index_path):
            mtime = os.path.getmtime(index_path)
            if mtime != _INDEX_CACHE['mtime']:
                with open(index_path, 'r', encoding='utf-8') as f:
                    html = f.read()
                html = _rewrite_react_index_paths(html)
                inject = f"""
                <script id=\"flask-config\" type=\"application/json\">{json.dumps({'apiBase': get_api_base()})}</script>
                <script>window.__FIREBASE_CONFIG__ = {json.dumps(firebase_env_config())};</script>
                <script src=\"/static/bridge.js\"></script>
                """
                if '</body>' in html:
                    html = html.replace('</body>', inject + '\n</body>')
                _INDEX_CACHE['mtime'] = mtime
                _INDEX_CACHE['html'] = html
                # Persist to disk so server restarts or brief rebuild gaps can still serve UI
                try:
                    with open(CACHE_PATH, 'w', encoding='utf-8') as cf:
                        cf.write(html)
                except Exception:
                    pass
        # Return cached html (freshly loaded or previous good version)
        if _INDEX_CACHE['html']:
            return _INDEX_CACHE['html']
        # No persisted cache on disk; return None to trigger live load when available
        return None
    except Exception:
        return _INDEX_CACHE['html']

_CACHE_WARMED = False

@app.before_request
def _warm_react_index_cache_once():
    global _CACHE_WARMED
    if _CACHE_WARMED:
        return None
    try:
        _load_cached_react_index()
    except Exception:
        pass
    finally:
        _CACHE_WARMED = True
    return None

# --------- Helpers: load React build CSS to match styling ---------
def get_react_css_urls():
    manifest_path = os.path.join(BUILD_DIR, 'asset-manifest.json')
    css_urls = []
    try:
        with open(manifest_path, 'r', encoding='utf-8') as f:
            manifest = json.load(f)
        files = manifest.get('files') or {}
        # main.css is typical; also include any chunk css
        for k, v in files.items():
            if isinstance(v, str) and v.endswith('.css'):
                # Serve under /app/<path>
                path = v[1:] if v.startswith('/') else v
                css_urls.append('/app/' + path)
    except Exception:
        pass
    # Fallback to a common path if manifest missing
    if not css_urls and os.path.exists(os.path.join(BUILD_DIR, 'static', 'css')):
        try:
            for name in os.listdir(os.path.join(BUILD_DIR, 'static', 'css')):
                if name.endswith('.css'):
                    css_urls.append('/app/static/css/' + name)
        except Exception:
            pass
    return css_urls

# --------- Helpers: rewrite asset paths for SPA under /app ---------
def _rewrite_react_index_paths(html: str) -> str:
    """
    The built index.html references assets at root (e.g. /static/js/*, /manifest.json).
    When serving the SPA under /app, rewrite only those asset links to /app/* so they load.
    Be careful not to rewrite our injected /static/bridge.js which is served by Flask.
    """
    try:
        # Specific replacements
        html = html.replace(' href="/static/css/', ' href="/app/static/css/')
        html = html.replace(' src="/static/js/', ' src="/app/static/js/')
        for path in ('/favicon.png','/apple-icon.png','/manifest.json','/billing-background.css','/billing-background-fix.css'):
            html = html.replace(f' href="{path}"', f' href="/app{path}"')
            html = html.replace(f' src="{path}"', f' src="/app{path}"')
        # Map hashed main bundle to a stable 'latest' path so rebuilds never 404
        html = html.replace(' src="/app/static/js/main.', ' src="/app/static/js/main.latest.js" data-orig="/app/static/js/main.')
        html = html.replace(' href="/app/static/css/main.', ' href="/app/static/css/main.latest.css" data-orig="/app/static/css/main.')
        # Handle CRA placeholders from public/index.html when build isn't ready
        # Replace %PUBLIC_URL%/* with /app/* so assets load under the SPA prefix
        html = html.replace('%PUBLIC_URL%/', '/app/')
        return html
    except Exception:
        return html

# --------- Auth pages (classic) ---------
def firebase_env_config():
    return {
        'apiKey': os.environ.get('REACT_APP_FIREBASE_API_KEY') or os.environ.get('FIREBASE_API_KEY') or '',
        'authDomain': os.environ.get('REACT_APP_FIREBASE_AUTH_DOMAIN') or os.environ.get('FIREBASE_AUTH_DOMAIN') or '',
        'projectId': os.environ.get('REACT_APP_FIREBASE_PROJECT_ID') or os.environ.get('FIREBASE_PROJECT_ID') or '',
        'storageBucket': os.environ.get('REACT_APP_FIREBASE_STORAGE_BUCKET') or os.environ.get('FIREBASE_STORAGE_BUCKET') or '',
        'messagingSenderId': os.environ.get('REACT_APP_FIREBASE_MESSAGING_SENDER_ID') or os.environ.get('FIREBASE_MESSAGING_SENDER_ID') or '',
        'appId': os.environ.get('REACT_APP_FIREBASE_APP_ID') or os.environ.get('FIREBASE_APP_ID') or '',
    }

@app.route('/signin')
def signin_page():
    # Prefer SPA auth for identical UI
    return redirect('/app/authentication/sign-in', code=302)

@app.route('/signup')
def signup_page():
    # Prefer SPA auth for identical UI
    return redirect('/app/authentication/sign-up', code=302)

# Support direct SPA deep links without the /app prefix
@app.route('/authentication')
def spa_auth_root():
    return redirect('/app/authentication', code=302)

@app.route('/authentication/<path:subpath>')
def spa_auth_paths(subpath):
    return redirect(f'/app/authentication/{subpath}', code=302)

# Common direct links people type
@app.route('/authentication/sign-in')
def spa_auth_signin():
    return redirect('/app/authentication/sign-in', code=302)

@app.route('/authentication/sign-up')
def spa_auth_signup():
    return redirect('/app/authentication/sign-up', code=302)

# --------- Dashboard (classic) ---------
def get_api_base():
    # Prefer explicit front-end API base if defined; else same-origin
    url = os.environ.get('REACT_APP_API_URL') or os.environ.get('API_BASE_URL') or ''
    return url

@app.route('/dashboard')
def dashboard_page():
    # For pixel parity, use the React SPA Dashboard directly
    return redirect('/app/dashboard', code=302)

@app.route('/dashboard-classic')
def dashboard_classic_page():
    # Keep the classic HTML version available if you want to compare
    return render_template('dashboard.html', react_css=get_react_css_urls(), api_base=get_api_base())

@app.route('/caring-hub')
def caring_hub_page():
    # Match SPA route naming ("/tables" in React)
    return redirect('/app/tables', code=302)

@app.route('/assistance')
def assistance_page():
    return redirect('/app/assistance', code=302)

@app.route('/billing')
def billing_page():
    return redirect('/app/billing', code=302)

@app.route('/profile')
def profile_page():
    return redirect('/app/profile', code=302)

@app.route('/family')
def family_page():
    return redirect('/app/profile/family', code=302)

@app.route('/pets')
def pets_page():
    return redirect('/app/profile/pets', code=302)

# ---------- Classic pages (Flask templates) ----------
@app.route('/')
def classic_home():
    # Home goes to SPA dashboard for unified look
    return redirect('/app/dashboard', code=302)

# Keep classic templates available under /classic/* for reference or fallback
@app.route('/classic')
def classic_index():
    return render_template('index.html')

@app.route('/classic/dashboard')
def classic_dashboard():
    return render_template('dashboard.html', react_css=get_react_css_urls(), api_base=get_api_base())

@app.route('/classic/caring-hub')
def classic_caring_hub():
    return render_template('caring_hub.html', react_css=get_react_css_urls(), api_base=get_api_base())

@app.route('/classic/assistance')
def classic_assistance():
    return render_template('assistance.html', react_css=get_react_css_urls(), api_base=get_api_base())

@app.route('/classic/billing')
def classic_billing():
    return render_template('billing.html', react_css=get_react_css_urls(), api_base=get_api_base())

@app.route('/classic/profile')
def classic_profile():
    return render_template('profile.html', react_css=get_react_css_urls(), api_base=get_api_base())

@app.route('/classic/family')
def classic_family():
    return render_template('family.html', react_css=get_react_css_urls(), api_base=get_api_base())

@app.route('/classic/pets')
def classic_pets():
    return render_template('pets.html', react_css=get_react_css_urls(), api_base=get_api_base())

# ---------- React app (served under /app) ----------
@app.route('/app')
def react_index():
    # Attempt to serve current index.html; if missing, serve cached good version
    cached = _load_cached_react_index()
    if cached:
        return cached, 200, {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0",
        }
    # If no in-memory cache, try persisted cache on disk explicitly before showing splash
    try:
        if CACHE_PATH and os.path.exists(CACHE_PATH):
            with open(CACHE_PATH, 'r', encoding='utf-8') as cf:
                html = cf.read()
            if html:
                # warm in-memory cache for subsequent requests
                _INDEX_CACHE['html'] = html
                _INDEX_CACHE['mtime'] = 0
                return html, 200, {
                    "Content-Type": "text/html; charset=utf-8",
                    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
                    "Pragma": "no-cache",
                    "Expires": "0",
                }
    except Exception:
        pass
    # If no cached html yet (first-ever load) and index is missing, show splash once
    index_path = os.path.join(BUILD_DIR, 'index.html')
    if not os.path.exists(index_path):
        return (
            """<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>UI is building…</title>
            <style>html,body{height:100%;margin:0}body{display:flex;align-items:center;justify-content:center;background:#0b1020;color:#e8ecff;font:15px/1.45 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif} .card{background:#0f1630;border:1px solid #1f2b56;border-radius:14px;padding:22px 26px;box-shadow:0 12px 30px rgba(5,10,40,.35)} h2{margin:0 0 6px 0;font-weight:700;font-size:20px} p{margin:6px 0 0 0;opacity:.85}</style></head>
            <body><div class=\"card\"><h2>UI is building…</h2><p>Please wait a moment. This page will refresh automatically.</p></div>
            <script>setTimeout(function(){location.reload()},1500)</script></body></html>""",
            200,
            {"Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store"}
        )
    # If the file exists but not yet cached, load it now and return
    html = _load_cached_react_index()
    return html or send_from_directory(BUILD_DIR, 'index.html')

@app.route('/app/<path:path>')
def react_static(path):
    file_path = os.path.join(BUILD_DIR, path)
    # Serve stable 'latest' bundle aliases
    if path == 'static/js/main.latest.js':
        target, js_dir = _resolve_main_bundle('js')
        if target:
            try:
                resp = send_from_directory(js_dir, target)
                resp.headers['Cache-Control'] = 'no-store'
                return resp
            except Exception:
                # If cached target vanished, force re-resolve once and retry
                _BUNDLE_CACHE['js'] = None
                target, js_dir = _resolve_main_bundle('js')
                if target:
                    resp = send_from_directory(js_dir, target)
                    try:
                        resp.headers['Cache-Control'] = 'no-store'
                    except Exception:
                        pass
                    return resp
        # Serve a tiny retry script to avoid blank screen during brief build gaps
        try:
            from flask import Response
            script = """/* main.latest.js pending */\nconsole.warn('UI build is updating… retrying shortly');\nsetTimeout(function(){ location.reload(); }, 1200);\n"""
            return Response(script, mimetype='application/javascript', headers={'Cache-Control': 'no-store'})
        except Exception:
            return ('', 404, {'Cache-Control': 'no-store'})
    if path == 'static/css/main.latest.css':
        target, css_dir = _resolve_main_bundle('css')
        if target:
            try:
                resp = send_from_directory(css_dir, target)
                resp.headers['Cache-Control'] = 'no-store'
                return resp
            except Exception:
                _BUNDLE_CACHE['css'] = None
                target, css_dir = _resolve_main_bundle('css')
                if target:
                    resp = send_from_directory(css_dir, target)
                    try:
                        resp.headers['Cache-Control'] = 'no-store'
                    except Exception:
                        pass
                    return resp
        try:
            from flask import Response
            css = "/* main.latest.css pending */"
            return Response(css, mimetype='text/css', headers={'Cache-Control': 'no-store'})
        except Exception:
            return ('', 404, {'Cache-Control': 'no-store'})
    if os.path.isfile(file_path):
        try:
            # Touch cache so next /app serves the latest index
            _load_cached_react_index()
        except Exception:
            pass
        return send_from_directory(BUILD_DIR, path)
    # If the request targets hashed static assets that no longer exist after a rebuild,
    # try to provide a graceful fallback for main.* bundles so the app can still boot.
    if path.startswith(('static/', 'locales/')) or path in ('favicon.png','apple-icon.png','manifest.json'):
        try:
            # Fallback: if the missing file is main.* bundle, serve the latest main.* if available
            if path.startswith('static/js/main.') and path.endswith('.js'):
                js_dir = os.path.join(BUILD_DIR, 'static', 'js')
                if os.path.isdir(js_dir):
                    candidates = [n for n in os.listdir(js_dir) if n.startswith('main.') and n.endswith('.js')]
                    # Prefer the longest/most recent looking filename
                    candidates.sort(reverse=True)
                    if candidates:
                        return send_from_directory(js_dir, candidates[0])
            if path.startswith('static/css/main.') and path.endswith('.css'):
                css_dir = os.path.join(BUILD_DIR, 'static', 'css')
                if os.path.isdir(css_dir):
                    candidates = [n for n in os.listdir(css_dir) if n.startswith('main.') and n.endswith('.css')]
                    candidates.sort(reverse=True)
                    if candidates:
                        return send_from_directory(css_dir, candidates[0])
        except Exception:
            pass
        # Otherwise, return 404 so the browser doesn't try to execute HTML as JS.
        return '', 404
    # Otherwise, SPA fallback to index for client-side routing paths
    return react_index()

# Friendly path for brand icon used in SPA Sidenav
@app.get('/app/brand/sunset.png')
def app_brand_sunset():
    # Map to hashed build file if present
    # Prefer 'static/media/sunset.*.png'
    media_dir = os.path.join(BUILD_DIR, 'static', 'media')
    if os.path.isdir(media_dir):
        for name in os.listdir(media_dir):
            if name.startswith('sunset.') and name.endswith('.png'):
                return send_from_directory(media_dir, name)
    # Fallback to public asset if available
    alt = os.path.join(BUILD_DIR, 'apple-icon.png')
    if os.path.exists(alt):
        return send_from_directory(BUILD_DIR, 'apple-icon.png')
    return '', 404

# ---------- Uploads static ----------
@app.route('/uploads/<path:filename>')
def uploads_static(filename):
    return send_from_directory(UPLOAD_DIR, filename)

# Serve React build assets on root paths expected by CRA
templates_static_dir = os.path.join(os.path.dirname(__file__), 'templates')

@app.route('/static/js/<path:filename>')
def react_static_js(filename):
    return send_from_directory(os.path.join(BUILD_DIR, 'static', 'js'), filename)

@app.route('/static/css/<path:filename>')
def react_static_css(filename):
    return send_from_directory(os.path.join(BUILD_DIR, 'static', 'css'), filename)

@app.route('/static/media/<path:filename>')
def react_static_media(filename):
    return send_from_directory(os.path.join(BUILD_DIR, 'static', 'media'), filename)

# i18n locales served at root (CRA i18next default)
@app.route('/locales/<path:filename>')
def locales_static(filename):
    # Prefer build/locales, fallback to public/locales
    build_locales = os.path.join(BUILD_DIR, 'locales')
    if os.path.exists(os.path.join(build_locales, filename)):
        return send_from_directory(build_locales, filename)
    public_locales = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public', 'locales'))
    if os.path.exists(os.path.join(public_locales, filename)):
        return send_from_directory(public_locales, filename)
    return jsonify(message='Not found'), 404

# Fallback small static assets for templates (css/js)
@app.route('/static/<path:filename>')
def templates_static(filename):
    # Keep bridge.js and any other helper scripts/styles under python_server/templates
    return send_from_directory(templates_static_dir, filename)

# Favicon convenience route
@app.route('/favicon.ico')
def favicon_ico():
    path = os.path.join(BUILD_DIR, 'favicon.png')
    if os.path.exists(path):
        return send_from_directory(BUILD_DIR, 'favicon.png')
    return '', 204

# Intercept root asset requests and serve from build or templates
@app.before_request
def _serve_root_assets():
    p = request.path
    # Bridge script served from templates regardless of Flask's default static handler
    if p == '/static/bridge.js':
        return send_from_directory(templates_static_dir, 'bridge.js')
    # Map CRA root paths to /app equivalents
    if p.startswith('/static/js/') or p.startswith('/static/css/') or p.startswith('/static/media/'):
        # Preserve the full subfolder path under /static/* when serving from the React build
        subpath = p.lstrip('/')  # e.g. 'static/media/sunset.abc.png'
        target = os.path.join(BUILD_DIR, subpath)
        if os.path.exists(target):
            return send_from_directory(BUILD_DIR, subpath)
    for name in ('/favicon.png','/apple-icon.png','/manifest.json','/billing-background.css','/billing-background-fix.css'):
        if p == name:
            file_path = os.path.join(BUILD_DIR, name.lstrip('/'))
            if os.path.exists(file_path):
                return send_from_directory(BUILD_DIR, name.lstrip('/'))
    # fall through to normal routing
    return None

# Serve calendar oauth success helper from public folder if present
@app.route('/calendar/oauth-success.html')
def calendar_oauth_success():
    public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'public', 'calendar'))
    target = os.path.join(public_dir, 'oauth-success.html')
    if os.path.exists(target):
        return send_from_directory(public_dir, 'oauth-success.html')
    # Fallback to build if copied there
    if os.path.exists(os.path.join(BUILD_DIR, 'calendar', 'oauth-success.html')):
        return send_from_directory(os.path.join(BUILD_DIR, 'calendar'), 'oauth-success.html')
    return jsonify(message='Not found'), 404

# ---------- Records API (JSON on disk) ----------
def read_json_safe(p, fallback):
    try:
        if not os.path.exists(p):
            return fallback
        with open(p, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return fallback

def write_json_safe(p, data):
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

@app.get('/api/records')
def get_records():
    data = read_json_safe(RECORDS_JSON, {
        'notes': { 'endOfLife': '', 'medicalFamily': '' },
        'eol': {
            'notes': '',
            'insurance': { 'provider': '', 'policyNumber': '', 'groupNumber': '', 'phone': '', 'memberId': '' },
            'directives': { 'healthcareProxyName': '', 'healthcareProxyPhone': '', 'livingWillOnFile': False, 'dnrOnFile': False, 'preferredHospital': '' },
            'donorStatus': 'Unknown',
            'documentLinks': [],
            'resources': []
        },
        'mfFiles': [], 'visits': [], 'tests': [], 'updatedAt': None,
    })
    return jsonify(ok=True, data=data)

@app.post('/api/records/notes')
def post_records_notes():
    incoming = request.get_json(silent=True) or {}
    data = read_json_safe(RECORDS_JSON, {})
    data['notes'] = { 'endOfLife': incoming.get('endOfLife',''), 'medicalFamily': incoming.get('medicalFamily','') }
    data['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    write_json_safe(RECORDS_JSON, data)
    return jsonify(ok=True)

@app.post('/api/records/eol')
def post_records_eol():
    eol_update = request.get_json(silent=True) or {}
    data = read_json_safe(RECORDS_JSON, {})
    eol = data.get('eol', {})
    eol.update({ k: v for k, v in eol_update.items() if k not in ('documentLinks','resources') })
    if isinstance(eol_update.get('documentLinks'), list):
        eol['documentLinks'] = eol_update['documentLinks']
    if isinstance(eol_update.get('resources'), list):
        eol['resources'] = eol_update['resources']
    data['eol'] = eol
    data['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    write_json_safe(RECORDS_JSON, data)
    return jsonify(ok=True)

# Medical & Family files
@app.get('/api/records/mf-files')
def list_mf_files():
    data = read_json_safe(RECORDS_JSON, {})
    return jsonify(ok=True, files=data.get('mfFiles', []))

@app.post('/api/records/mf-files')
def upload_mf_file():
    f = request.files.get('file')
    if not f or f.filename == '':
        return jsonify(ok=False, error='no_file'), 400
    safe = secure_filename(f.filename)
    mf_dir = os.path.join(RECORDS_DIR, 'mf')
    os.makedirs(mf_dir, exist_ok=True)
    dest = os.path.join(mf_dir, f"{int(time.time()*1000)}_{safe}")
    f.save(dest)
    data = read_json_safe(RECORDS_JSON, {})
    entry = {
        'id': os.path.basename(dest),
        'label': request.form.get('label') or f.filename,
        'category': request.form.get('category') or 'Self',
        'path': f"/uploads/records/mf/{os.path.basename(dest)}",
        'filename': f.filename,
        'mimetype': f.mimetype,
        'size': pathlib.Path(dest).stat().st_size,
        'uploadedAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
    }
    files = data.get('mfFiles', [])
    files.append(entry)
    data['mfFiles'] = files
    data['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    write_json_safe(RECORDS_JSON, data)
    return jsonify(ok=True, file=entry)

@app.delete('/api/records/mf-files/<fid>')
def delete_mf_file(fid):
    data = read_json_safe(RECORDS_JSON, {})
    files = data.get('mfFiles', [])
    idx = next((i for i, x in enumerate(files) if x.get('id') == fid), -1)
    if idx == -1:
        return jsonify(ok=False, error='not_found'), 404
    try:
        mf_dir = os.path.join(RECORDS_DIR, 'mf')
        disk_path = os.path.join(mf_dir, fid)
        if os.path.exists(disk_path):
            os.remove(disk_path)
    except Exception:
        pass
    files.pop(idx)
    data['mfFiles'] = files
    data['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    write_json_safe(RECORDS_JSON, data)
    return jsonify(ok=True)

@app.patch('/api/records/mf-files/<fid>')
def patch_mf_file(fid):
    data = read_json_safe(RECORDS_JSON, {})
    files = data.get('mfFiles', [])
    idx = next((i for i, x in enumerate(files) if x.get('id') == fid), -1)
    if idx == -1:
        return jsonify(ok=False, error='not_found'), 404
    payload = request.get_json(silent=True) or {}
    prev = files[idx]
    nextv = { **prev }
    if isinstance(payload.get('tags'), list):
        nextv['tags'] = payload['tags']
    if isinstance(payload.get('notes'), str):
        nextv['notes'] = payload['notes']
    if isinstance(payload.get('label'), str):
        nextv['label'] = payload['label']
    nextv['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    files[idx] = nextv
    data['mfFiles'] = files
    data['updatedAt'] = nextv['updatedAt']
    write_json_safe(RECORDS_JSON, data)
    return jsonify(ok=True, file=nextv)

# ---------- Support forms (ask/report) ----------
def write_submission(folder, data):
    os.makedirs(folder, exist_ok=True)
    json_path = os.path.join(folder, 'submissions.json')
    existing = read_json_safe(json_path, [])
    existing.append(data)
    write_json_safe(json_path, existing)

@app.post('/api/support/ask')
def support_ask():
    files = request.files.getlist('files')
    saved = []
    os.makedirs(ASK_DIR, exist_ok=True)
    for f in files[:5]:
        if not f.filename:
            continue
        safe = secure_filename(f.filename)
        dest = os.path.join(ASK_DIR, f"{int(time.time()*1000)}_{safe}")
        f.save(dest)
        saved.append({'filename': os.path.basename(dest), 'path': f"/uploads/ask/{os.path.basename(dest)}", 'mimetype': f.mimetype})
    data = {
        'createdAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'question': request.form.get('question',''),
        'email': request.form.get('email',''),
        'phone': request.form.get('phone',''),
        'category': request.form.get('category','General'),
        'categoryOther': request.form.get('categoryOther',''),
        'replyEmail': request.form.get('replyEmail','false') == 'true',
        'replySMS': request.form.get('replySMS','false') == 'true',
        'files': saved,
    }
    write_submission(ASK_DIR, data)
    return jsonify(ok=True)

@app.post('/api/support/report')
def support_report():
    files = request.files.getlist('files')
    saved = []
    os.makedirs(REPORT_DIR, exist_ok=True)
    for f in files[:5]:
        if not f.filename:
            continue
        safe = secure_filename(f.filename)
        dest = os.path.join(REPORT_DIR, f"{int(time.time()*1000)}_{safe}")
        f.save(dest)
        saved.append({'filename': os.path.basename(dest), 'path': f"/uploads/report/{os.path.basename(dest)}", 'mimetype': f.mimetype})
    data = {
        'createdAt': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'description': request.form.get('description',''),
        'email': request.form.get('email',''),
        'phone': request.form.get('phone',''),
        'category': request.form.get('category','Bug'),
        'categoryOther': request.form.get('categoryOther',''),
        'severity': request.form.get('severity','Normal'),
        'replyEmail': request.form.get('replyEmail','false') == 'true',
        'replySMS': request.form.get('replySMS','false') == 'true',
        'files': saved,
    }
    write_submission(REPORT_DIR, data)
    return jsonify(ok=True)

# ---------- Profile (JSON on disk) ----------
def _ensure_profile():
    if not os.path.exists(PROFILE_JSON):
        default = {
            'name': 'name',
            'email': 'name@example.com',
            'fullName': '',
            'mobile': '',
            'location': 'United States',
            'dateOfBirth': '',
            'sex': '',
            'bloodType': '',
            'wheelchair': False,
            'medical': {
                'emergencyContacts': [],
                'allergies': [],
                'conditions': [],
                'height': '',
                'weight': '',
                'medications': []
            },
            'settings': {
                'twoStep': False,
                'notifications': True,
                'connectCalendar': False,
                'deactivated': False
            },
            'family': {
                'parents': [ {'name':'Jane Doe','relation':'Mother'}, {'name':'John Doe','relation':'Father'} ],
                'spouse': [ {'name':'Alex Doe','relation':'Spouse'} ],
                'children': [ {'name':'Lucas Doe','relation':'Son'}, {'name':'Sophia Doe','relation':'Daughter'} ]
            },
            'pets': {
                'dogs': [ {'name':'Buddy','breed':'Labrador'}, {'name':'Max','breed':'Beagle'} ],
                'cats': [ {'name':'Whiskers','breed':'Siamese'}, {'name':'Luna','breed':'Maine Coon'} ],
                'other': [ {'name':'Tweety','kind':'Bird'}, {'name':'Nibbles','kind':'Hamster'} ]
            }
        }
        write_json_safe(PROFILE_JSON, default)

@app.get('/api/profile')
def get_profile():
    _ensure_profile()
    data = read_json_safe(PROFILE_JSON, {})
    return jsonify(ok=True, profile=data)

@app.patch('/api/profile')
def patch_profile():
    _ensure_profile()
    incoming = request.get_json(silent=True) or {}
    data = read_json_safe(PROFILE_JSON, {})
    for k in ('name','email','fullName','mobile','location','dateOfBirth','sex','bloodType'):
        if k in incoming:
            data[k] = incoming[k]
    if 'wheelchair' in incoming:
        data['wheelchair'] = bool(incoming['wheelchair'])
    if isinstance(incoming.get('medical'), dict):
        med = data.get('medical', {})
        med.update({k:v for k,v in incoming['medical'].items() if k in ('emergencyContacts','allergies','conditions','height','weight','medications')})
        data['medical'] = med
    if isinstance(incoming.get('settings'), dict):
        st = data.get('settings', {})
        st.update({k:v for k,v in incoming['settings'].items() if k in ('twoStep','notifications','connectCalendar','deactivated')})
        data['settings'] = st
    if isinstance(incoming.get('family'), dict):
        fam = data.get('family', {})
        # allow replacing arrays if provided
        for key in ('parents','spouse','children'):
            if key in incoming['family']:
                fam[key] = incoming['family'][key]
        data['family'] = fam
    if isinstance(incoming.get('pets'), dict):
        pets = data.get('pets', {})
        for key in ('dogs','cats','other'):
            if key in incoming['pets']:
                pets[key] = incoming['pets'][key]
        data['pets'] = pets
    write_json_safe(PROFILE_JSON, data)
    return jsonify(ok=True, profile=data)

# ---------- Appointments & Providers (JSON on disk) ----------
def _ensure_default_lists():
    # Ensure base files exist
    if not os.path.exists(APPOINTMENTS_JSON):
        write_json_safe(APPOINTMENTS_JSON, { 'appointments': [] })
    if not os.path.exists(PROVIDERS_JSON):
        # Try to seed from repo server/uploads/providers.json if present
        seed_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'server', 'uploads', 'providers.json'))
        if os.path.exists(seed_path):
            try:
                with open(seed_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                if isinstance(data, list):
                    write_json_safe(PROVIDERS_JSON, { 'providers': data })
                elif isinstance(data, dict) and 'providers' in data:
                    write_json_safe(PROVIDERS_JSON, data)
                else:
                    write_json_safe(PROVIDERS_JSON, { 'providers': [] })
            except Exception:
                write_json_safe(PROVIDERS_JSON, { 'providers': [] })
        else:
            write_json_safe(PROVIDERS_JSON, { 'providers': [] })


@app.get('/api/appointments')
def list_appointments():
    _ensure_default_lists()
    data = read_json_safe(APPOINTMENTS_JSON, { 'appointments': [] })
    return jsonify(ok=True, appointments=data.get('appointments', []))


@app.post('/api/appointments')
def create_appointment():
    _ensure_default_lists()
    payload = request.get_json(silent=True) or {}
    now = int(time.time() * 1000)
    aid = str(payload.get('id') or now)
    def _iso(v):
        if not v:
            return None
        if isinstance(v, (int, float)):
            try:
                return datetime.utcfromtimestamp(v/1000.0).isoformat()
            except Exception:
                return None
        if isinstance(v, str):
            # accept ISO-like
            return v
        if isinstance(v, datetime):
            return v.isoformat()
        return None

    appointment = {
        'id': aid,
        'title': payload.get('title') or 'Appointment',
        'start': _iso(payload.get('start') or datetime.utcnow().isoformat()),
        'end': _iso(payload.get('end') or (datetime.utcnow() + timedelta(minutes=30)).isoformat()),
        'providerId': payload.get('providerId'),
        'location': payload.get('location', ''),
        'reason': payload.get('reason', ''),
        'details': payload.get('details', ''),
        'status': payload.get('status', 'Active'),
    }
    data = read_json_safe(APPOINTMENTS_JSON, { 'appointments': [] })
    appts = data.get('appointments', [])
    appts.append(appointment)
    data['appointments'] = appts
    data['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    write_json_safe(APPOINTMENTS_JSON, data)
    return jsonify(ok=True, appointment=appointment)


@app.patch('/api/appointments/<aid>')
def update_appointment(aid):
    _ensure_default_lists()
    payload = request.get_json(silent=True) or {}
    data = read_json_safe(APPOINTMENTS_JSON, { 'appointments': [] })
    appts = data.get('appointments', [])
    idx = next((i for i, a in enumerate(appts) if str(a.get('id')) == str(aid)), -1)
    if idx == -1:
        return jsonify(ok=False, error='not_found'), 404
    prev = appts[idx]
    allowed = {'title','start','end','providerId','location','reason','details','status'}
    for k, v in payload.items():
        if k in allowed:
            prev[k] = v
    appts[idx] = prev
    data['appointments'] = appts
    data['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    write_json_safe(APPOINTMENTS_JSON, data)
    return jsonify(ok=True, appointment=prev)


@app.delete('/api/appointments/<aid>')
def delete_appointment(aid):
    _ensure_default_lists()
    data = read_json_safe(APPOINTMENTS_JSON, { 'appointments': [] })
    appts = data.get('appointments', [])
    new_appts = [a for a in appts if str(a.get('id')) != str(aid)]
    if len(new_appts) == len(appts):
        return jsonify(ok=False, error='not_found'), 404
    data['appointments'] = new_appts
    data['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    write_json_safe(APPOINTMENTS_JSON, data)
    return jsonify(ok=True)


@app.post('/api/appointments/suggest')
def suggest_slots():
    payload = request.get_json(silent=True) or {}
    # naive deterministic slots: next 5 hours from given date at half-hour intervals
    try:
        base_str = payload.get('date') or datetime.utcnow().isoformat()
        base = datetime.fromisoformat(base_str.replace('Z',''))
    except Exception:
        base = datetime.utcnow()
    duration = int(payload.get('durationMinutes') or 30)
    slots = []
    cursor = base.replace(minute=0, second=0, microsecond=0)
    for i in range(5):
        start = cursor + timedelta(hours=i)
        end = start + timedelta(minutes=duration)
        slots.append({'start': start.isoformat(), 'end': end.isoformat()})
    return jsonify(ok=True, slots=slots)


@app.get('/api/providers')
def list_providers():
    _ensure_default_lists()
    data = read_json_safe(PROVIDERS_JSON, { 'providers': [] })
    return jsonify(ok=True, providers=data.get('providers', []))


@app.post('/api/providers')
def create_provider():
    _ensure_default_lists()
    payload = request.get_json(silent=True) or {}
    now = int(time.time() * 1000)
    pid = str(payload.get('id') or now)
    provider = {
        'id': pid,
        'name': payload.get('name') or 'Provider',
        'email': payload.get('email', ''),
        'phone': payload.get('phone', ''),
        'npi': payload.get('npi'),
        'specialty': payload.get('specialty', ''),
        'hospital': payload.get('hospital', ''),
        'address': payload.get('address', ''),
    }
    data = read_json_safe(PROVIDERS_JSON, { 'providers': [] })
    providers = data.get('providers', [])
    # avoid duplicate by id or npi
    if any((str(p.get('id')) == provider['id']) or (p.get('npi') and provider.get('npi') and str(p['npi']) == str(provider['npi'])) for p in providers):
        return jsonify(ok=True, provider=provider)
    providers.append(provider)
    data['providers'] = providers
    data['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    write_json_safe(PROVIDERS_JSON, data)
    return jsonify(ok=True, provider=provider)

# ---------- Email OTP (Ethereal/dev friendly via SMTP) ----------
def smtp_send(to_email, subject, body):
    host = os.environ.get('SMTP_HOST')
    port = int(os.environ.get('SMTP_PORT') or '587')
    user = os.environ.get('SMTP_USER')
    password = os.environ.get('SMTP_PASS')
    from_addr = os.environ.get('SMTP_FROM') or 'no-reply@docteck.local'
    msg = MIMEText(body, 'html')
    msg['Subject'] = subject
    msg['From'] = from_addr
    msg['To'] = to_email
    with smtplib.SMTP(host, port) as s:
        s.starttls()
        if user and password:
            s.login(user, password)
        s.sendmail(from_addr, [to_email], msg.as_string())

OTP_STORE = os.path.join(UPLOAD_DIR, 'otp-store.json')

@app.post('/api/2fa/email/send')
def otp_send():
    email = (request.get_json(silent=True) or {}).get('email')
    if not email:
        return jsonify(ok=False, error='missing_email'), 400
    code = str(int(time.time()) % 1000000).zfill(6)
    store = read_json_safe(OTP_STORE, {})
    store[email] = { 'otp': code, 'expiresAt': int(time.time()) + 600 }
    write_json_safe(OTP_STORE, store)
    try:
        smtp_send(email, 'Your Docteck verification code', f'<p>Your verification code is <b>{code}</b>. It expires in 10 minutes.</p>')
    except Exception:
        pass
    return jsonify(ok=True)

@app.post('/api/2fa/email/verify')
def otp_verify():
    payload = request.get_json(silent=True) or {}
    email = payload.get('email')
    code = str(payload.get('code') or '')
    store = read_json_safe(OTP_STORE, {})
    entry = store.get(email)
    if not entry:
        return jsonify(ok=False, error='not_found'), 400
    if int(time.time()) > int(entry.get('expiresAt') or 0):
        return jsonify(ok=False, error='expired'), 400
    if str(entry.get('otp') or '') != code:
        return jsonify(ok=False, error='invalid'), 400
    store.pop(email, None)
    write_json_safe(OTP_STORE, store)
    return jsonify(ok=True)

# ---------- Stripe minimal endpoints ----------
@app.post('/api/stripe/save-card')
def stripe_save_card():
    if not STRIPE_SECRET_KEY:
        return jsonify(error='stripe_not_configured'), 500
    payload = request.get_json(silent=True) or {}
    payment_method_id = payload.get('paymentMethodId')
    user_id = (payload.get('userId') or 'demo').strip()
    if not payment_method_id:
        return jsonify(error='missing_paymentMethodId'), 400
    try:
        # Create or fetch a Stripe customer for this user, persist mapping in uploads/stripe-customers.json
        store = _stripe_store_read()
        customer_id = store.get(user_id)
        if not customer_id:
            customer = stripe.Customer.create(metadata={'userId': user_id})
            customer_id = customer['id']
            store[user_id] = customer_id
            _stripe_store_write(store)
        # Attach payment method and set as default
        stripe.PaymentMethod.attach(payment_method_id, customer=customer_id)
        stripe.Customer.modify(customer_id, invoice_settings={'default_payment_method': payment_method_id})
        return jsonify(success=True, customerId=customer_id)
    except Exception as e:
        return jsonify(error=str(e)), 500

@app.post('/api/stripe/pay')
def stripe_pay():
    if not STRIPE_SECRET_KEY:
        return jsonify(error='stripe_not_configured'), 500
    payload = request.get_json(silent=True) or {}
    amount = payload.get('amount')
    customer_id = (payload.get('customerId') or '').strip()
    payment_method_id = payload.get('paymentMethodId')
    user_id = (payload.get('userId') or '').strip()
    if not amount or not payment_method_id:
        return jsonify(error='missing_fields'), 400
    # Allow using userId instead of passing customerId explicitly
    if not customer_id and user_id and STRIPE_SECRET_KEY:
        store = _stripe_store_read()
        customer_id = (store.get(user_id) or '').strip()
    if not customer_id:
        return jsonify(error='missing_customerId'), 400
    try:
        pi = stripe.PaymentIntent.create(
            amount=int(round(float(amount) * 100)),
            currency='usd',
            customer=customer_id,
            payment_method=payment_method_id,
            off_session=True,
            confirm=True,
            description=payload.get('description') or 'Medical Payment'
        )
        return jsonify(success=True, paymentIntent=pi)
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    # Development server
    app.run(
        host='0.0.0.0',
        port=int(os.environ.get('PORT', '5050')),
        debug=True,
        use_reloader=True,
    )
