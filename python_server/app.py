from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from file_analysis import ocr_image
from tasks import create_ocr_task

app = Flask(__name__)
# Allow simple CORS for /api/* endpoints (adjust origins in production)
CORS(app, resources={r"/api/*": {"origins": "*"}})

UPLOAD_DIR = os.environ.get('UPLOAD_DIR', '/tmp/uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)


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


if __name__ == '__main__':
    # For development only; production should use gunicorn
    app.run(host='0.0.0.0', port=5000, debug=True)
