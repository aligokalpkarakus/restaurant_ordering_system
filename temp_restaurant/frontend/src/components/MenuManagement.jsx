import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import {
  getMenuItems,
  getMenuItemsByCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadMenuImage
} from '../services/api';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['Appetizers', 'Main Course', 'Desserts', 'Beverages']);
  const [selectedCategory, setSelectedCategory] = useState('Appetizers');
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Appetizers',
    image_url: '',
    dietary_info: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  const fetchMenuItems = async () => {
    try {
      const response = await getMenuItemsByCategory(selectedCategory);
      setMenuItems(response.data ? response.data : response);
    } catch (error) {
      showSnackbar('Error fetching menu items', 'error');
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image_url: item.image_url,
        dietary_info: item.dietary_info || ''
      });
    } else {
      setSelectedItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: selectedCategory,
        image_url: '',
        dietary_info: ''
      });
    }
    setImageFile(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setImageFile(null);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const formDataImg = new FormData();
        formDataImg.append('file', file);
        const response = await uploadMenuImage(formDataImg); // expects { image_url: ... }
        setFormData((prev) => ({ ...prev, image_url: response.data ? response.data.image_url : response.image_url }));
        setImageFile(file);
        showSnackbar('Image uploaded successfully');
      } catch (error) {
        showSnackbar('Image upload failed', 'error');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let itemData = { ...formData };
      itemData.price = parseFloat(itemData.price);
      if (selectedItem) {
        const response = await updateMenuItem(selectedItem.id, itemData);
        showSnackbar('Menu item updated successfully');
      } else {
        const response = await createMenuItem(itemData);
        showSnackbar('Menu item added successfully');
      }
      handleClose();
      fetchMenuItems();
    } catch (error) {
      showSnackbar('Error saving menu item', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await deleteMenuItem(id);
        showSnackbar('Menu item deleted successfully');
        fetchMenuItems();
      } catch (error) {
        showSnackbar('Error deleting menu item', 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Menu Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Menu Item
        </Button>
      </Box>

      <Tabs
        value={selectedCategory}
        onChange={(e, newValue) => setSelectedCategory(newValue)}
        sx={{ mb: 3 }}
      >
        {categories.map((category) => (
          <Tab key={category} value={category} label={category} />
        ))}
      </Tabs>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              {item.image_url && (
                <CardMedia
                  component="img"
                  image={`http://localhost:8000${item.image_url}`}
                  alt={item.name}
                  sx={{
                    width: '100%',
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                    borderRadius: 2,
                    background: '#eee'
                  }}
                  onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                />
              )}
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Box>
                    <IconButton onClick={() => handleOpen(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {item.description}
                </Typography>
                <Typography variant="body2" color="secondary" sx={{ fontWeight: 500, mb: 1 }}>
                  {item.dietary_info}
                </Typography>
                <Typography variant="h6" color="primary">
                  ₺{item.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              required
            />
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Dietary Info"
              value={formData.dietary_info}
              onChange={(e) => setFormData({ ...formData, dietary_info: e.target.value })}
              margin="normal"
              placeholder="Vegan, Gluten-Free, etc."
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {formData.image_url && (
              <Box sx={{ mt: 2 }}>
                <img
                  src={`http://localhost:8000${formData.image_url}`}
                  alt="Preview"
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px #0002',
                    background: '#eee'
                  }}
                  onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedItem ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuManagement;