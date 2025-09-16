# backend/models.py

from app import db
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# YENİ YARDIMCI TABLO
kullanici_favorileri = db.Table('kullanici_favorileri',
    db.Column('kullanici_id', db.Integer, db.ForeignKey('kullanici.id'), primary_key=True),
    db.Column('urun_id', db.Integer, db.ForeignKey('urun.id'), primary_key=True)
)

# ARTIK BASİT BİR YARDIMCI TABLO DEĞİL, TAM BİR MODEL
class SiparisUrunleri(db.Model):
    __tablename__ = 'siparis_urunleri'
    siparis_id = db.Column(db.Integer, db.ForeignKey('siparis.id'), primary_key=True)
    urun_id = db.Column(db.Integer, db.ForeignKey('urun.id'), primary_key=True)
    adet = db.Column(db.Integer, nullable=False, default=1)

    # İlişkileri kuruyoruz
    urun = db.relationship("Urun")
    siparis = db.relationship("Siparis")


class Kullanici(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    sifre_hash = db.Column(db.String(256), nullable=False)
    olusturulma_tarihi = db.Column(db.DateTime, default=datetime.datetime.utcnow)
     # YENİ ALANLAR
    ad = db.Column(db.String(50), nullable=True)
    soyad = db.Column(db.String(50), nullable=True)
    # YENİ ROLE ALANI
    role = db.Column(db.String(20), nullable=False, default='user') # roller: 'user', 'moderator', 'admin'

    siparisler = db.relationship('Siparis', backref='kullanici', lazy=True)

    # YENİ İLİŞKİ
    favori_urunler = db.relationship('Urun', secondary=kullanici_favorileri, lazy='dynamic',
        backref=db.backref('favorileyen_kullanicilar', lazy=True))

    def set_sifre(self, sifre):
        self.sifre_hash = generate_password_hash(sifre)

    def check_sifre(self, sifre):
        return check_password_hash(self.sifre_hash, sifre)

    def __repr__(self):
        return f'<Kullanici {self.email}>'

class Urun(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ad = db.Column(db.String(100), nullable=False)
    aciklama = db.Column(db.Text, nullable=False)
    fiyat = db.Column(db.Numeric(10, 2), nullable=False)
    stok_miktari = db.Column(db.Integer, nullable=False, default=0)
    resim_url = db.Column(db.String(255), nullable=True)
    olusturulma_tarihi = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {'id': self.id, 'ad': self.ad, 'aciklama': self.aciklama, 'fiyat': str(self.fiyat), 'stok_miktari': self.stok_miktari, 'resim_url': self.resim_url}

    def __repr__(self):
        return f'<Urun {self.ad}>'

class Siparis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    kullanici_id = db.Column(db.Integer, db.ForeignKey('kullanici.id'), nullable=False)
    toplam_fiyat = db.Column(db.Numeric(10, 2), nullable=False)
    durum = db.Column(db.String(50), nullable=False, default='Beklemede')
    olusturulma_tarihi = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # İLİŞKİ GÜNCELLENDİ: ARTIK DOĞRUDAN ÜRÜNLERE DEĞİL, YARDIMCI MODELE BAĞLI
    urun_detaylari = db.relationship('SiparisUrunleri', backref='siparis_detay', lazy='dynamic')

    def to_dict(self):
        urunler_listesi = []
        for detay in self.urun_detaylari:
            urun_dict = detay.urun.to_dict()
            urun_dict['adet'] = detay.adet
            urunler_listesi.append(urun_dict)

        return {
            'id': self.id,
            'kullanici_id': self.kullanici_id,
            'toplam_fiyat': str(self.toplam_fiyat),
            'durum': self.durum,
            'olusturulma_tarihi': self.olusturulma_tarihi.isoformat(),
            'urunler': urunler_listesi
        }

    def __repr__(self):
        return f'<Siparis {self.id}>'