// frontend/src/components/admin/ProductForm.jsx
import React, { useState, useEffect } from 'react';

function ProductForm({ productToEdit, onSubmit, onCancel }) {
    const [product, setProduct] = useState({
        ad: '',
        aciklama: '',
        fiyat: '',
        stok_miktari: '',
        resim_url: ''
    });

    useEffect(() => {
        // Eğer düzenlenecek bir ürün varsa, form alanlarını onunla doldur
        if (productToEdit) {
            setProduct(productToEdit);
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(product);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form alanları... */}
            <div><label>Ürün Adı:</label><input name="ad" value={product.ad} onChange={handleChange} required /></div>
            <div><label>Açıklama:</label><textarea name="aciklama" value={product.aciklama} onChange={handleChange} required /></div>
            <div><label>Fiyat:</label><input name="fiyat" type="number" step="0.01" value={product.fiyat} onChange={handleChange} required /></div>
            <div><label>Stok Adedi:</label><input name="stok_miktari" type="number" value={product.stok_miktari} onChange={handleChange} required /></div>
            <div><label>Resim URL:</label><input name="resim_url" value={product.resim_url} onChange={handleChange} /></div>
            <button type="submit">{productToEdit ? 'Güncelle' : 'Ekle'}</button>
            <button type="button" onClick={onCancel}>İptal</button>
        </form>
    );
}

export default ProductForm;