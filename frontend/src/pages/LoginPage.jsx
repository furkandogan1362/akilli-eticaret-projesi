// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate'i import et

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // useNavigate hook'unu kullanıma hazırla

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {
        email: email,
        password: password
      });

      // Gelen token'ı localStorage'a kaydet
      localStorage.setItem('token', response.data.token);

      // Kullanıcıyı ana sayfaya yönlendir
      navigate('/');

    } catch (error) {
      setMessage(error.response?.data?.message || 'Bir hata oluştu.');
    }
  };

  const formContainerStyle = { maxWidth: '400px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' };
  const inputStyle = { width: '100%', padding: '8px', marginBottom: '1rem', boxSizing: 'border-box' };
  const buttonStyle = { width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' };

  return (
    <div style={formContainerStyle}>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" style={buttonStyle}>Giriş Yap</button>
      </form>
      {message && <p style={{marginTop: '1rem', textAlign: 'center'}}>{message}</p>}
      <p style={{textAlign: 'center', marginTop: '1rem'}}>
        Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
      </p>
    </div>
  );
}

export default LoginPage;