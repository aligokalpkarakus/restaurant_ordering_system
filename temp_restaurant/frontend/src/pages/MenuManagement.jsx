import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl, IconButton, Tabs, Tab, Alert, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getMenuItemsByCategory, createMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage } from '../services/api';

const categories = [
  'Main Dishes',
  'Beverages',
  'Desserts',
  'Snacks',
  'Other'
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
    if (item) {
      setEditItem(item);
      setForm({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image_url: item.image_url,
        dietary_info: item.dietary_info
      });
    } else {
      setEditItem(null);
      setForm({
        name: '',
        description: '',
        price: '',
        category: categories[0],
        image_url: '',
        dietary_info: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setForm({
      name: '',
      description: '',
      price: '',
      category: categories[0],
      image_url: '',
      dietary_info: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editItem) {
        await updateMenuItem(editItem.id, form);
      } else {
        await createMenuItem(form);
      }
      handleClose();
      fetchMenu(selectedCategory);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem(id);
        fetchMenu(selectedCategory);
      } catch (err) {
        setError(err.response?.data?.detail || 'An error occurred');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await uploadMenuImage(formData);
      setForm(prev => ({ ...prev, image_url: response.data.url }));
    } catch (err) {
      setError(err.response?.data?.detail || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', p: 4 }}>
      <Paper elevation={6} sx={{ maxWidth: 1200, mx: 'auto', p: 4, borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h3" fontWeight="bold" color="primary">Menu Management</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpen()}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 18,
              boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}
          >
            Add Product
          </Button>
        </Box>

        <Tabs 
          value={selectedCategory} 
          onChange={(_, val) => setSelectedCategory(val)} 
          sx={{ 
            mb: 4,
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: 18,
              borderRadius: 2,
              px: 3,
              py: 1,
              mx: 1,
              transition: 'all 0.2s',
              '&:hover': {
                background: 'rgba(25,118,210,0.08)',
                transform: 'translateY(-2px)'
              }
            }
          }}
        >
          {categories.map(cat => <Tab key={cat} value={cat} label={cat} />)}
        </Tabs>

        <Grid container spacing={4}>
          {menuItems.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Paper 
                elevation={4} 
                sx={{ 
                  p: 3, 
                  borderRadius: 4, 
                  minHeight: 210,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)',
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                    boxShadow: '0 16px 48px 0 rgba(25,118,210,0.15)'
                  }
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {item.image_url && (
                    <img 
                      src={`http://localhost:8000${item.image_url}`} 
                      alt={item.name} 
                      style={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: 12, 
                        objectFit: 'cover',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                      }} 
                    />
                  )}
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{item.name}</Typography>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>{item.description}</Typography>
                    <Typography fontWeight="bold" color="primary" sx={{ fontSize: 18 }}>₺{item.price}</Typography>
                    <Typography variant="caption" color="secondary" fontWeight={600}>{item.dietary_info}</Typography>
                  </Box>
                </Box>
                <Box position="absolute" top={12} right={12} display="flex" gap={1}>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleOpen(item)}
                    sx={{
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(item.id)}
                    sx={{
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{editItem ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                margin="normal"
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                margin="normal"
                required
                InputProps={{
                  startAdornment: '₺'
                }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  label="Category"
                >
                  {categories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Dietary Info"
                value={form.dietary_info}
                onChange={(e) => setForm(prev => ({ ...prev, dietary_info: e.target.value }))}
                margin="normal"
                placeholder="e.g., Vegetarian, Gluten-Free"
              />
              <Button
                component="label"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
              {form.image_url && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img
                    src={`http://localhost:8000${form.image_url}`}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={saving}
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default MenuManagement; 