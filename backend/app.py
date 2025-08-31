# backend/app.py

import os
from dotenv import load_dotenv # Bu satırı import et
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate # Bu satırı ekle

load_dotenv() # .env dosyasındaki değişkenleri yükler


# Uygulamayı ve veritabanını başlat
db = SQLAlchemy()
app = Flask(__name__)
CORS(app)

# Veritabanı yapılandırması
basedir = os.path.abspath(os.path.dirname(__file__))
# YENİ HALİ
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Veritabanını uygulamaya bağla
db.init_app(app)
migrate = Migrate(app, db) # Bu satırı ekle

# Test endpoint'i
@app.route('/api/healthcheck', methods=['GET'])
def health_check():
    return jsonify(status="ok", message="Backend is running and connected to DB (theoretically)!")

# Modelleri içeri aktar (uygulama ve db oluşturulduktan sonra)
from models import Kullanici, Urun, Siparis

# API rotalarını içeri aktar
from api import auth_routes
from api import product_routes
from api import order_routes # Bu satırı ekle
from api import favorites_routes # Bu satırı ekle


if __name__ == '__main__':
    app.run(debug=True, port=5000)