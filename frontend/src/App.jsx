// frontend/src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Bileşenleri import et
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductDetailPage from './pages/ProductDetailPage';
import FavoritesPage from './pages/FavoritesPage'; // Bu satırı ekle



// Sayfaları import et
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage'; // Bu satırı ekle
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage'; // Bu satırı ekle


import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />

      <main style={{ padding: '1rem 2rem', marginBottom: '5rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} /> {/* Bu satırı ekle */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} /> {/* Bu satırı ekle */}
          <Route path="/favorites" element={<FavoritesPage />} /> {/* Bu satırı ekle */}


        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App;