# backend/api/favorites_routes.py

from flask import jsonify
from app import app, db
from models import Urun
from utils.decorators import token_required
from models import Urun, kullanici_favorileri # YENİ: kullanici_favorileri tablosunu import et


@app.route('/api/favorites', methods=['GET'])
@token_required
def get_favorites(current_user):
    """Giriş yapmış kullanıcının favori ürünlerini listeler."""
    fav_urunler = current_user.favori_urunler.all()
    return jsonify([urun.to_dict() for urun in fav_urunler]), 200

@app.route('/api/favorites/add/<int:urun_id>', methods=['POST'])
@token_required
def add_favorite(current_user, urun_id):
    """Bir ürünü kullanıcının favorilerine ekler."""
    urun = Urun.query.get_or_404(urun_id)

    if urun in current_user.favori_urunler:
        return jsonify({'message': 'Ürün zaten favorilerinizde.'}), 409

    current_user.favori_urunler.append(urun)
    db.session.commit()
    return jsonify({'message': 'Ürün favorilere eklendi.'}), 200

@app.route('/api/favorites/remove/<int:urun_id>', methods=['DELETE'])
@token_required
def remove_favorite(current_user, urun_id):
    """Bir ürünü kullanıcının favorilerinden çıkarır."""
    # Ürünün var olup olmadığını kontrol et
    urun = Urun.query.get(urun_id)
    if not urun:
        return jsonify({'message': 'Böyle bir ürün bulunamadı!'}), 404

    # DÜZELTİLMİŞ KONTROL:
    # 'in' operatörü yerine, SQLAlchemy'nin .filter() metoduyla
    # favorinin varlığını doğrudan kontrol ediyoruz. Bu daha güvenilirdir.
    favori_var_mi = current_user.favori_urunler.filter(
        kullanici_favorileri.c.urun_id == urun_id
    ).first()

    if not favori_var_mi:
        return jsonify({'message': 'Ürün zaten favorilerinizde değil.'}), 404

    # Ürünü favorilerden çıkar
    current_user.favori_urunler.remove(urun)
    db.session.commit()
    return jsonify({'message': 'Ürün favorilerden kaldırıldı.'}), 200