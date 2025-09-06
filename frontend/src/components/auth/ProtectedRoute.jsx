// frontend/src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth(); // Değişiklik 1: loading durumunu da context'ten al

    // Değişiklik 2: Eğer kimlik kontrolü hala sürüyorsa, hiçbir şey yapma (bekle)
    if (loading) {
        return <div>Doğrulama yapılıyor...</div>; // Veya bir spinner/loading ikonu gösterebilirsin
    }

    // Değişiklik 3: Yükleme bittikten sonra, kullanıcı kontrolünü yap
    if (!user || !user.is_admin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;