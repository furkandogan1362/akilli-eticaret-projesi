// frontend/src/components/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Değişiklik 1: Kendi hook'umuzu import et

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Değişiklik 2: user ve logout bilgilerini context'ten al
  // KONTROL İÇİN BU SATIRI EKLE
  console.log("Navbar'daki User State'i:", user);

  const handleLogout = () => {
    logout(); // Değişiklik 3: Merkezi logout fonksiyonunu çağır
    navigate('/'); // Ana sayfaya yönlendir
  };

  // --- Stil Objeleri ---
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
        
        {/* Değişiklik 4: Koşulu token yerine context'ten gelen user objesine göre yap */}
        {user ? (
          // Eğer kullanıcı giriş yapmışsa
          <>
            {/* Eğer kullanıcı admin ise Admin Paneli linkini göster */}
            {user.is_admin && <Link to="/admin" style={linkStyle}>Admin Paneli</Link>}
            
            <Link to="/favorites" style={linkStyle}>Favorilerim</Link>
            <Link to="/cart" style={linkStyle}>Sepetim</Link>
            <button onClick={handleLogout} style={buttonStyle}>Çıkış Yap</button>
          </>
        ) : (
          // Eğer kullanıcı giriş yapmamışsa
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