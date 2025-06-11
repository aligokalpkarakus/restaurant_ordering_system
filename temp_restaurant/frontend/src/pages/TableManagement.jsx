import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, IconButton, Snackbar, Alert, Checkbox, FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTables, createTable, updateTable, deleteTable, getServers } from '../services/api';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [servers, setServers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [formData, setFormData] = useState({
    qr_code: '',
    is_occupied: false,
    assigned_server_id: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchTables();
    fetchServers();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await getTables();
      setTables(response.data);
    } catch (error) {
      showSnackbar('Error fetching tables', 'error');
    }
  };

  const fetchServers = async () => {
    try {
      const response = await getServers();
      setServers(response.data);
    } catch (error) {
      showSnackbar('Error fetching servers', 'error');
    }
  };

  const handleOpen = (table = null) => {
    if (table) {
      setSelectedTable(table);
      setFormData({
        qr_code: table.qr_code,
        is_occupied: table.is_occupied,
        assigned_server_id: table.assigned_server_id || ''
      });
    } else {
      setSelectedTable(null);
      setFormData({
        qr_code: '',
        is_occupied: false,
        assigned_server_id: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTable(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = { ...formData };
      submitData.is_occupied = Boolean(submitData.is_occupied);
      if (submitData.assigned_server_id === "") {
        delete submitData.assigned_server_id;
      } else {
        submitData.assigned_server_id = Number(submitData.assigned_server_id);
      }
      if (selectedTable) {
        await updateTable(selectedTable.id, submitData);
        showSnackbar('Table updated successfully');
      } else {
        await createTable(submitData);
        showSnackbar('Table added successfully');
      }
      handleClose();
      fetchTables();
    } catch (error) {
      showSnackbar('Error saving table', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await deleteTable(id);
        showSnackbar('Table deleted successfully');
        fetchTables();
      } catch (error) {
        showSnackbar('Error deleting table', 'error');
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
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', p: 4 }}>
      <Paper elevation={6} sx={{ maxWidth: 1100, mx: 'auto', p: 4, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">Table Management</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpen()}
            sx={{ 
              px: 4, 
              py: 1.5, 
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}
          >
            Add Table
          </Button>
        </Box>

        <Grid container spacing={3}>
          {tables.map((table) => (
            <Grid item xs={12} sm={6} md={4} key={table.id}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                  },
                  background: table.is_occupied ? 'linear-gradient(135deg, #ffe0e3 0%, #fff 100%)' : 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)',
                  border: table.is_occupied ? '2px solid #ffb3b3' : '2px solid #b3e5fc'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">QR: {table.qr_code}</Typography>
                  <Box>
                    <IconButton 
                      onClick={() => handleOpen(table)}
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
                      onClick={() => handleDelete(table.id)}
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
                </Box>
                <Typography 
                  sx={{ 
                    mb: 1,
                    color: table.is_occupied ? '#d32f2f' : '#2e7d32',
                    fontWeight: 500
                  }}
                >
                  Status: {table.is_occupied ? 'Occupied' : 'Empty'}
                </Typography>
                {table.assigned_server_id && (
                  <Typography color="text.secondary">
                    Server: {servers.find(s => s.id === table.assigned_server_id)?.name || 'Unknown'}
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedTable ? 'Edit Table' : 'Add New Table'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="QR Code"
                value={formData.qr_code}
                onChange={(e) => setFormData(prev => ({ ...prev, qr_code: e.target.value }))}
                margin="normal"
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_occupied}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_occupied: e.target.checked }))}
                  />
                }
                label="Is Occupied"
                sx={{ mt: 2 }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Assigned Server</InputLabel>
                <Select
                  value={formData.assigned_server_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, assigned_server_id: e.target.value }))}
                  label="Assigned Server"
                >
                  <MenuItem value="">None</MenuItem>
                  {servers.map(server => (
                    <MenuItem key={server.id} value={server.id}>{server.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
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
              Save
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
      </Paper>
    </Box>
  );
};

export default TableManagement; 