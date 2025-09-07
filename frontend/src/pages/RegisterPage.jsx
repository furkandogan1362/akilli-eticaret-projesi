// frontend/src/pages/RegisterPage.jsx

import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [ad, setAd] = useState(''); // YENİ
  const [soyad, setSoyad] = useState(''); // YENİ
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Başarı veya hata mesajı için

  const handleRegister = async (e) => {
    e.preventDefault(); // Formun sayfayı yeniden yüklemesini engelle
    setMessage(''); // Önceki mesajları temizle

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/auth/register', {
        ad: ad, // YENİ
        soyad: soyad, // YENİ
        email: email,
        password: password
      });
      setMessage(response.data.message); // Backend'den gelen başarı mesajını ayarla
    } catch (error) {
      // Backend'den gelen hata mesajını ayarla, yoksa genel bir mesaj göster
      setMessage(error.response?.data?.message || 'Bir hata oluştu.');
    }
  };

  // Basit form stilleri
  const formContainerStyle = { maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' };
  const inputStyle = { width: '100%', padding: '8px', marginBottom: '1rem', boxSizing: 'border-box' };
  const buttonStyle = { width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' };

  return (
    <div style={formContainerStyle}>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        {/* YENİ FORUM ALANLARI */}
        <div>
          <label>Ad:</label>
          <input type="text" value={ad} onChange={(e) => setAd(e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label>Soyad:</label>
          <input type="text" value={soyad} onChange={(e) => setSoyad(e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label>E-posta:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label>Şifre:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Kayıt Ol</button>
      </form>
      {message && <p style={{marginTop: '1rem', textAlign: 'center'}}>{message}</p>}
      <p style={{textAlign: 'center', marginTop: '1rem'}}>
        Zaten bir hesabınız var mı? <Link to="/login">Giriş Yap</Link>
      </p>
    </div>
  );
}

export default RegisterPage;