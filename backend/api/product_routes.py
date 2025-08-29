# backend/api/product_routes.py

from flask import jsonify
from app import app
from models import Urun

@app.route('/api/products', methods=['GET'])
def get_all_products():
    """Veritabanındaki tüm ürünleri listeler."""
    # Veritabanından tüm ürünleri çek
    urunler = Urun.query.all()
    # Her bir ürün nesnesini to_dict() fonksiyonu ile sözlüğe çevir ve bir liste oluştur
    urun_listesi = [urun.to_dict() for urun in urunler]
    return jsonify(urun_listesi), 200


@app.route('/api/products/<int:urun_id>', methods=['GET'])
def get_product_by_id(urun_id):
    """ID'ye göre tek bir ürünün detayını döndürür."""
    # Verilen ID'ye sahip ürünü bul, bulamazsan 404 hatası ver
    urun = Urun.query.get_or_404(urun_id)
    return jsonify(urun.to_dict()), 200