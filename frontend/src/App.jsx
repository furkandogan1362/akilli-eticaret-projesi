// frontend/src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Genel Bileşenler
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Sayfalar
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';

// Admin Sayfaları ve Layout
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage'; // Bu satırı ekle


import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />

      <main style={{ padding: '1rem 2rem', marginBottom: '5rem' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />

          {/* Admin Routes (Nested) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* /admin yolu için varsayılan sayfa */}
            <Route index element={<AdminDashboardPage />} /> 
            {/* /admin/products yolu için sayfa */}
            <Route path="products" element={<ManageProductsPage />} /> 
            <Route path="users" element={<ManageUsersPage />} /> {/* Bu satırı ekle */}

          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App;