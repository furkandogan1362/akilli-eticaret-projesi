// frontend/src/components/ProductCard.jsx
import { Link } from 'react-router-dom'; // Link'i import et

function ProductCard({ product }) {
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    width: '250px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  };

  const imageStyle = {
    maxWidth: '100%',
    height: 'auto',
    marginBottom: '12px'
  };

  const priceStyle = {
    color: '#28a745',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  };

  // Link'in alt çizgisini ve rengini kaldırmak için stil
  const linkStyle = {
      textDecoration: 'none',
      color: 'inherit'
  }

  return (
    // Kartın tamamını Link bileşeni ile sarmala
    <Link to={`/products/${product.id}`} style={linkStyle}>
      <div style={cardStyle}>
        <img src={product.resim_url} alt={product.ad} style={imageStyle} />
        <h3>{product.ad}</h3>
        <p style={priceStyle}>{product.fiyat} TL</p>
        <button>Sepete Ekle</button>
      </div>
    </Link>
  );
}

export default ProductCard;