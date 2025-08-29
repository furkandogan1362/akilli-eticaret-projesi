// frontend/src/pages/ProductDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axiosConfig'; // Değişiklik 1: Artık 'axios' yerine 'api' kullanıyoruz.

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Değişiklik 2: API isteğini 'api' nesnesi üzerinden yapıyoruz.
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Ürün detayı yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Değişiklik 3: Sepete ekleme fonksiyonu
  const handleAddToCart = async () => {
    if (!product) return; // Ürün yoksa bir şey yapma

    try {
      // Token'ı otomatik ekleyen 'api' nesnesi ile istek gönderiyoruz.
      // user_id göndermemize gerek yok!
      const response = await api.post('/cart/add', { product_id: product.id });
      alert(response.data.message); // Başarı mesajını göster
    } catch (error) {
      // Giriş yapılmadıysa (401 hatası) veya başka bir hata varsa kullanıcıyı bilgilendir.
      alert(error.response?.data?.message || "Sepete eklemek için giriş yapmalısınız.");
    }
  };


  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  
  if (!product) {
    return <p>Ürün bulunamadı.</p>;
  }

  const detailStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
    padding: '2rem',
    maxWidth: '900px',
    margin: 'auto'
  };

  const imageStyle = {
    maxWidth: '400px',
    height: 'auto'
  };

  return (
    <div style={detailStyle}>
      <img src={product.resim_url} alt={product.ad} style={imageStyle}/>
      <div>
        <h1>{product.ad}</h1>
        <p>{product.aciklama}</p>
        <h2 style={{ color: '#28a745' }}>{product.fiyat} TL</h2>
        <p>Stok: {product.stok_miktari}</p>
        {/* Değişiklik 4: Butona onClick olayı ekledik */}
        <button onClick={handleAddToCart} style={{padding: '10px 20px', fontSize: '1rem'}}>Sepete Ekle</button>
      </div>
    </div>
  );
}

export default ProductDetailPage;