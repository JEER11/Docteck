from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
# Allow simple CORS for /api/* endpoints (adjust origins in production)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/hello')
def hello():
    return jsonify(message="Hello from Flask", success=True)

@app.route('/api/echo', methods=['POST'])
def echo():
    data = request.get_json() or {}
    return jsonify(received=data)

@app.route('/health')
def health():
    return 'ok', 200

if __name__ == '__main__':
    # For local development only. Use a proper WSGI server in production.
    app.run(host='0.0.0.0', port=5000, debug=True)
