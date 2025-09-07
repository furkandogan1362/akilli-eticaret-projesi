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
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Badge,
  Avatar,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Favorite,
  AccountCircle,
  AdminPanelSettings,
  Store,
  Login,
  PersonAdd,
  Logout,
  Home,
  Close
  
} from '@mui/icons-material';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  console.log("Navbar'daki User State'i:", user);

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Mobil menü içeriği
  const mobileMenuItems = [
    { text: 'Ana Sayfa', path: '/', icon: <Home />, color: '#FF6B6B' },
    { text: 'Ürünler', path: '/products', icon: <Store />, color: '#4ECDC4' },
    ...(user ? [
      ...(user.is_admin ? [{ text: 'Admin Paneli', path: '/admin', icon: <AdminPanelSettings />, color: '#FF8E53' }] : []),
      { text: 'Favorilerim', path: '/favorites', icon: <Favorite />, color: '#FFE66D' },
      { text: 'Sepetim', path: '/cart', icon: <ShoppingCart />, color: '#A8E6CF' },
      { text: 'Çıkış Yap', action: handleLogout, icon: <Logout />, color: '#FF8A80' }
    ] : [
      { text: 'Giriş Yap', path: '/login', icon: <Login />, color: '#81C784' },
      { text: 'Kayıt Ol', path: '/register', icon: <PersonAdd />, color: '#64B5F6' }
    ])
  ];

  const renderMobileMenu = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      PaperProps={{
        sx: { 
          width: 320,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }
      }}
    >
      <Box sx={{ pt: 2 }}>
        {/* Mobil menü header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: 2,
          pb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
            Menü
          </Typography>
          <IconButton onClick={toggleMobileMenu} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mb: 2 }} />

        <List>
          {mobileMenuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ mb: 1, px: 2 }}>
              <ListItemButton
                component={item.path ? Link : 'button'}
                to={item.path}
                onClick={item.action ? item.action : toggleMobileMenu}
                sx={{ 
                  py: 2,
                  borderRadius: 3,
                  background: `linear-gradient(45deg, ${item.color}30, ${item.color}50)`,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': { 
                    background: `linear-gradient(45deg, ${item.color}50, ${item.color}70)`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${item.color}40`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <Box sx={{ 
                  mr: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 1,
                  borderRadius: '50%',
                  bgcolor: item.color,
                  color: 'white'
                }}>
                  {item.icon}
                </Box>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{ 
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '1.1rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  const renderUserMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        sx: { 
          mt: 1, 
          minWidth: 250,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }
      }}
    >
      {/* User info header */}
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Avatar 
          sx={{ 
            bgcolor: 'white', 
            color: '#f5576c', 
            mx: 'auto', 
            mb: 1,
            width: 48,
            height: 48,
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          {/* user.ad'ın ilk harfini al, yoksa U göster */}
          {user?.full_name?.charAt(0).toUpperCase() || 'U'}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {user?.full_name || 'Kullanıcı'}
        </Typography>
        {user?.is_admin && (
          <Chip 
            label="Admin" 
            size="small" 
            sx={{ 
              mt: 0.5,
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold'
            }} 
          />
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />

      {user?.is_admin && (
        <MenuItem 
          component={Link} 
          to="/admin" 
          onClick={handleMenuClose}
          sx={{ 
            py: 1.5,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <AdminPanelSettings sx={{ mr: 2, color: '#FFE66D' }} />
          Admin Paneli
        </MenuItem>
      )}
      <MenuItem 
        component={Link} 
        to="/favorites" 
        onClick={handleMenuClose}
        sx={{ py: 1.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <Favorite sx={{ mr: 2, color: '#FF8A65' }} />
        Favorilerim
      </MenuItem>
      <MenuItem 
        component={Link} 
        to="/cart" 
        onClick={handleMenuClose}
        sx={{ py: 1.5, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
      >
        <ShoppingCart sx={{ mr: 2, color: '#81C784' }} />
        Sepetim
      </MenuItem>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
      
      <MenuItem 
        onClick={handleLogout}
        sx={{ 
          py: 1.5,
          '&:hover': { bgcolor: 'rgba(255,99,71,0.2)' }
        }}
      >
        <Logout sx={{ mr: 2, color: '#FF6B6B' }} />
        Çıkış Yap
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FFE066, #FF6B6B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textDecoration: 'none',
              fontSize: '1.8rem',
              '&:hover': { 
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease'
              }
            }}
          >
            🛍️ E-Ticaret
          </Typography>

          {/* Masaüstü Menüsü */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                component={Link}
                to="/products"
                startIcon={<Store />}
                sx={{ 
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  px: 3,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': { 
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Ürünler
              </Button>

              {user?.is_admin && (
                <Button
                  component={Link}
                  to="/admin"
                  startIcon={<AdminPanelSettings />}
                  sx={{ 
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    px: 3,
                    background: 'linear-gradient(45deg, #FF8E53, #FFE066)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    '&:hover': { 
                      background: 'linear-gradient(45deg, #FFE066, #FF8E53)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255,142,83,0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Admin Paneli
                </Button>
              )}

              {user ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    component={Link}
                    to="/favorites"
                    sx={{ 
                      color: 'white',
                      background: 'linear-gradient(45deg, #FFE066, #FF8E53)',
                      '&:hover': { 
                        background: 'linear-gradient(45deg, #FF8E53, #FFE066)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Badge badgeContent={0} color="error" invisible={true}>
                      <Favorite />
                    </Badge>
                  </IconButton>

                  <IconButton
                    component={Link}
                    to="/cart"
                    sx={{ 
                      color: 'white',
                      background: 'linear-gradient(45deg, #4ECDC4, #44A08D)',
                      '&:hover': { 
                        background: 'linear-gradient(45deg, #44A08D, #4ECDC4)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Badge badgeContent={0} color="error" invisible={true}>
                      <ShoppingCart />
                    </Badge>
                  </IconButton>


                  <IconButton
                    onClick={handleMenuOpen}
                    sx={{ 
                      ml: 1,
                      background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                      '&:hover': { 
                        background: 'linear-gradient(45deg, #f5576c 0%, #f093fb 100%)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: 'transparent', 
                        color: 'white',
                        width: 32,
                        height: 32,
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  {renderUserMenu}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    component={Link}
                    to="/login"
                    startIcon={<Login />}
                    variant="outlined"
                    sx={{ 
                      borderColor: 'white',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: 3,
                      '&:hover': { 
                        borderColor: '#FFE066',
                        color: '#FFE066',
                        background: 'rgba(255,230,102,0.1)'
                      }
                    }}
                  >
                    Giriş Yap
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    startIcon={<PersonAdd />}
                    variant="contained"
                    sx={{ 
                      background: 'linear-gradient(45deg, #FFE066, #FF6B6B)',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: 3,
                      boxShadow: '0 4px 15px rgba(255,107,107,0.4)',
                      '&:hover': { 
                        background: 'linear-gradient(45deg, #FF6B6B, #FFE066)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255,107,107,0.6)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Kayıt Ol
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Mobil Hamburger Menü */}
          {isMobile && (
            <IconButton
              onClick={toggleMobileMenu}
              sx={{ 
                color: 'white',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                '&:hover': { 
                  background: 'rgba(255,255,255,0.2)',
                  transform: 'rotate(90deg)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobil Menü */}
      {renderMobileMenu}
    </>
  );
}

export default Navbar;