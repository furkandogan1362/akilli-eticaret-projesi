// frontend/src/pages/admin/AdminLayout.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function AdminLayout() {
    const layoutStyle = { display: 'flex' };
    const sidebarStyle = {
        width: '200px',
        background: '#f8f9fa',
        padding: '1rem',
        minHeight: '80vh',
        borderRight: '1px solid #dee2e6'
    };
    const linkStyle = {
        display: 'block',
        padding: '0.5rem 0',
        textDecoration: 'none',
        color: '#333',
        fontWeight: 'bold'
    };
    const contentStyle = {
        flex: 1,
        padding: '1rem'
    };

    return (
        <div style={layoutStyle}>
            <aside style={sidebarStyle}>
                <nav>
                    <Link to="/admin" style={linkStyle}>Panelim</Link>
                    <Link to="/admin/products" style={linkStyle}>Ürün Yönetimi</Link>
                    <Link to="/admin/users" style={linkStyle}>Kullanıcı Yönetimi</Link>
                </nav>
            </aside>
            <main style={contentStyle}>
                {/* Alt rotalar burada gösterilecek */}
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;