import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl, IconButton, Tabs, Tab, Alert, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getMenuItemsByCategory, createMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage } from '../services/api';

const categories = [
  'Yemekler',
  'İçecekler',
  'Tatlılar',
  'Atıştırmalıklar',
  'Diğer'
];

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: categories[0], image_url: '', dietary_info: '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchMenu = async (category) => {
    const items = await getMenuItemsByCategory(category);
    setMenuItems(items);
  };

  useEffect(() => {
    fetchMenu(selectedCategory);
  }, [selectedCategory]);

  const handleOpen = (item = null) => {
    setEditItem(item);
    setForm(item ? { ...item } : { name: '', description: '', price: '', category: selectedCategory, image_url: '', dietary_info: '' });
    setError('');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setError('');
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadMenuImage(formData);
      setForm(f => ({ ...f, image_url: response.data.image_url }));
    } catch (err) {
      setError('Resim yüklenemedi!');
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      if (editItem) {
        await updateMenuItem(editItem.id, form);
      } else {
        await createMenuItem(form);
      }
      fetchMenu(selectedCategory);
      handleClose();
    } catch (err) {
      setError('Ürün kaydedilemedi!');
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    await deleteMenuItem(id);
    fetchMenu(selectedCategory);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', p: 4 }}>
      <Paper elevation={6} sx={{ maxWidth: 1100, mx: 'auto', p: 4, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">Menu Management</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Product</Button>
        </Box>
        <Tabs value={selectedCategory} onChange={(_, val) => setSelectedCategory(val)} sx={{ mb: 3 }}>
          {categories.map(cat => <Tab key={cat} value={cat} label={cat} />)}
        </Tabs>
        <Grid container spacing={3}>
          {menuItems.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 3, position: 'relative' }}>
                <Box display="flex" alignItems="center" gap={2}>
                  {item.image_url && <img src={`http://localhost:8000${item.image_url}`} alt={item.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />}
                  <Box>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography color="text.secondary">{item.description}</Typography>
                    <Typography fontWeight="bold">₺{item.price}</Typography>
                    <Typography variant="caption" color="primary">{item.dietary_info}</Typography>
                  </Box>
                </Box>
                <Box position="absolute" top={8} right={8} display="flex" gap={1}>
                  <IconButton color="primary" onClick={() => handleOpen(item)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editItem ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Ürün Adı" name="name" value={form.name} onChange={handleChange} fullWidth required />
          <TextField label="Açıklama" name="description" value={form.description} onChange={handleChange} fullWidth />
          <TextField label="Fiyat" name="price" value={form.price} onChange={handleChange} fullWidth required type="number" />
          <FormControl fullWidth>
            <InputLabel>Kategori</InputLabel>
            <Select name="category" value={form.category} label="Kategori" onChange={handleChange}>
              {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="outlined" component="label" disabled={uploading}>
            {uploading ? 'Yükleniyor...' : 'Resim Yükle'}
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </Button>
          {form.image_url && (
            <img src={`http://localhost:8000${form.image_url}`} alt="Yüklenen" style={{ width: 100, marginTop: 8, borderRadius: 8 }} />
          )}
          <TextField label="Diyet Bilgisi" name="dietary_info" value={form.dietary_info} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving} startIcon={saving && <CircularProgress size={18} />}>Kaydet</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuManagement; 