// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Değişiklik 1: Yüklenme durumunu takip etmek için yeni bir state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({
                        token: token,
                        is_admin: decoded.is_admin,
                        id: decoded.user_id,// ✅ burayı da ekledik
                        full_name: decoded.full_name // YENİ

                    });
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
            }
        }
        // Değişiklik 2: Token kontrolü bittiğinde yükleniyor durumunu false yap
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser({
            token: token,
            is_admin: decoded.is_admin,
            id: decoded.user_id  , // ✅ burayı da ekledik
            full_name: decoded.full_name // YENİ

        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // Değişiklik 3: Yükleniyor durumunu da context'e ekle
    const value = { user, loading, login, logout };

    // Değişiklik 4: Henüz yükleniyorsa, alt bileşenleri render etme
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};