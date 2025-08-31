// frontend/src/pages/CartPage.jsx

import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (err) {
      setError('Sepet bilgisi alınamadı. Lütfen giriş yaptığınızdan emin olun.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // --- YENİ FONKSİYONLAR ---
  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const response = await api.put(`/cart/update/${productId}`, { adet: newQuantity });
      setCart(response.data); // Backend'den gelen güncel sepet bilgisiyle state'i yenile
    } catch (err) {
      console.error("Adet güncellenirken hata oluştu:", err);
      alert("Adet güncellenemedi.");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      setCart(response.data); // Backend'den gelen güncel sepet bilgisiyle state'i yenile
    } catch (err) {
      console.error("Ürün silinirken hata oluştu:", err);
      alert("Ürün silinemedi.");
    }
  };

  const handleDecrease = (item) => {
    if (item.adet > 1) {
      handleUpdateQuantity(item.id, item.adet - 1);
    } else {
      // window.confirm ile kullanıcıya soru soruyoruz
      if (window.confirm(`"${item.ad}" ürününü sepetten kaldırmak istediğinize emin misiniz?`)) {
        handleRemoveItem(item.id);
      }
    }
  };

  const handleIncrease = (item) => {
    handleUpdateQuantity(item.id, item.adet + 1);
  };
  // --- YENİ FONKSİYONLARIN SONU ---

  if (loading) return <p>Sepet yükleniyor...</p>;
  if (error) return <p>{error}</p>;
  if (!cart || cart.urunler.length === 0) return <h1>Sepetiniz boş.</h1>;

  // ... (stil objeleri aynı kalıyor) ...
  const containerStyle = { maxWidth: '800px', margin: 'auto', padding: '1rem' };
  const headerStyle = { display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #333', paddingBottom: '0.5rem', fontWeight: 'bold' };
  const cartItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', padding: '1rem 0' };
  const itemInfoStyle = { flex: '2', textAlign: 'left' };
  const itemStyle = { flex: '1', textAlign: 'center' };
  const totalStyle = { textAlign: 'right', marginTop: '1rem', fontSize: '1.5rem', fontWeight: 'bold' };

  return (
    <div style={containerStyle}>
      <h1>Sepetim</h1>
      <div style={headerStyle}>
        <span style={itemInfoStyle}>Ürün</span>
        <span style={itemStyle}>Adet</span>
        <span style={itemStyle}>Birim Fiyat</span>
        <span style={itemStyle}>Toplam</span>
      </div>
      {cart.urunler.map(item => (
        <div key={item.id} style={cartItemStyle}>
          <span style={itemInfoStyle}>{item.ad}</span>
          <span style={itemStyle}>
            {/* Butonları aktif hale getirip onClick olaylarını ekliyoruz */}
            <button onClick={() => handleDecrease(item)} style={{margin: '0 5px'}}>-</button>
            {item.adet}
            <button onClick={() => handleIncrease(item)} style={{margin: '0 5px'}}>+</button>
          </span>
          <span style={itemStyle}>{item.fiyat} TL</span>
          <span style={itemStyle}>
            {(parseFloat(item.fiyat) * item.adet).toFixed(2)} TL
          </span>
        </div>
      ))}
      <div style={totalStyle}>
        Genel Toplam: {cart.toplam_fiyat} TL
      </div>
    </div>
  );
}

export default CartPage;