# backend/utils/decorators.py

from functools import wraps
import jwt
from flask import request, jsonify, current_app
from models import Kullanici

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # 'Authorization' başlığının request'te olup olmadığını kontrol et
        if 'Authorization' in request.headers:
            # Header'ı al (örn: "Bearer ...token...")
            auth_header = request.headers['Authorization']
            # "Bearer " kısmını ayırarak sadece token'ı al
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Bearer token formatı hatalı!'}), 401

        if not token:
            return jsonify({'message': 'Token bulunamadı!'}), 401

        try:
            # Token'ı gizli anahtarla çözerek içindeki veriyi al
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            # Token'ın içindeki user_id ile veritabanından kullanıcıyı bul
            current_user = Kullanici.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'Token geçersiz kullanıcıya ait!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token süresi dolmuş!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token geçersiz!', 'error': str(e)}), 401

        # Her şey yolundaysa, asıl fonksiyonu (route) çalıştır ve
        # bulunan kullanıcıyı parametre olarak gönder
        return f(current_user, *args, **kwargs)

    return decorated