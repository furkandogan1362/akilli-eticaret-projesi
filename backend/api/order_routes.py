# backend/api/order_routes.py

from flask import request, jsonify
from app import app, db
from models import Kullanici, Urun, Siparis, SiparisUrunleri # SiparisUrunleri'ni import et
from utils.decorators import token_required # Güvenlik görevlisini import et


@app.route('/api/cart/add', methods=['POST'])
@token_required
def add_to_cart(current_user):
    data = request.get_json()
    urun_id = data.get('product_id')

    if not urun_id:
        return jsonify({'message': 'Ürün ID zorunludur!'}), 400

    kullanici = current_user
    urun = Urun.query.get(urun_id)

    if not urun:
        return jsonify({'message': 'Ürün bulunamadı!'}), 404

    sepet = Siparis.query.filter_by(kullanici_id=kullanici.id, durum='Beklemede').first()

    if not sepet:
        sepet = Siparis(kullanici_id=kullanici.id, toplam_fiyat=0, durum='Beklemede')
        db.session.add(sepet)
        db.session.commit() # Sepeti oluşturduktan sonra ID alması için commit'liyoruz

    # Ürün sepette zaten var mı diye kontrol et
    mevcut_urun_detay = SiparisUrunleri.query.filter_by(siparis_id=sepet.id, urun_id=urun.id).first()

    if mevcut_urun_detay:
        # Varsa, adedini bir artır
        mevcut_urun_detay.adet += 1
        mesaj = f'"{urun.ad}" sepetinize bir adet daha eklendi!'
    else:
        # Yoksa, adedi 1 olarak yeni bir kayıt oluştur
        yeni_urun_detay = SiparisUrunleri(siparis_id=sepet.id, urun_id=urun.id, adet=1)
        db.session.add(yeni_urun_detay)
        mesaj = f'"{urun.ad}" sepete eklendi!'

    # Toplam fiyatı yeniden hesapla (adet * fiyat)
    sepet.toplam_fiyat = sum(detay.urun.fiyat * detay.adet for detay in sepet.urun_detaylari.all())

    db.session.commit()

    return jsonify({'message': mesaj}), 200


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
    

@app.route('/api/cart/update/<int:urun_id>', methods=['PUT'])
@token_required
def update_cart_item(current_user, urun_id):
    """Sepetteki bir ürünün adedini günceller."""
    data = request.get_json()
    new_quantity = data.get('adet')

    if new_quantity is None or not isinstance(new_quantity, int) or new_quantity <= 0:
        return jsonify({'message': 'Geçerli bir adet girilmelidir!'}), 400

    sepet = Siparis.query.filter_by(kullanici_id=current_user.id, durum='Beklemede').first()
    if not sepet:
        return jsonify({'message': 'Sepet bulunamadı!'}), 404

    item_to_update = SiparisUrunleri.query.filter_by(siparis_id=sepet.id, urun_id=urun_id).first()
    if not item_to_update:
        return jsonify({'message': 'Ürün sepette bulunamadı!'}), 404

    item_to_update.adet = new_quantity

    # Toplam fiyatı yeniden hesapla
    sepet.toplam_fiyat = sum(detay.urun.fiyat * detay.adet for detay in sepet.urun_detaylari.all())
    db.session.commit()

    return jsonify(sepet.to_dict()), 200


@app.route('/api/cart/remove/<int:urun_id>', methods=['DELETE'])
@token_required
def remove_cart_item(current_user, urun_id):
    """Bir ürünü sepetten tamamen siler."""
    sepet = Siparis.query.filter_by(kullanici_id=current_user.id, durum='Beklemede').first()
    if not sepet:
        return jsonify({'message': 'Sepet bulunamadı!'}), 404

    item_to_remove = SiparisUrunleri.query.filter_by(siparis_id=sepet.id, urun_id=urun_id).first()
    if not item_to_remove:
        return jsonify({'message': 'Ürün sepette bulunamadı!'}), 404

    db.session.delete(item_to_remove)

    # Toplam fiyatı yeniden hesapla
    sepet.toplam_fiyat = sum(detay.urun.fiyat * detay.adet for detay in sepet.urun_detaylari.all())
    db.session.commit()

    return jsonify(sepet.to_dict()), 200    