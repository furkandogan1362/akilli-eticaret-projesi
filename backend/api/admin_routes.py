# backend/api/admin_routes.py

from flask import request, jsonify
from app import app, db
from models import Urun, Kullanici , SiparisUrunleri, kullanici_favorileri ,Siparis
from utils.decorators import admin_required

# --- ÜRÜN YÖNETİMİ ---

@app.route('/api/admin/products', methods=['POST'])
@admin_required
def add_product(current_user):
    data = request.get_json()

    # 1. Gerekli alanlar var mı diye kontrol et
    required_fields = ['ad', 'aciklama', 'fiyat', 'stok_miktari']
    if not all(field in data for field in required_fields):
        return jsonify({'message': 'Tüm zorunlu alanlar doldurulmalıdır!'}), 400

    try:
        # 2. Gelen veriyi doğru tiplere dönüştür
        ad = str(data['ad'])
        aciklama = str(data['aciklama'])
        fiyat = float(data['fiyat'])
        stok_miktari = int(data['stok_miktari'])
        resim_url = data.get('resim_url') # Bu alan zorunlu değil

        # Fiyat ve stok negatif olamaz
        if fiyat < 0 or stok_miktari < 0:
            return jsonify({'message': 'Fiyat ve stok negatif olamaz!'}), 400

    except (ValueError, TypeError):
        # Eğer 'fiyat' veya 'stok_miktari' sayıya dönüştürülemezse
        return jsonify({'message': 'Fiyat ve stok adedi sayısal bir değer olmalıdır!'}), 400

    # 3. Veritabanına yeni ürünü ekle
    yeni_urun = Urun(
        ad=ad,
        aciklama=aciklama,
        fiyat=fiyat,
        stok_miktari=stok_miktari,
        resim_url=resim_url
    )
    db.session.add(yeni_urun)
    db.session.commit()
    return jsonify(yeni_urun.to_dict()), 201

@app.route('/api/admin/products/<int:urun_id>', methods=['PUT'])
@admin_required
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

# Değişiklik 2: delete_product fonksiyonunu tamamen güncelle
@app.route('/api/admin/products/<int:urun_id>', methods=['DELETE'])
@admin_required
def delete_product(current_user, urun_id):
    urun = Urun.query.get_or_404(urun_id)

    try:
        # ADIM A: Bu ürünün geçtiği tüm sepet kayıtlarını sil
        SiparisUrunleri.query.filter_by(urun_id=urun_id).delete()

        # ADIM B: Bu ürünün geçtiği tüm favori kayıtlarını sil
        # Bunun için yardımcı tablo üzerinde doğrudan bir silme sorgusu çalıştırıyoruz
        delete_favorites_stmt = kullanici_favorileri.delete().where(
            kullanici_favorileri.c.urun_id == urun_id
        )
        db.session.execute(delete_favorites_stmt)

        # ADIM C: Artık ürün güvende, kendisini silebiliriz
        db.session.delete(urun)

        # Tüm değişiklikleri veritabanına işle
        db.session.commit()

        return jsonify({'message': 'Ürün ve ilgili tüm kayıtlar başarıyla silindi.'}), 200

    except Exception as e:
        db.session.rollback() # Bir hata olursa, yapılan tüm işlemleri geri al
        return jsonify({'message': 'Ürün silinirken bir hata oluştu.', 'error': str(e)}), 500

# --- KULLANICI YÖNETİMİ ---

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_all_users(current_user):
    kullanicilar = Kullanici.query.all()
    # Not: Şifre hash'ini asla gönderme!
    user_list = [{
        'id': u.id, 'email': u.email, 'is_admin': u.is_admin,
        'olusturulma_tarihi': u.olusturulma_tarihi.isoformat()
    } for u in kullanicilar]
    return jsonify(user_list), 200

@app.route('/api/admin/users/<int:kullanici_id>', methods=['DELETE'])
@admin_required
def delete_user(current_user, kullanici_id):
    if current_user.id == kullanici_id:
        return jsonify({'message': 'Admin kendi hesabını silemez.'}), 403

    kullanici_to_delete = Kullanici.query.get_or_404(kullanici_id)

    try:
        # ADIM 1: Kullanıcının tüm siparişlerini ve ilgili sepet detaylarını sil
        # Önce kullanıcının siparişlerini bul
        kullanici_siparisleri = Siparis.query.filter_by(kullanici_id=kullanici_to_delete.id).all()
        for siparis in kullanici_siparisleri:
            # Her bir siparişe bağlı sepet ürünlerini (SiparisUrunleri) sil
            SiparisUrunleri.query.filter_by(siparis_id=siparis.id).delete()
            # Sonra siparişin kendisini sil
            db.session.delete(siparis)

        # ADIM 2: Kullanıcının tüm favori kayıtlarını sil
        delete_favorites_stmt = kullanici_favorileri.delete().where(
            kullanici_favorileri.c.kullanici_id == kullanici_to_delete.id
        )
        db.session.execute(delete_favorites_stmt)

        # ADIM 3: Artık kullanıcıyı güvenle silebiliriz
        db.session.delete(kullanici_to_delete)

        db.session.commit()
        return jsonify({'message': 'Kullanıcı ve ilgili tüm kayıtları başarıyla silindi.'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Kullanıcı silinirken bir hata oluştu.', 'error': str(e)}), 500