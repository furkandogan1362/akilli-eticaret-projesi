// frontend/src/pages/FavoritesPage.jsx

import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Favorileri getiren fonksiyon
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites');
      setFavorites(response.data);
    } catch (err) {
      setError('Favori ürünler yüklenirken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa ilk yüklendiğinde favorileri getir
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Bu sayfada bir ürünü favoriden çıkardığımızda listeyi anında güncellemek için
  const handleToggleFavorite = async (productId) => {
    try {
      // Bir ürünü favoriden çıkarmak her zaman DELETE isteği olacaktır
      await api.delete(`/favorites/remove/${productId}`);
      // Ürünü listeden anında kaldırmak için state'i güncelliyoruz
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== productId));
    } catch (error) {
      console.error("Favori kaldırma işlemi başarısız oldu:", error);
    }
  };

  if (loading) return <p>Favoriler yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  const pageStyle = { display: 'flex', flexWrap: 'wrap', justifyContent: 'center' };

  return (
    <div>
      <h1>Favorilerim</h1>
      {favorites.length > 0 ? (
        <div style={pageStyle}>
          {favorites.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              // Bu sayfadaki her ürün favori olduğu için isFavorite her zaman true
              isFavorite={true} 
              // Favoriden çıkarma fonksiyonunu ProductCard'a gönderiyoruz
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <p>Henüz favorilerinize bir ürün eklemediniz.</p>
      )}
    </div>
  );
}

export default FavoritesPage;