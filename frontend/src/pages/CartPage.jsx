// frontend/src/pages/CartPage.jsx

import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Token'ı otomatik ekleyen api nesnesi ile istek yapıyoruz.
        const response = await api.get('/cart');
        setCart(response.data);
      } catch (err) {
        setError('Sepet bilgisi alınamadı. Lütfen giriş yaptığınızdan emin olun.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) return <p>Sepet yükleniyor...</p>;
  if (error) return <p>{error}</p>;
  if (!cart || cart.urunler.length === 0) return <h1>Sepetiniz boş.</h1>;

  const cartItemStyle = { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', padding: '1rem 0' };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h1>Sepetim</h1>
      {cart.urunler.map(item => (
        <div key={item.id} style={cartItemStyle}>
          <span>{item.ad}</span>
          <span>{item.fiyat} TL</span>
        </div>
      ))}
      <h2 style={{ textAlign: 'right', marginTop: '1rem' }}>
        Toplam: {cart.toplam_fiyat} TL
      </h2>
    </div>
  );
}

export default CartPage;