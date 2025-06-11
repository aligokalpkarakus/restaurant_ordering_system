import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Avatar, Button, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TableBarIcon from '@mui/icons-material/TableBar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { getAdminStats } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Toplam Kullanıcı', value: stats?.user_count ?? '-', icon: <PeopleIcon color="primary" /> },
    { label: 'Menü Ürünleri', value: stats?.menu_count ?? '-', icon: <RestaurantMenuIcon color="secondary" /> },
    { label: 'Aktif Masalar', value: stats?.table_count ?? '-', icon: <TableBarIcon color="success" /> },
    { label: 'Raporlar', value: stats?.report_count ?? '-', icon: <AssessmentIcon color="warning" /> },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        p: 4,
      }}
    >
      <Paper elevation={6} sx={{ maxWidth: 900, mx: 'auto', p: 4, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} align="center" color="primary">
          Admin Paneli
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {statCards.map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                  <Avatar sx={{ bgcolor: 'white', mx: 'auto', mb: 1, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">{stat.value}</Typography>
                  <Typography color="text.secondary">{stat.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        <Box mt={5} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          <Button variant="contained" color="primary" size="large" onClick={() => navigate('/admin/users')}>
            Kullanıcı Yönetimi
          </Button>
          <Button variant="contained" color="secondary" size="large" onClick={() => navigate('/admin/menu')}>
            Menü Yönetimi
          </Button>
          <Button variant="contained" color="success" size="large" onClick={() => navigate('/admin/tables')}>
            Masa Yönetimi
          </Button>
          <Button variant="contained" color="warning" size="large" onClick={() => navigate('/admin/reports')}>
            Raporlar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminPanel;