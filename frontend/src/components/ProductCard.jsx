// frontend/src/components/ProductCard.jsx

import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

function ProductCard({ product, isFavorite, onToggleFavorite }) {

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      const response = await api.post('/cart/add', { product_id: product.id });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Sepete eklemek için giriş yapmalısınız.");
    }
  };

  // İyileştirilmiş favori click handler
  const handleFavoriteClick = (event) => {
    // Tıklamanın arkadaki Link'i tetiklemesini engelle
    event.stopPropagation();
    event.preventDefault();
    
    // Dışarıdan (ProductsPage'den) gelen ana fonksiyonu çağır
    // isFavorite parametresi ProductCard'a geçirilen mevcut durumu temsil ediyor
    onToggleFavorite(product.id, isFavorite);
  };

  // --- Stil Objeleri ---
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    width: '250px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative'
  };

  const favoriteBtnStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.8rem',
    lineHeight: '1',
    padding: '4px', // Tıklama alanını biraz büyüttük
    transition: 'transform 0.1s ease' // Küçük bir hover efekti için
  };
  
  const imageStyle = { maxWidth: '100%', height: '150px', objectFit: 'contain', marginBottom: '12px' };
  const priceStyle = { color: '#28a745', fontWeight: 'bold', fontSize: '1.2rem', margin: '10px 0' };
  const linkStyle = { textDecoration: 'none', color: 'inherit' };
  const buttonStyle = { cursor: 'pointer', padding: '10px', border: 'none', background: '#007bff', color: 'white', borderRadius: '4px', marginTop: 'auto' };

  return (
    <Link to={`/products/${product.id}`} style={linkStyle}>
      <div style={cardStyle}>
        
        {/* Favori Butonu (Kalp İkonu) */}
        {onToggleFavorite && (
            <button 
              onClick={handleFavoriteClick} 
              style={favoriteBtnStyle} 
              title={isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
                {isFavorite ? 
                    <span style={{ color: 'red' }}>♥</span> : 
                    <span style={{ color: '#ccc' }}>♡</span>
                }
            </button>
        )}
        
        <div>
          <img src={product.resim_url} alt={product.ad} style={imageStyle} />
          <h3>{product.ad}</h3>
        </div>
        <div>
          <p style={priceStyle}>{product.fiyat} TL</p>
          <button style={buttonStyle} onClick={handleAddToCart}>
            Sepete Ekle
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;