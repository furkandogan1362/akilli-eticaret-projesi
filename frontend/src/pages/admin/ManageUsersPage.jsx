// frontend/src/pages/admin/ManageUsersPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext'; // Kendi admin ID'mizi kontrol etmek için

function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user: adminUser } = useAuth(); // Giriş yapmış olan adminin kendi bilgilerini al

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            setError("Kullanıcılar yüklenirken bir hata oluştu.");
            console.error("Kullanıcılar alınamadı:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        // Adminin kendi kendini silmesini engelle
        if (userId === adminUser.id) { // Bu kontrol backend'de de var ama UX için burada da olmalı
            alert("Admin kendi hesabını silemez!");
            return;
        }

        if (window.confirm("Bu kullanıcıyı kalıcı olarak silmek istediğinize emin misiniz?")) {
            try {
                await api.delete(`/admin/users/${userId}`);
                // Listeyi anında güncellemek için silinen kullanıcıyı state'ten çıkar
                setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
                alert("Kullanıcı başarıyla silindi.");
            } catch (error) {
                console.error("Kullanıcı silinemedi:", error);
                alert("Kullanıcı silinemedi.");
            }
        }
    };

    if (loading) return <p>Kullanıcılar yükleniyor...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Kullanıcı Yönetimi</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>E-posta</th>
                        <th>Admin mi?</th>
                        <th>Kayıt Tarihi</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.email}</td>
                            <td>{u.is_admin ? 'Evet' : 'Hayır'}</td>
                            <td>{new Date(u.olusturulma_tarihi).toLocaleDateString()}</td>
                            <td>
                                {/* --- DEĞİŞİKLİK BURADA --- */}
                                {/* Eğer listelenen kullanıcının ID'si, giriş yapan adminin ID'sine eşit DEĞİLSE butonu göster */}
                                {u.id !== adminUser.id && (
                                    <button onClick={() => handleDelete(u.id)}>
                                        Sil
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageUsersPage;