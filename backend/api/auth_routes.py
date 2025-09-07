# backend/api/auth_routes.py

from flask import request, jsonify
from app import app, db # Ana uygulamamızdan app ve db objelerini alıyoruz
from models import Kullanici # Kullanıcı modelimizi alıyoruz
import jwt
from datetime import datetime, timedelta, timezone

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    # Yeni alanları da al
    if not data or not data.get('email') or not data.get('password') or not data.get('ad') or not data.get('soyad'):
        return jsonify({'message': 'Tüm alanlar zorunludur!'}), 400

    if Kullanici.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Bu e-posta adresi zaten kullanılıyor!'}), 409

    # Yeni kullanıcıyı ad ve soyad ile oluştur
    yeni_kullanici = Kullanici(
        email=data['email'],
        ad=data['ad'],
        soyad=data['soyad']
    )
    yeni_kullanici.set_sifre(data['password'])

    if Kullanici.query.count() == 0:
        yeni_kullanici.is_admin = True

    db.session.add(yeni_kullanici)
    db.session.commit()
    return jsonify({'message': 'Kullanıcı başarıyla oluşturuldu!'}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Kullanıcı girişi yapar ve JWT token döndürür."""
    data = request.get_json()

    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'E-posta ve şifre alanları zorunludur!'}), 400

    kullanici = Kullanici.query.filter_by(email=data['email']).first()

    if not kullanici or not kullanici.check_sifre(data['password']):
        return jsonify({'message': 'Geçersiz e-posta veya şifre!'}), 401

    # --- EN ÖNEMLİ KISIM BURASI ---
    # Token'ı oluştururken 'is_admin' bilgisini payload'a eklediğimizden emin olmalıyız.
    token = jwt.encode({
        'user_id': kullanici.id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24),
        'is_admin': kullanici.is_admin ,
        'full_name': f"{kullanici.ad} {kullanici.soyad}" # YENİ

    }, app.config['SECRET_KEY'], algorithm="HS256")

    # Cevapta da bu bilgiyi gönderiyoruz
    return jsonify({
        'token': token,
        'is_admin': kullanici.is_admin 
    }), 200