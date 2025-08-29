# ml-service/app.py
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/healthcheck', methods=['GET'])
def health_check():
    return jsonify(status="ok", message="ML Service is running!")

if __name__ == '__main__':
    app.run(debug=True, port=5001)