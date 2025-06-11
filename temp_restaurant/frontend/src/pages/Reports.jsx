import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reports, setReports] = useState({
    income: 0,
    bestSellers: [],
    lowStock: [],
    orderCount: 0
  });

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const [income, bestSellers, lowStock, orderCount] = await Promise.all([
        axios.get('http://localhost:8000/reports/income', { params }),
        axios.get('http://localhost:8000/reports/best-sellers', { params }),
        axios.get('http://localhost:8000/reports/low-stock'),
        axios.get('http://localhost:8000/reports/order-count', { params })
      ]);

      setReports({
        income: income.data.total_income,
        bestSellers: bestSellers.data,
        lowStock: lowStock.data,
        orderCount: orderCount.data.total_orders
      });
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', p: 4 }}>
      <Paper elevation={6} sx={{ maxWidth: 1200, mx: 'auto', p: 4, borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h3" fontWeight="bold" color="primary">Reports</Typography>
          <Box display="flex" gap={2}>
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" onClick={fetchReports} disabled={loading} sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 600, fontSize: 18, boxShadow: '0 2px 8px rgba(25,118,210,0.08)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              {loading ? <CircularProgress size={24} /> : 'Update'}
            </Button>
          </Box>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-8px) scale(1.03)', boxShadow: '0 16px 48px 0 rgba(25,118,210,0.15)' } }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>Total Income</Typography>
                <Typography variant="h4" fontWeight="bold">₺{reports.income.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #e8f5e9 0%, #fff 100%)', borderRadius: 4, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-8px) scale(1.03)', boxShadow: '0 16px 48px 0 rgba(25,118,210,0.15)' } }}>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>Total Orders</Typography>
                <Typography variant="h4" fontWeight="bold">{reports.orderCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper} sx={{ background: 'linear-gradient(135deg, #fff3e0 0%, #fff 100%)', borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Product</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: 16 }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: 16 }}>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.bestSellers.map((item, idx) => (
                    <TableRow key={item.product || item.name || idx} sx={{ transition: 'background 0.2s', '&:hover': { background: '#fff8e1' } }}>
                      <TableCell>{item.product || item.name}</TableCell>
                      <TableCell align="right">{item.quantity || item.total_quantity}</TableCell>
                      <TableCell align="right">₺{(Number(item.revenue || item.total_revenue) || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper} sx={{ background: 'linear-gradient(135deg, #ffebee 0%, #fff 100%)', borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Item</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: 16 }}>Current Stock</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: 16 }}>Minimum Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.lowStock.map((item, idx) => (
                    <TableRow key={item.item + '-' + idx} sx={{ transition: 'background 0.2s', '&:hover': { background: '#ffebee' } }}>
                      <TableCell>{item.item}</TableCell>
                      <TableCell align="right">{item.current_stock}</TableCell>
                      <TableCell align="right">{item.minimum_stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Reports; 