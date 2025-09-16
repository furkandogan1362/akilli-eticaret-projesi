import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Chip, CircularProgress, Alert,
  Container, Button, Dialog, DialogTitle, DialogContent, TextField,
  Switch, FormControlLabel, Select, MenuItem, InputLabel, FormControl,
  useTheme, useMediaQuery, Card, CardContent, Avatar, Stack, Divider,
  DialogActions, Snackbar
} from '@mui/material';
import {
  Delete as DeleteIcon, Person as PersonIcon, AdminPanelSettings as AdminIcon,
  Email as EmailIcon, Add as AddIcon, Edit as EditIcon, Security as ModeratorIcon
} from '@mui/icons-material';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';

// Düzenleme ve Ekleme için ortak Form bileşeni
const UserForm = ({ userToEdit, onSubmit, onCancel, currentAdmin }) => {
  const [formData, setFormData] = useState({
    ad: '', soyad: '', email: '', password: '', role: 'user'
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        ad: userToEdit.ad || '',
        soyad: userToEdit.soyad || '',
        email: userToEdit.email || '',
        password: '',
        role: userToEdit.role || 'user'
      });
    } else {
      setFormData({ ad: '', soyad: '', email: '', password: '', role: 'user' });
    }
  }, [userToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData };
    if (userToEdit && !dataToSend.password) {
      delete dataToSend.password;
    }
    onSubmit(dataToSend);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Stack spacing={2}>
        <TextField name="ad" label="Ad" value={formData.ad} onChange={handleChange} fullWidth required />
        <TextField name="soyad" label="Soyad" value={formData.soyad} onChange={handleChange} fullWidth required />
        <TextField name="email" label="E-posta" type="email" value={formData.email} onChange={handleChange} fullWidth required />
        <TextField
          name="password"
          label="Yeni Şifre (Değiştirmek için doldurun)"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth={!userToEdit}
          required={!userToEdit}
        />
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

// Mobil görünüm için kart bileşeni
const MobileUserCard = ({ user, handleOpenEditModal, handleDelete, adminUser }) => (
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
      {user.id !== adminUser.id && (
        <Box mt={2} display="flex" justifyContent="flex-end">
          <IconButton
            onClick={() => handleOpenEditModal('edit', user)}
            color="primary"
            disabled={user.id === 1 && adminUser.id !== 1}
            sx={{ mr: 1, '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(user)}
            color="error"
            sx={{ '&:hover': { bgcolor: 'error.light', color: 'white' } }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </CardContent>
  </Card>
);

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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
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
  }, []);

  const handleDelete = (user) => {
    if (user.id === adminUser.id) {
      setSnackbarMessage("Admin kendi hesabını silemez!");
      setSnackbarOpen(true);
      return;
    }
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
        setUsers(prevUsers => [response.data, ...prevUsers]);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress size={48} />
          <Typography variant="h6" color="text.secondary">
            Kullanıcılar yükleniyor...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

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

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <DialogTitle fontWeight="bold">{modalMode === 'edit' ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Oluştur'}</DialogTitle>
        <DialogContent>
          <UserForm userToEdit={editingUser} onSubmit={handleFormSubmit} onCancel={handleCloseModal} currentAdmin={adminUser} />
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

      {!isMobile ? (
        <Paper
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
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
                      <IconButton
                        onClick={() => handleOpenModal('edit', user)}
                        color="primary"
                        disabled={user.id === 1 && adminUser.id !== 1}
                        sx={{ mr: 1, '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
                      >
                        <EditIcon />
                      </IconButton>
                      {user.id !== adminUser.id && (
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
        <Box>
          {users.map((user) => (
            <MobileUserCard
              key={user.id}
              user={user}
              handleOpenEditModal={handleOpenModal}
              handleDelete={handleDelete}
              adminUser={adminUser}
            />
          ))}
        </Box>
      )}
    </Container>
  );
}

export default ManageUsersPage;