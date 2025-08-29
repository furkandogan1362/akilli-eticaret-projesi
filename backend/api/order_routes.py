# backend/api/order_routes.py

from flask import request, jsonify
from app import app, db
from models import Kullanici, Urun, Siparis
from utils.decorators import token_required # Güvenlik görevlisini import et


@app.route('/api/cart/add', methods=['POST'])
@token_required # Kapıya güvenlik görevlisini koyduk!
def add_to_cart(current_user): # Fonksiyon artık token'dan gelen kullanıcıyı alıyor
    """Bir ürünün kullanıcının sepetine eklenmesini sağlar."""
    data = request.get_json()
    # ARTIK MANUEL OLARAK user_id ALMIYORUZ!
    # kullanici_id = data.get('user_id') 
    urun_id = data.get('product_id')

    if not urun_id:
        return jsonify({'message': 'Ürün ID zorunludur!'}), 400

    # Kullanıcıyı token'dan aldık, tekrar aramaya gerek yok.
    kullanici = current_user
    urun = Urun.query.get(urun_id)

    if not urun:
        return jsonify({'message': 'Ürün bulunamadı!'}), 404

    sepet = Siparis.query.filter_by(kullanici_id=kullanici.id, durum='Beklemede').first()

    if not sepet:
        sepet = Siparis(kullanici_id=kullanici.id, toplam_fiyat=0, durum='Beklemede')
        db.session.add(sepet)

    sepet.urunler.append(urun)
    sepet.toplam_fiyat = sum(u.fiyat for u in sepet.urunler)
    db.session.commit()

    return jsonify({'message': f'"{urun.ad}" sepete eklendi!'}), 200


@app.route('/api/cart', methods=['GET'])
@token_required # 1. Değişiklik: Güvenlik görevlisini ekle
def get_cart(current_user): # 2. Değişiklik: Fonksiyona current_user parametresini ekle
    """Belirtilen kullanıcının sepet içeriğini döndürür."""
    # 3. Değişiklik: Artık URL'den user_id okumuyoruz!
    # kullanici_id = request.args.get('user_id')

    # Token'dan gelen kullanıcıyı kullanarak sepeti bul
    sepet = Siparis.query.filter_by(kullanici_id=current_user.id, durum='Beklemede').first()

    if sepet:
        return jsonify(sepet.to_dict()), 200
    else:
        return jsonify({
            'message': 'Sepet boş.',
            'urunler': [],
            'toplam_fiyat': '0.00'
        }), 200