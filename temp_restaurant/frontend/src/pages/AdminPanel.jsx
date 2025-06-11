import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Avatar, Button, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TableBarIcon from '@mui/icons-material/TableBar';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReceiptIcon from '@mui/icons-material/Receipt';
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
    { label: 'Total Users', value: stats?.user_count ?? '-', icon: <PeopleIcon color="primary" /> },
    { label: 'Total Tables', value: stats?.table_count ?? '-', icon: <TableBarIcon color="success" /> },
    { label: 'Menu Items', value: stats?.menu_count ?? '-', icon: <RestaurantMenuIcon color="secondary" /> },
    { label: 'Total Reports', value: stats?.report_count ?? '-', icon: <AssessmentIcon color="warning" /> },
  ];

  const quickActions = [
    { label: 'Menu Management', icon: <RestaurantMenuIcon />, color: 'primary', path: '/admin/menu' },
    { label: 'Table Management', icon: <TableBarIcon />, color: 'success', path: '/admin/tables' },
    { label: 'Recipe Management', icon: <ReceiptIcon />, color: 'secondary', path: '/admin/recipes' },
    { label: 'User Management', icon: <PeopleIcon />, color: 'info', path: '/admin/users' },
    { label: 'Reports', icon: <AssessmentIcon />, color: 'warning', path: '/admin/reports' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', p: 4 }}>
      <Paper elevation={6} sx={{ maxWidth: 1100, mx: 'auto', p: 4, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)' }}>
        <Typography variant="h3" fontWeight="bold" mb={4} align="center" color="primary">
          Admin Dashboard
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center" mb={2}>
            {statCards.map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card 
                  elevation={4}
                  sx={{ 
                    p: 2, 
                    borderRadius: 4, 
                    textAlign: 'center',
                    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)',
                    background: idx === 0 ? 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)' :
                                idx === 1 ? 'linear-gradient(135deg, #e8f5e9 0%, #fff 100%)' :
                                idx === 2 ? 'linear-gradient(135deg, #fff3e0 0%, #fff 100%)' :
                                'linear-gradient(135deg, #ffebee 0%, #fff 100%)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Avatar sx={{ bgcolor: 'white', mx: 'auto', mb: 1, width: 56, height: 56, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                  <Typography color="text.secondary" fontWeight={500}>{stat.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Box mt={6}>
          <Typography variant="h5" fontWeight="bold" mb={2} color="primary">Quick Actions</Typography>
          <Grid container spacing={3} justifyContent="center">
            {quickActions.map((action, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={action.label}>
                <Card
                  elevation={3}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    borderRadius: 4,
                    minHeight: 120,
                    boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mb: 1, width: 48, height: 48, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    {action.icon}
                  </Avatar>
                  <Button
                    variant="contained"
                    color={action.color}
                    size="large"
                    fullWidth
                    sx={{
                      mt: 1,
                      fontWeight: 600,
                      borderRadius: 2,
                      px: 2,
                      py: 1.2,
                      fontSize: 16,
                      letterSpacing: 1,
                      boxShadow: 'none',
                      textTransform: 'none',
                      transition: 'background 0.2s',
                      '&:hover': {
                        background: 'rgba(25, 118, 210, 0.08)'
                      }
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    {action.label}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminPanel;