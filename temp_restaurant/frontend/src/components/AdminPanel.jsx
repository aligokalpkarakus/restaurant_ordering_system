import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Restaurant as RestaurantIcon,
  TableRestaurant as TableIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getAdminStats } from '../services/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stats, setStats] = useState({
    user_count: 0,
    table_count: 0,
    menu_count: 0,
    report_count: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getAdminStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Menu Management', icon: <RestaurantIcon />, path: '/admin/menu' },
    { text: 'Table Management', icon: <TableIcon />, path: '/admin/tables' },
    { text: 'Recipe Management', icon: <ReceiptIcon />, path: '/admin/recipes' },
    { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Reports', icon: <AssessmentIcon />, path: '/admin/reports' }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Restaurant Management System
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', minHeight: '100vh' }}>
        <Paper elevation={6} sx={{ maxWidth: 1100, mx: 'auto', p: 4, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)' }}>
          <Typography variant="h3" fontWeight="bold" mb={4} align="center" color="primary">
            Admin Dashboard
          </Typography>
          <Grid container spacing={3} justifyContent="center" mb={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={4} sx={{ p: 2, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)', background: 'linear-gradient(135deg, #e3f2fd 0%, #fff 100%)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
                <Avatar sx={{ bgcolor: 'white', mx: 'auto', mb: 1, width: 56, height: 56, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}><PeopleIcon color="primary" /></Avatar>
                <Typography variant="h5" fontWeight="bold">{stats.user_count}</Typography>
                <Typography color="text.secondary" fontWeight={500}>Total Users</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={4} sx={{ p: 2, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)', background: 'linear-gradient(135deg, #e8f5e9 0%, #fff 100%)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
                <Avatar sx={{ bgcolor: 'white', mx: 'auto', mb: 1, width: 56, height: 56, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}><TableIcon color="success" /></Avatar>
                <Typography variant="h5" fontWeight="bold">{stats.table_count}</Typography>
                <Typography color="text.secondary" fontWeight={500}>Total Tables</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card elevation={4} sx={{ p: 2, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)', background: 'linear-gradient(135deg, #fff3e0 0%, #fff 100%)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
                <Avatar sx={{ bgcolor: 'white', mx: 'auto', mb: 1, width: 56, height: 56, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}><RestaurantIcon color="secondary" /></Avatar>
                <Typography variant="h5" fontWeight="bold">{stats.menu_count}</Typography>
                <Typography color="text.secondary" fontWeight={500}>Menu Items</Typography>
              </Card>
            </Grid>
          </Grid>
          <Box mt={6}>
            <Typography variant="h5" fontWeight="bold" mb={2} color="primary">Quick Actions</Typography>
            <Grid container spacing={3} justifyContent="center">
              {[{ label: 'Menu Management', icon: <RestaurantIcon />, color: 'primary', path: '/admin/menu' }, { label: 'Table Management', icon: <TableIcon />, color: 'success', path: '/admin/tables' }, { label: 'Recipe Management', icon: <ReceiptIcon />, color: 'secondary', path: '/admin/recipes' }, { label: 'User Management', icon: <PeopleIcon />, color: 'info', path: '/admin/users' }, { label: 'Reports', icon: <AssessmentIcon />, color: 'warning', path: '/admin/reports' }].map((action, idx) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={action.label}>
                  <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, borderRadius: 4, minHeight: 120, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)', background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
                    <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mb: 1, width: 48, height: 48, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>{action.icon}</Avatar>
                    <Button variant="contained" color={action.color} size="large" fullWidth sx={{ mt: 1, fontWeight: 600, borderRadius: 2, px: 2, py: 1.2, fontSize: 16, letterSpacing: 1, boxShadow: 'none', textTransform: 'none', transition: 'background 0.2s', '&:hover': { background: 'rgba(25, 118, 210, 0.08)' } }} onClick={() => navigate(action.path)}>{action.label}</Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminPanel; 