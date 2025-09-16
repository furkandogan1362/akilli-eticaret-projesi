import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import ProductForm from '../../components/admin/ProductForm';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Tooltip,
  Alert,
  Fab,
  Snackbar
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Inventory,
  Close
} from '@mui/icons-material';

function ManageProductsPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Ürünler alınamadı:", error);
            setSnackbarMessage("Ürünler yüklenirken bir hata oluştu.");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        try {
            const product = products.find(p => p.id === productId);
            await api.delete(`/admin/products/${productId}`);
            fetchProducts();
            setDeleteConfirmOpen(false);
            setProductToDelete(null);
            setSnackbarMessage(`"${product?.ad}" ürünü başarıyla silindi.`);
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Ürün silinemedi:", error);
            setSnackbarMessage(error.response?.data?.message || "Ürün silinemedi.");
            setSnackbarOpen(true);
        }
    };

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleFormSubmit = async (productData) => {
        try {
            if (editingProduct) {
                await api.put(`/admin/products/${editingProduct.id}`, productData);
                setSnackbarMessage(`"${productData.ad}" ürünü başarıyla güncellendi.`);
            } else {
                await api.post('/admin/products', productData);
                setSnackbarMessage(`"${productData.ad}" ürünü başarıyla oluşturuldu.`);
            }
            fetchProducts();
            handleCloseModal();
            setSnackbarOpen(true);
        } catch (error) {
            console.error("İşlem başarısız:", error);
            setSnackbarMessage(error.response?.data?.message || "Ürün işlemi başarısız oldu.");
            setSnackbarOpen(true);
        }
    };

    const openDeleteConfirm = (product) => {
        setProductToDelete(product);
        setDeleteConfirmOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { color: 'error', text: 'Tükendi' };
        if (stock < 10) return { color: 'warning', text: `${stock} adet` };
        return { color: 'success', text: `${stock} adet` };
    };

    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                minHeight="400px"
                flexDirection="column"
                gap={2}
            >
                <CircularProgress size={48} />
                <Typography variant="h6" color="textSecondary">
                    Ürünler yükleniyor...
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box 
                display="flex" 
                justifyContent="space-between" 
                alignItems="center" 
                mb={4}
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={{ xs: 2, sm: 0 }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="#1976d2">
                            Ürün Yönetimi
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {products.length} ürün mevcut
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenModal()}
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                            transform: 'translateY(-1px)'
                        }
                    }}
                >
                    Yeni Ürün Ekle
                </Button>
            </Box>

            {/* Products Table/Cards */}
            {products.length === 0 ? (
                <Card sx={{ borderRadius: '16px', textAlign: 'center', py: 6 }}>
                    <CardContent>
                        <Inventory sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" color="textSecondary" mb={1}>
                            Henüz ürün bulunmuyor
                        </Typography>
                        <Typography variant="body2" color="textSecondary" mb={3}>
                            İlk ürününüzü ekleyerek başlayın
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleOpenModal()}
                            sx={{ borderRadius: '8px', textTransform: 'none' }}
                        >
                            Ürün Ekle
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Desktop Table */}
                    {!isMobile ? (
                        <TableContainer 
                            component={Paper} 
                            sx={{ 
                                borderRadius: '16px',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                border: '1px solid #e0e0e0'
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>ID</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Ürün Adı</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Fiyat</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Stok Durumu</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }} align="center">İşlemler</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map((product) => {
                                        const stockStatus = getStockStatus(product.stok_miktari);
                                        return (
                                            <TableRow 
                                                key={product.id}
                                                sx={{ 
                                                    '&:hover': { backgroundColor: '#f8fafc' },
                                                    '&:last-child td': { border: 0 }
                                                }}
                                            >
                                                <TableCell>
                                                    <Typography variant="body2" fontWeight={500}>
                                                        #{product.id}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {product.ad}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <Typography variant="body1" fontWeight={600} color="#4caf50">
                                                            {product.fiyat} TL
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={stockStatus.text}
                                                        color={stockStatus.color}
                                                        size="small"
                                                        sx={{ 
                                                            borderRadius: '8px',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box display="flex" gap={1} justifyContent="center">
                                                        <Tooltip title="Düzenle">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenModal(product)}
                                                                sx={{
                                                                    color: '#1976d2',
                                                                    '&:hover': { backgroundColor: '#e3f2fd' }
                                                                }}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Sil">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => openDeleteConfirm(product)}
                                                                sx={{
                                                                    color: '#d32f2f',
                                                                    '&:hover': { backgroundColor: '#ffebee' }
                                                                }}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        /* Mobile Cards */
                        <Box display="flex" flexDirection="column" gap={2}>
                            {products.map((product) => {
                                const stockStatus = getStockStatus(product.stok_miktari);
                                return (
                                    <Card 
                                        key={product.id}
                                        sx={{ 
                                            borderRadius: '12px',
                                            border: '1px solid #e0e0e0',
                                            '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                                        }}
                                    >
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                <Box>
                                                    <Typography variant="body2" color="textSecondary">
                                                        #{product.id}
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight={600} mb={1}>
                                                        {product.ad}
                                                    </Typography>
                                                </Box>
                                                <Chip 
                                                    label={stockStatus.text}
                                                    color={stockStatus.color}
                                                    size="small"
                                                    sx={{ borderRadius: '8px' }}
                                                />
                                            </Box>
                                            
                                            <Box display="flex" alignItems="center" gap={0.5} mb={3}>
                                                <Typography variant="h6" fontWeight={600} color="#4caf50">
                                                    {product.fiyat} TL
                                                </Typography>
                                            </Box>

                                            <Box display="flex" gap={1}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Edit />}
                                                    onClick={() => handleOpenModal(product)}
                                                    sx={{ 
                                                        borderRadius: '8px',
                                                        textTransform: 'none',
                                                        flex: 1
                                                    }}
                                                >
                                                    Düzenle
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                    startIcon={<Delete />}
                                                    onClick={() => openDeleteConfirm(product)}
                                                    sx={{ 
                                                        borderRadius: '8px',
                                                        textTransform: 'none',
                                                        flex: 1
                                                    }}
                                                >
                                                    Sil
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </Box>
                    )}
                </>
            )}

            {/* Product Form Modal */}
            <Dialog 
                open={isModalOpen} 
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : '16px',
                        m: isMobile ? 0 : 2
                    }
                }}
            >
                <DialogTitle sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    pb: 1
                }}>
                    <Typography variant="h5" fontWeight={600}>
                        {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                    </Typography>
                    <IconButton onClick={handleCloseModal} size="small">
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <ProductForm 
                        productToEdit={editingProduct}
                        onSubmit={handleFormSubmit}
                        onCancel={handleCloseModal}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={deleteConfirmOpen} 
                onClose={() => setDeleteConfirmOpen(false)}
                maxWidth="sm"
                PaperProps={{ sx: { borderRadius: '16px' } }}
            >
                <DialogTitle>
                    <Typography component="span" variant="h6" fontWeight={600}>
                        Ürünü Sil
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2, borderRadius: '8px' }}>
                        Bu işlem geri alınamaz!
                    </Alert>
                    <Typography>
                        <strong>{productToDelete?.ad}</strong> ürünü silmek istediğinize emin misiniz?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button 
                        onClick={() => setDeleteConfirmOpen(false)}
                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                        İptal
                    </Button>
                    <Button 
                        onClick={() => handleDelete(productToDelete?.id)} 
                        color="error"
                        variant="contained"
                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                        Sil
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error Notification */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarMessage.includes('başarıyla') ? 'success' : 'error'}
                    sx={{ width: '100%', borderRadius: '8px' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ManageProductsPage;