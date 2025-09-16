import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Typography,
  Paper,
  Avatar,
  Alert,
  Divider
} from '@mui/material';
import {
  Title,
  Description,
  Inventory,
  Image,
  Save,
  Cancel
} from '@mui/icons-material';

function ProductForm({ productToEdit, onSubmit, onCancel }) {
    const [product, setProduct] = useState({
        ad: '',
        aciklama: '',
        fiyat: '',
        stok_miktari: '',
        resim_url: ''
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (productToEdit) {
            setProduct(productToEdit);
            setImagePreview(productToEdit.resim_url || '');
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }

        // Update image preview for URL field
        if (name === 'resim_url') {
            setImagePreview(value);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!product.ad.trim()) {
            newErrors.ad = 'Ürün adı zorunludur';
        }
        if (!product.aciklama.trim()) {
            newErrors.aciklama = 'Açıklama zorunludur';
        }
        if (!product.fiyat || parseFloat(product.fiyat) <= 0) {
            newErrors.fiyat = 'Geçerli bir fiyat giriniz';
        }
        if (!product.stok_miktari || parseInt(product.stok_miktari) < 0) {
            newErrors.stok_miktari = 'Geçerli bir stok miktarı giriniz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(product);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: '600px' }}>
            {/* Form Header */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Avatar
                    sx={{
                        bgcolor: '#1976d2',
                        width: 48,
                        height: 48
                    }}
                >
                    <Inventory />
                </Avatar>
                <Box>
                    <Typography variant="h6" fontWeight={600}>
                        {productToEdit ? 'Ürün Bilgilerini Düzenle' : 'Yeni Ürün Bilgileri'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Tüm alanları eksiksiz doldurunuz
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
                {/* Product Name */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Ürün Adı"
                        name="ad"
                        value={product.ad}
                        onChange={handleChange}
                        required
                        error={!!errors.ad}
                        helperText={errors.ad || 'Ürün adını giriniz'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Title color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                            }
                        }}
                    />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Açıklama"
                        name="aciklama"
                        value={product.aciklama}
                        onChange={handleChange}
                        required
                        multiline
                        rows={4}
                        error={!!errors.aciklama}
                        helperText={errors.aciklama || 'Ürün açıklamasını giriniz'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                                    <Description color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                            }
                        }}
                    />
                </Grid>

                {/* Price and Stock */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Fiyat"
                        name="fiyat"
                        type="number"
                        inputProps={{ 
                            step: "0.01", 
                            min: "0.01" 
                        }}
                        value={product.fiyat}
                        onChange={handleChange}
                        required
                        error={!!errors.fiyat}
                        helperText={errors.fiyat || 'TL cinsinden fiyat'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Typography variant="body2" color="textSecondary">
                                        TL
                                    </Typography>
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                            }
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Stok Adedi"
                        name="stok_miktari"
                        type="number"
                        inputProps={{ 
                            min: "0",
                            step: "1"
                        }}
                        value={product.stok_miktari}
                        onChange={handleChange}
                        required
                        error={!!errors.stok_miktari}
                        helperText={errors.stok_miktari || 'Mevcut stok miktarı'}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Inventory color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Typography variant="body2" color="textSecondary">
                                        adet
                                    </Typography>
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                            }
                        }}
                    />
                </Grid>

                {/* Image URL */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Resim URL"
                        name="resim_url"
                        value={product.resim_url}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        helperText="Ürün resmi için URL giriniz (opsiyonel)"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Image color="action" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                            }
                        }}
                    />
                </Grid>

                {/* Image Preview */}
                {imagePreview && (
                    <Grid item xs={12}>
                        <Paper 
                            sx={{ 
                                p: 2, 
                                borderRadius: '12px',
                                border: '1px solid #e0e0e0',
                                backgroundColor: '#fafafa'
                            }}
                        >
                            <Typography variant="subtitle2" color="textSecondary" mb={2}>
                                Resim Ön İzleme:
                            </Typography>
                            <Box
                                component="img"
                                src={imagePreview}
                                alt="Ürün önizlemesi"
                                sx={{
                                    width: '100%',
                                    maxWidth: '200px',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    border: '2px solid #e0e0e0'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </Paper>
                    </Grid>
                )}

                {/* Form Validation Alert */}
                {Object.keys(errors).length > 0 && (
                    <Grid item xs={12}>
                        <Alert 
                            severity="error" 
                            sx={{ borderRadius: '12px' }}
                        >
                            Lütfen tüm zorunlu alanları doğru şekilde doldurunuz
                        </Alert>
                    </Grid>
                )}
            </Grid>

            {/* Action Buttons */}
            <Box 
                display="flex" 
                gap={2} 
                justifyContent="flex-end" 
                mt={4}
                pt={3}
                borderTop="1px solid #e0e0e0"
            >
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outlined"
                    startIcon={<Cancel />}
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 500,
                        px: 3,
                        py: 1.5,
                        minWidth: '120px'
                    }}
                >
                    İptal
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Save />}
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        minWidth: '120px',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                            transform: 'translateY(-1px)'
                        }
                    }}
                >
                    {productToEdit ? 'Güncelle' : 'Kaydet'}
                </Button>
            </Box>
        </Box>
    );
}

export default ProductForm;