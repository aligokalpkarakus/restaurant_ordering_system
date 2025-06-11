import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Switch, CircularProgress, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getTables, createTable, updateTableStatus } from '../services/api';

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ qr_code: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchTables = async () => {
    const data = await getTables();
    const sorted = data.sort((a, b) => a.id - b.id);
    setTables(sorted);
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 5000); // 5 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    setForm({ qr_code: '' });
    setError('');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setError('');
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      await createTable(form);
      fetchTables();
      handleClose();
    } catch (err) {
      setError('Masa eklenemedi!');
    } finally {
      setSaving(false);
    }
  };
  const handleStatusChange = async (id, is_occupied) => {
    await updateTableStatus(id, is_occupied);
    fetchTables();
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', p: 4 }}>
      <Paper elevation={6} sx={{ maxWidth: 1100, mx: 'auto', p: 4, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">Table Management</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>Add Table</Button>
        </Box>
        <Grid container spacing={3}>
          {tables.map(table => (
            <Grid item xs={12} sm={6} md={4} key={table.id}>
              <Paper elevation={4} sx={{
                p: 3,
                borderRadius: 4,
                minHeight: 160,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)',
                background: table.is_occupied ? 'linear-gradient(135deg, #ffe0e3 0%, #fff 100%)' : 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)',
                border: table.is_occupied ? '2px solid #ffb3b3' : '2px solid #b3e5fc',
                position: 'relative'
              }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">Table #{table.id}</Typography>
                  <Box component="span" sx={{
                    px: 2, py: 0.5, borderRadius: 2, fontWeight: 600,
                    bgcolor: table.is_occupied ? '#ffb3b3' : '#b3e5fc',
                    color: table.is_occupied ? '#b71c1c' : '#01579b',
                    fontSize: 14
                  }}>{table.is_occupied ? 'Occupied' : 'Empty'}</Box>
                </Box>
                <Typography color="text.secondary" sx={{ mb: 1 }}>QR Code: <b>{table.qr_code}</b></Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography color={table.is_occupied ? 'error' : 'success.main'} fontWeight={600}>
                    {table.is_occupied ? 'Occupied' : 'Empty'}
                  </Typography>
                  <Switch
                    checked={table.is_occupied}
                    onChange={e => handleStatusChange(table.id, e.target.checked)}
                    color="primary"
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Yeni Masa Ekle</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="QR Kodu" name="qr_code" value={form.qr_code} onChange={handleChange} fullWidth required />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving} startIcon={saving && <CircularProgress size={18} />}>Kaydet</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableManagement; 