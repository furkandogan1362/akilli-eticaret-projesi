import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  Toolbar
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  People,
  Menu as MenuIcon,
  ChevronLeft,
  AdminPanelSettings
} from '@mui/icons-material';

const DRAWER_WIDTH = 280;

function AdminLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    {
      text: 'Panelim',
      icon: <Dashboard />,
      path: '/admin',
      exact: true
    },
    {
      text: 'Ürün Yönetimi',
      icon: <Inventory />,
      path: '/admin/products'
    },
    {
      text: 'Kullanıcı Yönetimi',
      icon: <People />,
      path: '/admin/users'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box>
      {/* Admin Header */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}
        
        <AdminPanelSettings sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          Admin Paneli
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.9 }}>
          Yönetim Sistemi
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path, item.exact);
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  px: 2,
                  backgroundColor: active ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                  border: active ? '1px solid rgba(25, 118, 210, 0.2)' : '1px solid transparent',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: active ? 'rgba(25, 118, 210, 0.15)' : 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: active ? '#1976d2' : '#666',
                    transition: 'color 0.2s ease-in-out'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 500,
                    color: active ? '#1976d2' : '#333',
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          textAlign: 'center'
        }}
      >
        
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile Menu Button - Only show when drawer is closed */}
      {isMobile && !mobileOpen && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: 80,
            left: 16,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              border: 'none',
              boxShadow: '4px 0 8px rgba(0,0,0,0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              border: 'none',
              boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
              position: 'static',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: 'white'
        }}
      >
        {/* Content Container */}
        <Box
          sx={{
            p: { xs: 2, md: 4 },
            pt: { xs: 10, md: 4 }, // Extra top padding for mobile menu button
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default AdminLayout;