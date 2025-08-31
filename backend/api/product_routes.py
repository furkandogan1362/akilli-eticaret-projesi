# backend/api/product_routes.py

from flask import jsonify, request # request'i import ediyoruz
from app import app
from models import Urun
from sqlalchemy import or_ # SQLAlchemy'den or_ fonksiyonunu import ediyoruz

@app.route('/api/products', methods=['GET'])
def get_all_products():
    """
    Veritabanındaki ürünleri listeler.
    Arama ve filtreleme için URL query parametrelerini kabul eder.
    Örnekler:
    - /api/products?search=laptop
    - /api/products?price_range=0-2500
    - /api/products?stock_status=var
    - /api/products?search=monitör&price_range=5000-10000
    """
    # Temel sorguyu başlatıyoruz: tüm ürünler
    query = Urun.query

    # 1. ARAMA (SEARCH) PARAMETRESİ
    search_term = request.args.get('search', type=str)
    if search_term:
        # Arama teriminin büyük/küçük harf duyarsız olmasını sağlıyoruz
        search_pattern = f"%{search_term}%"
        # 'ad' VEYA 'aciklama' alanında arama yapıyoruz
        query = query.filter(or_(Urun.ad.ilike(search_pattern), Urun.aciklama.ilike(search_pattern)))

    # 2. FİYAT ARALIĞI (PRICE RANGE) FİLTRESİ
    price_range = request.args.get('price_range', type=str)
    if price_range:
        if price_range == "0-2500":
            query = query.filter(Urun.fiyat >= 0, Urun.fiyat <= 2500)
        elif price_range == "2500-5000":
            query = query.filter(Urun.fiyat > 2500, Urun.fiyat <= 5000)
        elif price_range == "5000-10000":
            query = query.filter(Urun.fiyat > 5000, Urun.fiyat <= 10000)
        elif price_range == "10000+":
            query = query.filter(Urun.fiyat > 10000)

    # 3. STOK DURUMU (STOCK STATUS) FİLTRESİ
    stock_status = request.args.get('stock_status', type=str)
    if stock_status:
        if stock_status == "var":
            query = query.filter(Urun.stok_miktari > 0)
        elif stock_status == "tukendi":
            query = query.filter(Urun.stok_miktari == 0)

    # Tüm filtreler uygulandıktan sonra sorguyu çalıştır
    urunler = query.all()

    urun_listesi = [urun.to_dict() for urun in urunler]
    return jsonify(urun_listesi), 200


@app.route('/api/products/<int:urun_id>', methods=['GET'])
def get_product_by_id(urun_id):
    """ID'ye göre tek bir ürünün detayını döndürür."""
    urun = Urun.query.get_or_404(urun_id)
    return jsonify(urun.to_dict()), 200