# backend/api/auth_routes.py

from flask import request, jsonify
from app import app, db # Ana uygulamamızdan app ve db objelerini alıyoruz
from models import Kullanici # Kullanıcı modelimizi alıyoruz
import jwt
from datetime import datetime, timedelta, timezone

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Yeni bir kullanıcıyı kaydeder."""
    # İstekten gelen JSON verisini al
    data = request.get_json()

    # Gerekli alanlar var mı kontrol et
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'E-posta ve şifre alanları zorunludur!'}), 400

    # E-posta daha önce alınmış mı kontrol et
    if Kullanici.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Bu e-posta adresi zaten kullanılıyor!'}), 409

    # Yeni bir Kullanici nesnesi oluştur
    yeni_kullanici = Kullanici(email=data['email'])
    # Modeldaki fonksiyonu kullanarak şifreyi hash'le ve kaydet
    yeni_kullanici.set_sifre(data['password'])

    # Veritabanına ekle ve değişiklikleri kaydet
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

    # Token oluşturma
    token = jwt.encode({
        'user_id': kullanici.id,
        'exp': datetime.now(timezone.utc) + timedelta(hours=24) # Token 24 saat geçerli olacak
    }, app.config['SECRET_KEY'], algorithm="HS256")

    return jsonify({'token': token}), 200