// frontend/src/pages/admin/ManageProductsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import ProductForm from '../../components/admin/ProductForm';

function ManageProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Ürünler alınamadı:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            try {
                await api.delete(`/admin/products/${productId}`);
                fetchProducts(); // Listeyi yenile
            } catch (error) {
                console.error("Ürün silinemedi:", error);
                alert("Ürün silinemedi.");
            }
        }
    };

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleFormSubmit = async (productData) => {
        try {
            if (editingProduct) {
                await api.put(`/admin/products/${editingProduct.id}`, productData);
            } else {
                await api.post('/admin/products', productData);
            }
            fetchProducts(); // Listeyi yenile
            handleCloseModal();
        } catch (error) {
            console.error("İşlem başarısız:", error);
            alert("İşlem başarısız oldu.");
        }
    };

    if (loading) return <p>Ürünler yükleniyor...</p>;

    return (
        <div>
            <h2>Ürün Yönetimi</h2>
            <button onClick={() => handleOpenModal()}>Yeni Ürün Ekle</button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
                        <ProductForm 
                            productToEdit={editingProduct}
                            onSubmit={handleFormSubmit}
                            onCancel={handleCloseModal}
                        />
                    </div>
                </div>
            )}

            <table>
                <thead>
                    <tr><th>ID</th><th>Ad</th><th>Fiyat</th><th>Stok</th><th>İşlemler</th></tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.ad}</td>
                            <td>{p.fiyat} TL</td>
                            <td>{p.stok_miktari}</td>
                            <td>
                                <button onClick={() => handleOpenModal(p)}>Düzenle</button>
                                <button onClick={() => handleDelete(p.id)}>Sil</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default ManageProductsPage;