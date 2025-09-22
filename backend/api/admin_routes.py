# backend/api/admin_routes.py

from flask import request, jsonify
from app import app, db
# Değişiklik: SQLAlchemy'den 'or_' fonksiyonunu import et
from models import Urun, Kullanici, SiparisUrunleri, kullanici_favorileri, Siparis
from sqlalchemy import or_
from utils.decorators import role_required

# --- ÜRÜN YÖNETİMİ ---

@app.route('/api/admin/products', methods=['POST'])
@role_required('admin', 'moderator')
def add_product(current_user):
    data = request.get_json()
    required_fields = ['ad', 'aciklama', 'fiyat', 'stok_miktari']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Tüm zorunlu alanlar doldurulmalıdır!'}), 400
    try:
        fiyat = float(data['fiyat'])
        stok_miktari = int(data['stok_miktari'])
        if fiyat < 0 or stok_miktari < 0:
            return jsonify({'message': 'Fiyat ve stok negatif olamaz!'}), 400
    except (ValueError, TypeError):
        return jsonify({'message': 'Fiyat ve stok adedi sayısal bir değer olmalıdır!'}), 400

    yeni_urun = Urun(
        ad=data['ad'],
        aciklama=data['aciklama'],
        fiyat=fiyat,
        stok_miktari=stok_miktari,
        resim_url=data.get('resim_url')
    )
    db.session.add(yeni_urun)
    db.session.commit()
    return jsonify(yeni_urun.to_dict()), 201

@app.route('/api/admin/products/<int:urun_id>', methods=['PUT'])
@role_required('admin', 'moderator')
def update_product(current_user, urun_id):
    urun = Urun.query.get_or_404(urun_id)
    data = request.get_json()
    urun.ad = data.get('ad', urun.ad)
    urun.aciklama = data.get('aciklama', urun.aciklama)
    urun.fiyat = data.get('fiyat', urun.fiyat)
    urun.stok_miktari = data.get('stok_miktari', urun.stok_miktari)
    urun.resim_url = data.get('resim_url', urun.resim_url)
    db.session.commit()
    return jsonify(urun.to_dict()), 200

@app.route('/api/admin/products/<int:urun_id>', methods=['DELETE'])
@role_required('admin', 'moderator')
def delete_product(current_user, urun_id):
    urun = Urun.query.get_or_404(urun_id)
    try:
        SiparisUrunleri.query.filter_by(urun_id=urun_id).delete()
        delete_favorites_stmt = kullanici_favorileri.delete().where(kullanici_favorileri.c.urun_id == urun_id)
        db.session.execute(delete_favorites_stmt)
        db.session.delete(urun)
        db.session.commit()
        return jsonify({'message': 'Ürün ve ilgili tüm kayıtlar başarıyla silindi.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Ürün silinirken bir hata oluştu.', 'error': str(e)}), 500

# --- KULLANICI YÖNETİMİ ---

@app.route('/api/admin/users', methods=['GET', 'POST'])
@role_required('admin', 'moderator')
def manage_users(current_user):
    if request.method == 'POST':
        # Artık hem admin hem moderatör kullanıcı ekleyebilir

        data = request.get_json()
        required_fields = ['ad', 'soyad', 'email', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({'message': 'Tüm alanlar (ad, soyad, email, şifre) zorunludur!'}), 400
        if Kullanici.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Bu e-posta adresi zaten kullanılıyor!'}), 409

        # Moderatör tarafından oluşturulan kullanıcıların rolü her zaman 'user' olur
        role = 'user'
        if 'role' in data and data['role'] in ['user', 'moderator']:
            if current_user.id == 1:  # Sadece ana admin rol atayabilir
                role = data['role']
            # Moderatörler rol atayamaz, varsayılan 'user' kullanılır

        try:
            yeni_kullanici = Kullanici(
                email=data['email'], 
                ad=data['ad'], 
                soyad=data['soyad'],
                role=role
            )
            yeni_kullanici.set_sifre(data['password'])
            db.session.add(yeni_kullanici)
            db.session.commit()

            user_data = {
                'id': yeni_kullanici.id,
                'email': yeni_kullanici.email,
                'ad': yeni_kullanici.ad,
                'soyad': yeni_kullanici.soyad,
                'role': yeni_kullanici.role,
                'olusturulma_tarihi': yeni_kullanici.olusturulma_tarihi.isoformat()
            }
            return jsonify(user_data), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': 'Kullanıcı oluşturulurken bir hata oluştu.', 'error': str(e)}), 500

    if request.method == 'GET':
        # Temel sorgu: tüm kullanıcılar
        query = Kullanici.query

        # 1. ROL FİLTRESİ
        role_filter = request.args.get('role', type=str)
        if role_filter and role_filter in ['admin', 'moderator', 'user']:
            query = query.filter(Kullanici.role == role_filter)

        # 2. ARAMA PARAMETRESİ
        search_term = request.args.get('search', type=str)
        if search_term:
            search_pattern = f"%{search_term}%"
            query = query.filter(or_(
                (Kullanici.ad + ' ' + Kullanici.soyad).ilike(search_pattern),
                Kullanici.email.ilike(search_pattern)
            ))

        # Sorguyu ID'ye göre sırala ve çalıştır
        kullanicilar = query.order_by(Kullanici.id).all()
        
        user_list = [{
            'id': u.id,
            'email': u.email,
            'ad': u.ad,
            'soyad': u.soyad,
            'role': u.role,
            'olusturulma_tarihi': u.olusturulma_tarihi.isoformat() if u.olusturulma_tarihi else None
        } for u in kullanicilar]
        return jsonify(user_list), 200


@app.route('/api/admin/users/<int:kullanici_id>', methods=['PUT'])
@role_required('admin', 'moderator')
def update_user(current_user, kullanici_id):
    if kullanici_id == 1:
        return jsonify({'message': 'Ana admin hesabı değiştirilemez!'}), 403
    user_to_update = Kullanici.query.get_or_404(kullanici_id)

    if current_user.role == 'moderator' and user_to_update.role in ['admin', 'moderator']:
        return jsonify({'message': 'Moderatörler, diğer yetkilileri güncelleyemez!'}), 403
    
    data = request.get_json()
    if 'email' in data and data['email'] != user_to_update.email:
        if Kullanici.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Bu e-posta adresi zaten başka bir kullanıcı tarafından kullanılıyor!'}), 409
    if 'role' in data and data['role'] != user_to_update.role:
        # Sadece rol DEĞİŞTİRİLMEYE çalışılıyorsa bu bloğa gir
        if current_user.id != 1: # Sadece ana admin rol değiştirebilir
            return jsonify({'message': 'Rol atama yetkiniz yok!'}), 403
        if data['role'] not in ['user', 'moderator']:
            return jsonify({'message': "Geçersiz rol! Sadece 'user' veya 'moderator' atanabilir."}), 400
        user_to_update.role = data['role']
    user_to_update.ad = data.get('ad', user_to_update.ad)
    user_to_update.soyad = data.get('soyad', user_to_update.soyad)
    user_to_update.email = data.get('email', user_to_update.email)
    if 'password' in data and data['password']:
        user_to_update.set_sifre(data['password'])
    db.session.commit()
    user_data = {
        'id': user_to_update.id, 'email': user_to_update.email, 'ad': user_to_update.ad,
        'soyad': user_to_update.soyad, 'role': user_to_update.role,
        'olusturulma_tarihi': user_to_update.olusturulma_tarihi.isoformat()
    }
    return jsonify(user_data), 200

@app.route('/api/admin/users/<int:kullanici_id>', methods=['DELETE'])
@role_required('admin', 'moderator')
def delete_user(current_user, kullanici_id):
    if kullanici_id == 1:
        return jsonify({'message': 'Ana admin hesabı silinemez!'}), 403
    user_to_delete = Kullanici.query.get_or_404(kullanici_id)
    if current_user.role == 'moderator' and user_to_delete.role in ['admin', 'moderator']:
        return jsonify({'message': 'Moderatörler, diğer yetkilileri silemez!'}), 403
    try:
        kullanici_siparisleri = Siparis.query.filter_by(kullanici_id=user_to_delete.id).all()
        for siparis in kullanici_siparisleri:
            SiparisUrunleri.query.filter_by(siparis_id=siparis.id).delete()
            db.session.delete(siparis)
        delete_favorites_stmt = kullanici_favorileri.delete().where(kullanici_favorileri.c.kullanici_id == user_to_delete.id)
        db.session.execute(delete_favorites_stmt)
        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({'message': 'Kullanıcı ve ilgili tüm kayıtları başarıyla silindi.'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Kullanıcı silinirken bir hata oluştu.', 'error': str(e)}), 500
