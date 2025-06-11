import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const success = await login(formData);
      if (success) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.role) {
          setError('Geçersiz kullanıcı bilgileri');
          return;
        }
        
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'kitchen') {
          navigate('/kitchen');
        } else if (user.role === 'server' || user.role === 'waiter') {
          navigate('/waiter-panel');
        } else {
          setError('Yetkisiz kullanıcı!');
        }
      } else {
        setError('Geçersiz e-posta veya şifre');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)',
        }}
      >
        <Card sx={{ width: '100%', boxShadow: 6, borderRadius: 4 }}>
          <CardContent>
            <Typography component="h1" variant="h4" align="center" fontWeight={700} gutterBottom>
              Restaurant Management
            </Typography>
            <Typography component="h2" variant="h6" align="center" color="text.secondary" gutterBottom>
              Login
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword((show) => !show)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, fontWeight: 700, fontSize: 16 }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login; 