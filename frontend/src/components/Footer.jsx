// frontend/src/components/Footer.jsx

import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#343a40',
        color: 'white',
        textAlign: 'center',
        py: 2,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000
      }}
    >
      <Typography variant="body2">
        &copy; 2025 Akıllı E-Ticaret Projesi. Tüm hakları saklıdır.
      </Typography>
    </Box>
  );
}

export default Footer;