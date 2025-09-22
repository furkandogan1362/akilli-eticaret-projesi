import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Chip, CircularProgress, Alert,
  Container, Button, Dialog, DialogTitle, DialogContent, TextField,
  Switch, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Grid,
  useTheme, useMediaQuery, Card, CardContent, Avatar, Stack, Divider,
  DialogActions, Snackbar, InputAdornment
} from '@mui/material';
import {
  Delete as DeleteIcon, Person as PersonIcon, AdminPanelSettings as AdminIcon,
  Email as EmailIcon, Add as AddIcon, Edit as EditIcon, Security as ModeratorIcon,
  Visibility, VisibilityOff
} from '@mui/icons-material';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import useDebounce from '../../hooks/useDebounce';

// UserForm bileşeni güncellendi
const UserForm = ({ userToEdit, onSubmit, onCancel, currentAdmin, onError }) => {
  const [formData, setFormData] = useState({
    ad: '', soyad: '', email: '', password: '', role: 'user'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        ad: userToEdit.ad || '', soyad: userToEdit.soyad || '',
        email: userToEdit.email || '', password: '',
        role: userToEdit.role || 'user'
      });
      setConfirmPassword('');
    } else {
      setFormData({ ad: '', soyad: '', email: '', password: '', role: 'user' });
    }
  }, [userToEdit]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      onError("Şifreler uyuşmuyor!");
      return;
    }
    const dataToSend = { ...formData };
    if (userToEdit && !dataToSend.password) {
      delete dataToSend.password;
    }
    onSubmit(dataToSend);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Stack spacing={2}>
        {/* Ad, Soyad, Email aynı */}
        <TextField name="ad" label="Ad" value={formData.ad} onChange={handleChange} fullWidth required />
        <TextField name="soyad" label="Soyad" value={formData.soyad} onChange={handleChange} fullWidth required />
        <TextField name="email" label="E-posta" type="email" value={formData.email} onChange={handleChange} fullWidth required />
        
        <TextField
          name="password"
          label={userToEdit ? "Yeni Şifre (Değiştirmek için doldurun)" : "Şifre"}
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required={!userToEdit}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <TextField
          name="confirmPassword"
          label="Şifreyi Doğrula"
          type={showPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          required={!userToEdit || !!formData.password}
        />
        {/* Rol ve Butonlar aynı */}
        <FormControl fullWidth disabled={currentAdmin.id !== 1}>
          <InputLabel id="role-select-label">Rol</InputLabel>
          <Select
            labelId="role-select-label"
            name="role"
            value={formData.role}
            label="Rol"
            onChange={handleChange}
          >
            <MenuItem value="user">Kullanıcı</MenuItem>
            <MenuItem value="moderator">Moderatör</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2 }}>
          <Button onClick={onCancel} variant="outlined">İptal</Button>
          <Button type="submit" variant="contained">{userToEdit ? 'Değişiklikleri Kaydet' : 'Kullanıcı Oluştur'}</Button>
        </Box>
      </Stack>
    </Box>
  );
};

// ManageUsersPage ana bileşeni
function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { user: adminUser } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        role: roleFilter,
        search: debouncedSearchTerm,
      };
      const response = await api.get('/admin/users', { params });
      setUsers(response.data);
      setError(null);
    } catch (error) {
      setError("Kullanıcılar yüklenirken bir hata oluştu.");
      console.error("Kullanıcılar alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, debouncedSearchTerm]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/users/${userToDelete.id}`);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      setSnackbarMessage("Kullanıcı başarıyla silindi.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Kullanıcı silinemedi:", error);
      setSnackbarMessage(error.response?.data?.message || "Kullanıcı silinemedi.");
      setSnackbarOpen(true);
    }
  };

  const handleOpenModal = (mode, user = null) => {
    setModalMode(mode);
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setEditingUser(null);
  };

  const handleFormSubmit = async (userData) => {
    const isEditing = modalMode === 'edit';
    const endpoint = isEditing ? `/admin/users/${editingUser.id}` : '/admin/users';
    const method = isEditing ? 'put' : 'post';

    try {
      const dataToSend = { ...userData };
      if (isEditing && !dataToSend.password) {
        delete dataToSend.password;
      }
      const response = await api[method](endpoint, dataToSend);
      if (isEditing) {
        setUsers(prevUsers => prevUsers.map(u => u.id === response.data.id ? response.data : u));
      } else {
        setUsers(prevUsers => [...prevUsers, response.data]);
      }
      handleCloseModal();
      setSnackbarMessage(`Kullanıcı başarıyla ${isEditing ? 'güncellendi' : 'oluşturuldu'}.`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("İşlem başarısız:", error);
      setSnackbarMessage(error.response?.data?.message || `Kullanıcı ${isEditing ? 'güncellenemedi' : 'oluşturulamadı'}.`);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleFormError = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getRoleLabel = (role) => {
    const roleLabels = {
      'admin': 'Admin',
      'moderator': 'Moderatör', 
      'user': 'Kullanıcı'
    };
    return roleLabels[role] || 'Tümü';
  };

  const canEdit = (targetUser) => {
    if (!adminUser) return false;
    if (adminUser.role === 'admin') return targetUser.id !== adminUser.id;
    if (adminUser.role === 'moderator') return targetUser.role === 'user';
    return false;
  };

  const canDelete = (targetUser) => {
    if (!adminUser) return false;
    if (adminUser.role === 'admin') return targetUser.id !== adminUser.id;
    if (adminUser.role === 'moderator') return targetUser.role === 'user';
    return false;
  };

  const MobileUserCard = ({ user }) => (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease'
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar
            sx={{
              bgcolor: user.role === 'admin' ? 'primary.main' : user.role === 'moderator' ? 'info.main' : 'secondary.main',
              width: 48,
              height: 48
            }}
          >
            {user.role === 'admin' ? <AdminIcon /> : user.role === 'moderator' ? <ModeratorIcon /> : <PersonIcon />}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" color="text.primary" fontWeight={600} noWrap>
              {user.ad} {user.soyad}
            </Typography>
            <Chip
              label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              color={user.role === 'admin' ? 'primary' : user.role === 'moderator' ? 'info' : 'secondary'}
              size="small"
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
              {user.email}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            <strong>ID:</strong> {user.id}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Kayıt:</strong> {new Date(user.olusturulma_tarihi).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Stack>
        <Box mt={2} display="flex" justifyContent="flex-end">
          {canEdit(user) && (
            <IconButton
              onClick={() => handleOpenModal('edit', user)}
              color="primary"
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          )}
          {canDelete(user) && (
            <IconButton
              onClick={() => handleDelete(user)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={4}>
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">Kullanıcılar yükleniyor...</Typography>
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error" sx={{ mt: 4, borderRadius: 2 }}>{error}</Alert>;
    }

    if (users.length === 0) {
      return <Typography sx={{ textAlign: 'center', mt: 4, p: 2 }}>Filtreye uygun kullanıcı bulunamadı.</Typography>;
    }

    return !isMobile ? (
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Ad</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Soyad</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>E-posta</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Yetki</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Kayıt Tarihi</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    '&:hover': { bgcolor: 'grey.50' },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: user.role === 'admin' ? 'primary.main' : user.role === 'moderator' ? 'info.main' : 'secondary.main',
                          width: 32,
                          height: 32
                        }}
                      >
                        {user.role === 'admin' ? <AdminIcon fontSize="small" /> : user.role === 'moderator' ? <ModeratorIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                      </Avatar>
                      <Typography fontWeight={600}>
                        {user.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.ad || '-'}</TableCell>
                  <TableCell>{user.soyad || '-'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      icon={user.role === 'admin' ? <AdminIcon /> : user.role === 'moderator' ? <ModeratorIcon /> : <PersonIcon />}
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      color={user.role === 'admin' ? 'primary' : user.role === 'moderator' ? 'info' : 'secondary'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.olusturulma_tarihi)}</TableCell>
                  <TableCell align="center">
                    {canEdit(user) && (
                      <IconButton
                        onClick={() => handleOpenModal('edit', user)}
                        color="primary"
                        sx={{ mr: 1, '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {canDelete(user) && (
                      <IconButton
                        onClick={() => handleDelete(user)}
                        color="error"
                        sx={{ '&:hover': { bgcolor: 'error.light', color: 'white' } }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    ) : (
      <Box sx={{ mt: 4 }}>
        {users.map((user) => (
          <MobileUserCard
            key={user.id}
            user={user}
          />
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 4
      }}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight={700}
            color="primary.main"
          >
            Kullanıcı Yönetimi
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Toplam {users.length} kullanıcı
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal('add')}
          sx={{ mt: { xs: 2, sm: 0 } }}
        >
          Yeni Kullanıcı Ekle
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
          Filtreleme ve Arama
        </Typography>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              label="Kullanıcı Adı veya E-posta ile Ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined" size="medium">
              <InputLabel id="role-filter-label">Rol</InputLabel>
              <Select
                labelId="role-filter-label"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Rol"
                renderValue={(selected) => {
                  if (selected === '') {
                    return <Typography sx={{ color: 'text.disabled' }}>Rol</Typography>;
                  }
                  return getRoleLabel(selected);
                }}
                sx={{
                  borderRadius: '8px',
                  '& .MuiSelect-select': {
                    minWidth: '150px',
                  }
                }}
              >
                <MenuItem value="">Tüm Roller</MenuItem>
                <MenuItem value="admin">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminIcon fontSize="small" color="primary" />
                    <Typography>Admin</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="moderator">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ModeratorIcon fontSize="small" color="info" />
                    <Typography>Moderatör</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="user">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" color="action" />
                    <Typography>Kullanıcı</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ 
                height: '56px',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white'
                }
              }}
            >
              Filtreleri Sıfırla
            </Button>
          </Grid>
        </Grid>
        
        {(searchTerm || roleFilter) && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Aktif Filtreler:
            </Typography>
            {searchTerm && (
              <Chip
                label={`Arama: "${searchTerm}"`}
                size="small"
                onDelete={() => setSearchTerm('')}
                color="primary"
                variant="outlined"
              />
            )}
            {roleFilter && (
              <Chip
                label={`Rol: ${getRoleLabel(roleFilter)}`}
                size="small"
                onDelete={() => setRoleFilter('')}
                color="secondary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Paper>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <DialogTitle fontWeight="bold">{modalMode === 'edit' ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Oluştur'}</DialogTitle>
        <DialogContent>
          <UserForm 
            userToEdit={editingUser} 
            onSubmit={handleFormSubmit} 
            onCancel={handleCloseModal} 
            currentAdmin={adminUser}
            onError={handleFormError} 
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle>
          <Typography component="span" variant="h6" fontWeight={600}>
            Kullanıcıyı Sil
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: '8px' }}>
            Bu işlem geri alınamaz!
          </Alert>
          <Typography>
            <strong>{userToDelete?.ad} {userToDelete?.soyad}</strong> kullanıcısını silmek istediğinize emin misiniz?
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
            onClick={confirmDelete}
            color="error"
            variant="contained"
            sx={{ textTransform: 'none', borderRadius: '8px' }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>

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
      
      {renderContent()}

    </Container>
  );
}

export default ManageUsersPage;