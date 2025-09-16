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

def role_required(*roles):
    def wrapper(f):
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
                
                # EN ÖNEMLİ KONTROL
                if current_user.role not in roles:
                    return jsonify({'message': 'Bu işlem için yetkiniz yok!'}), 403

            except Exception as e:
                return jsonify({'message': 'Token geçersiz!', 'error': str(e)}), 401
            
            return f(current_user, *args, **kwargs)
        return decorated
    return wrapper