// frontend/src/pages/ProductsPage.jsx

import { useState, useEffect } from 'react'; // React'in temel hook'larını import et
import axios from 'axios'; // API istekleri için axios'u import et
import ProductCard from "../components/ProductCard"; // Ürün kartı bileşenimiz

function ProductsPage() {
  // Bileşenin state'lerini (durumlarını) tanımlıyoruz
  const [products, setProducts] = useState([]); // Gelen ürünleri saklamak için boş bir dizi
  const [loading, setLoading] = useState(true); // Veri yüklenirken "Yükleniyor..." mesajı göstermek için
  const [error, setError] = useState(null); // Bir hata olursa mesajı saklamak için

  // useEffect, bu bileşen ekrana ilk yüklendiğinde bir kere çalışacak olan kod bloğudur.
  // API istekleri için en doğru yer burasıdır.
  useEffect(() => {
    // Asenkron bir fonksiyon tanımlıyoruz çünkü API isteği zaman alabilir.
    const fetchProducts = async () => {
      try {
        // Backend API'mize GET isteği gönderiyoruz.
        const response = await axios.get('http://127.0.0.1:5000/api/products');
        // Gelen veriyi products state'ine kaydediyoruz.
        setProducts(response.data);
      } catch (err) {
        // Eğer bir hata olursa, hata mesajını error state'ine kaydediyoruz.
        setError('Ürünler yüklenirken bir hata oluştu.');
        console.error(err); // Hatanın detayını konsola yazdır
      } finally {
        // İstek başarılı da olsa, başarısız da olsa yükleme durumunu bitiriyoruz.
        setLoading(false);
      }
    };

    fetchProducts(); // Tanımladığımız fonksiyonu çağırıyoruz.
  }, []); // Köşeli parantezin boş olması, bu effect'in sadece bir kere çalışmasını sağlar.

  // --- Veri Durumuna Göre Ekrana Basılacak JSX ---

  // Eğer hala yükleniyorsa...
  if (loading) {
    return <p>Yükleniyor...</p>;
  }

  // Eğer bir hata oluştuysa...
  if (error) {
    return <p>{error}</p>;
  }

  // Stil için
  const pageStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  };

  // Her şey yolundaysa, ürünleri ekrana bas
  return (
    <div>
      <h1>Ürünler</h1>
      <div style={pageStyle}>
        {/* products dizisindeki her bir ürün için bir ProductCard bileşeni oluşturuyoruz */}
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;