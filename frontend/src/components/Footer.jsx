// frontend/src/components/Footer.jsx

function Footer() {
  const footerStyle = {
    marginTop: '2rem',
    padding: '1rem',
    background: '#343a40',
    color: 'white',
    textAlign: 'center',
    position: 'fixed',
    bottom: 0,
    width: '100%'
  };

  return (
    <footer style={footerStyle}>
      <p>&copy; 2025 Akıllı E-Ticaret Projesi. Tüm hakları saklıdır.</p>
    </footer>
  );
}

export default Footer;