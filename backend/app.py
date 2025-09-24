import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

# .env dosyasını yükle (local için)
load_dotenv()

# Flask uygulaması
app = Flask(__name__)
CORS(app)

# Secret Key
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key')

# DATABASE_URL: deploy ortamında Railway/Render vs. verir
# Local geliştirme için DATABASE_URL yoksa DATABASE_URL_LOCAL kullan
database_url = os.getenv('DATABASE_URL') or os.getenv('DATABASE_URL_LOCAL')
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Veritabanı ve migrate
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Modelleri import et
from models import Kullanici, Urun, Siparis

# API rotalarını import et
from api import auth_routes
from api import product_routes
from api import order_routes
from api import favorites_routes
from api import admin_routes

# Test endpoint
@app.route('/api/healthcheck', methods=['GET'])
def health_check():
    return jsonify(status="ok", message="Backend is running and connected to DB (theoretically)!")

# Local debug için
if __name__ == '__main__':
    # Local çalıştırma portu
    app.run(debug=True, port=5000)
