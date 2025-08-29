// frontend/src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Tarayıcı hafızasından token'ı kontrol et

  const handleLogout = () => {
    localStorage.removeItem('token'); // Token'ı sil
    navigate('/'); // Ana sayfaya yönlendir
    window.location.reload(); // Sayfayı yenileyerek Navbar'ın güncellenmesini sağla
  };

  // ... (stil objeleri aynı kalıyor)
  const navStyle = { padding: '1rem', background: '#f8f9fa', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const linkStyle = { marginRight: '1rem', textDecoration: 'none', color: '#333', fontWeight: 'bold' };
  const logoStyle = { fontSize: '1.5rem', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' };
  const buttonStyle = { background: 'none', border: 'none', color: '#333', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' };


  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={logoStyle}>E-Ticaret</Link>
      </div>
      <div>
        <Link to="/products" style={linkStyle}>Ürünler</Link>
        {token ? (
          // Eğer token varsa (kullanıcı giriş yapmışsa)
          <>
            <Link to="/cart" style={linkStyle}>Sepetim</Link>
            <button onClick={handleLogout} style={buttonStyle}>Çıkış Yap</button>
          </>
        ) : (
          // Eğer token yoksa (kullanıcı giriş yapmamışsa)
          <>
            <Link to="/login" style={linkStyle}>Giriş Yap</Link>
            <Link to="/register" style={linkStyle}>Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;