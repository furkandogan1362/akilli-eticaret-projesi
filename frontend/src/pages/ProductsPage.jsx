// frontend/src/pages/ProductsPage.jsx

import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import ProductCard from "../components/ProductCard";
import useDebounce from '../hooks/useDebounce';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
        if (priceRange) params.append('price_range', priceRange);
        if (stockStatus) params.append('stock_status', stockStatus);
        
        const productsPromise = api.get(`/products?${params.toString()}`);
        
        if (token) {
          const favoritesPromise = api.get('/favorites');
          const [productsRes, favoritesRes] = await Promise.all([productsPromise, favoritesPromise]);
          setProducts(productsRes.data);
          setFavoriteIds(new Set(favoritesRes.data.map(fav => fav.id)));
        } else {
          const productsRes = await productsPromise;
          setProducts(productsRes.data);
          setFavoriteIds(new Set());
        }

      } catch (err) {
        setError('Ürünler yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [debouncedSearchTerm, priceRange, stockStatus, token]);

  // --- DÜZELTİLMİŞ FONKSİYON ---
  const handleToggleFavorite = async (productId, isCurrentlyFavorite) => {
    if (!token) {
      alert("Favorilere eklemek için giriş yapmalısınız.");
      return;
    }

    try {
      // Önce lokal state'i anında güncelleyerek arayüzü hızlı hissettiriyoruz
      setFavoriteIds(prevIds => {
        const newIds = new Set(prevIds);
        if (isCurrentlyFavorite) {
          // Şu anda favori ise favoriden çıkar
          newIds.delete(productId);
        } else {
          // Şu anda favori değilse favorilere ekle
          newIds.add(productId);
        }
        return newIds;
      });

      // Ardından backend'e doğru isteği gönderiyoruz
      if (isCurrentlyFavorite) {
        // Şu anda favori ise -> favoriden çıkar (DELETE)
        await api.delete(`/favorites/remove/${productId}`);
      } else {
        // Şu anda favori değilse -> favorilere ekle (POST)
        await api.post(`/favorites/add/${productId}`);
      }
    } catch (error) {
      console.error("Favori işlemi başarısız oldu:", error);
      alert("İşlem sırasında bir hata oluştu. Sayfa yenilenecek.");
      // Bir hata olursa, arayüzü sunucudaki doğru durumla eşitlemek için veriyi yeniden çek
      window.location.reload();
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPriceRange('');
    setStockStatus('');
  };

  const pageStyle = { display: 'flex', flexWrap: 'wrap', justifyContent: 'center' };
  const filterContainerStyle = { display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' };
  const inputStyle = { padding: '8px', height: '38px', boxSizing: 'border-box' };
  const selectStyle = { padding: '8px', height: '38px' };
  const buttonStyle = { padding: '8px 12px', height: '38px', border: '1px solid #ccc', background: '#f8f8f8', cursor: 'pointer' };

  return (
    <div>
      <h1>Ürünler</h1>
      <div style={filterContainerStyle}>
        <input type="text" placeholder="Ürün ara..." style={inputStyle} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select style={selectStyle} value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
            <option value="">Tüm Fiyatlar</option>
            <option value="0-2500">0 - 2500 TL</option>
            <option value="2500-5000">2500 - 5000 TL</option>
            <option value="5000-10000">5000 - 10000 TL</option>
            <option value="10000+">10000 TL +</option>
        </select>
        <select style={selectStyle} value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
            <option value="">Tüm Stok Durumları</option>
            <option value="var">Stokta Var</option>
            <option value="tukendi">Tükendi</option>
        </select>
        <button onClick={handleResetFilters} style={buttonStyle}>Filtreleri Sıfırla</button>
      </div>

      <div style={pageStyle}>
        {loading ? (
          <p>Yükleniyor...</p>
        ) : error ? (
          <p>{error}</p>
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isFavorite={favoriteIds.has(product.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))
        ) : (
          <p>Arama kriterlerinize uygun ürün bulunamadı.</p>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;