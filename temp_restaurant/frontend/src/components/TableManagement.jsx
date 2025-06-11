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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Table Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Table
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={4} key={table.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">QR: {table.qr_code}</Typography>
                  <Box>
                    <IconButton onClick={() => handleOpen(table)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(table.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography>Status: {table.is_occupied ? 'Occupied' : 'Empty'}</Typography>
                {table.assigned_server_id && (
                  <Typography>
                    Server: {servers.find(s => s.id === table.assigned_server_id)?.name || 'Unknown'}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedTable ? 'Edit Table' : 'Add Table'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="QR Code"
              value={formData.qr_code}
              onChange={(e) => setFormData({ ...formData, qr_code: e.target.value })}
              margin="normal"
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.is_occupied}
                  onChange={(e) => setFormData({ ...formData, is_occupied: e.target.checked })}
                />
              }
              label="Occupied"
              sx={{ mt: 1 }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Assigned Server</InputLabel>
              <Select
                value={formData.assigned_server_id}
                onChange={(e) => setFormData({ ...formData, assigned_server_id: e.target.value })}
                label="Assigned Server"
              >
                <MenuItem value="">None</MenuItem>
                {servers.map((server) => (
                  <MenuItem key={server.id} value={server.id}>
                    {server.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedTable ? 'Update' : 'Add'}
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

export default TableManagement; 