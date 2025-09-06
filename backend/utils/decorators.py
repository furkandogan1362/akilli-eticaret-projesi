# backend/utils/decorators.py

from functools import wraps
import jwt
from flask import request, jsonify, current_app
from models import Kullanici

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Bearer token formatı hatalı!'}), 401

        if not token:
            return jsonify({'message': 'Token bulunamadı!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = Kullanici.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'Token geçersiz kullanıcıya ait!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token süresi dolmuş!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token geçersiz!', 'error': str(e)}), 401

        return f(current_user, *args, **kwargs)

    return decorated


# --- DÜZELTİLMİŞ VE BASİTLEŞTİRİLMİŞ ADMIN DECORATOR'I ---
def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            try:
                token = request.headers['Authorization'].split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Bearer token formatı hatalı!'}), 401

        if not token:
            return jsonify({'message': 'Token bulunamadı!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = Kullanici.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': 'Token geçersiz kullanıcıya ait!'}), 401

            # EN ÖNEMLİ KONTROL BURADA
            if not current_user.is_admin:
                return jsonify({'message': 'Bu kaynağa erişim yetkiniz yok!'}), 403 # 403 Forbidden

        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token süresi dolmuş!'}), 401
        except Exception as e:
            return jsonify({'message': 'Token geçersiz!', 'error': str(e)}), 401

        # Tüm kontrollerden geçerse, asıl fonksiyonu çalıştır
        return f(current_user, *args, **kwargs)

    return decorated