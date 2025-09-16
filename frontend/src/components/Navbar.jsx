import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
  Badge,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Favorite,
  AdminPanelSettings,
  Person,
  Store,
  Logout
} from '@mui/icons-material';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuAnchor(null);
  };

  const handleMobileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setAnchorEl(null);
  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  // Helper: Kullanıcının adının baş harfi
  const getUserInitial = (user) => {
    if (!user) return '?';
    const name = user.username || user.name || user.full_name || 'U';
    return name.charAt(0).toUpperCase();
  };

  const menuItems = [
    { label: 'Ürünler', path: '/products', icon: <Store /> },
  ];

  const userMenuItems = user ? [
    ...(user && ['admin', 'moderator'].includes(user.role) ? [{ label: 'Admin Paneli', path: '/admin', icon: <AdminPanelSettings /> }] : []),
    { label: 'Favorilerim', path: '/favorites', icon: <Favorite /> },
    { label: 'Sepetim', path: '/cart', icon: <ShoppingCart /> },
  ] : [
    { label: 'Giriş Yap', path: '/login', icon: <Person /> },
    { label: 'Kayıt Ol', path: '/register', icon: <Person /> },
  ];

  const linkStyle = {
    textDecoration: 'none',
    color: '#d32f2f',
    fontWeight: 500,
    textTransform: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    '&:hover': { backgroundColor: '#ffebee' }
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e0e0e0'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            fontWeight: 700,
            color: '#1976d2',
            textDecoration: 'none',
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            '&:hover': { color: '#1565c0' }
          }}
        >
          E-Ticaret
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: '#333',
                  fontWeight: 500,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': { backgroundColor: '#f5f5f5' },
                }}
              >
                {item.label}
              </Button>
            ))}

            {user ? (
              <>
                {user && ['admin', 'moderator'].includes(user.role) && (
                  <Link to="/admin" style={linkStyle}>Admin Paneli</Link>
                )}
                
                <IconButton component={Link} to="/favorites" sx={{ color: '#e91e63' }}>
                  <Badge badgeContent={0} color="error">
                    <Favorite />
                  </Badge>
                </IconButton>

                <IconButton component={Link} to="/cart" sx={{ color: '#ff9800' }}>
                  <Badge badgeContent={0} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                <IconButton onClick={handleUserMenuOpen} sx={{ ml: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                    {getUserInitial(user)}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
                    <Logout sx={{ mr: 1 }} />
                    Çıkış Yap
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{ textTransform: 'none', borderRadius: '8px', fontWeight: 500 }}
                >
                  Giriş Yap
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    borderRadius: '8px',
                    fontWeight: 500,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: '0 2px 8px rgba(25,118,210,0.3)' }
                  }}
                >
                  Kayıt Ol
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handleMobileMenuOpen}
            sx={{ color: '#333' }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Menu */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorEl)}
          onClose={handleMobileMenuClose}
          sx={{ '& .MuiPaper-root': { minWidth: '200px', mt: 1, borderRadius: '12px' } }}
        >
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              component={Link}
              to={item.path}
              onClick={handleMobileMenuClose}
            >
              {item.icon && React.cloneElement(item.icon, { sx: { mr: 2 } })}
              {item.label}
            </MenuItem>
          ))}

          {userMenuItems.map((item, index) => (
            <MenuItem
              key={index}
              component={Link}
              to={item.path}
              onClick={handleMobileMenuClose}
              sx={item.label === 'Admin Paneli' ? { color: '#d32f2f' } : {}}
            >
              {item.icon && React.cloneElement(item.icon, { sx: { mr: 2 } })}
              {item.label}
            </MenuItem>
          ))}

          {user && (
            <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
              <Logout sx={{ mr: 2 }} />
              Çıkış Yap
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;