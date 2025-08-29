# backend/models.py

from app import db # app.py'de oluşturduğumuz db objesini içeri aktarıyoruz
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

# Siparişler ve Ürünler arasındaki çoktan-çoğa ilişkiyi kuracak olan yardımcı tablo
# Bu bir model sınıfı değil, doğrudan bir SQLAlchemy Tablo objesi
siparis_urunleri = db.Table('siparis_urunleri',
    db.Column('siparis_id', db.Integer, db.ForeignKey('siparis.id'), primary_key=True),
    db.Column('urun_id', db.Integer, db.ForeignKey('urun.id'), primary_key=True),
    db.Column('adet', db.Integer, default=1) # Siparişte bu üründen kaç tane olduğu
)

class Kullanici(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    sifre_hash = db.Column(db.String(256), nullable=False) # Hash uzun olabileceği için String boyutunu artıralım
    olusturulma_tarihi = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    siparisler = db.relationship('Siparis', backref='kullanici', lazy=True)

    # YENİ FONKSİYONLAR
    def set_sifre(self, sifre):
        """Verilen şifreyi hash'ler ve sifre_hash alanına kaydeder."""
        self.sifre_hash = generate_password_hash(sifre)

    def check_sifre(self, sifre):
        """Verilen şifrenin hash ile uyuşup uyuşmadığını kontrol eder."""
        return check_password_hash(self.sifre_hash, sifre)
    # YENİ FONKSİYONLARIN SONU

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

    # YENİ FONKSİYON
    def to_dict(self):
        """Ürün nesnesini sözlük formatına dönüştürür."""
        return {
            'id': self.id,
            'ad': self.ad,
            'aciklama': self.aciklama,
            # Fiyat Numeric tipinde olduğu için string'e çevirmek en güvenlisidir
            'fiyat': str(self.fiyat),
            'stok_miktari': self.stok_miktari,
            'resim_url': self.resim_url
        }
    # YENİ FONKSİYONUN SONU

    def __repr__(self):
        return f'<Urun {self.ad}>'


class Siparis(db.Model):
    id = db.Column(db.Integer, primary_key=True) # Benzersiz sipariş ID'si
    kullanici_id = db.Column(db.Integer, db.ForeignKey('kullanici.id'), nullable=False) # Siparişi veren kullanıcının ID'si
    toplam_fiyat = db.Column(db.Numeric(10, 2), nullable=False) # Siparişin toplam tutarı
    durum = db.Column(db.String(50), nullable=False, default='Beklemede') # Sipariş durumu (Beklemede, Kargolandı, Teslim Edildi)
    olusturulma_tarihi = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Bir siparişin içinde birden çok ürün olabilir ilişkisi (yardımcı tablo aracılığıyla)
    urunler = db.relationship('Urun', secondary=siparis_urunleri, lazy='subquery',
        backref=db.backref('siparisler', lazy=True))
    
    # YENİ FONKSİYON
    def to_dict(self):
        """Sipariş nesnesini ve içindeki ürünleri sözlük formatına dönüştürür."""
        return {
            'id': self.id,
            'kullanici_id': self.kullanici_id,
            'toplam_fiyat': str(self.toplam_fiyat),
            'durum': self.durum,
            'olusturulma_tarihi': self.olusturulma_tarihi.isoformat(),
            # Siparişin içindeki her bir ürünün detayını da listeye ekle
            'urunler': [urun.to_dict() for urun in self.urunler]
        }
    # YENİ FONKSİYONUN SONU


    def __repr__(self):
        return f'<Siparis {self.id}>'