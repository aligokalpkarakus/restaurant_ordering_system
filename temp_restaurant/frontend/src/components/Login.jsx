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
  IconButton,
  Paper
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { Restaurant } from '@mui/icons-material';

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
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)',
        py: 4
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              py: 4,
              px: 3,
              textAlign: 'center'
            }}
          >
            <Restaurant sx={{ fontSize: 48, color: 'white', mb: 2 }} />
            <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700 }}>
              Restaurant Management
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)', mt: 1 }}>
              Staff Login Portal
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: 'error.main'
                  }
                }}
              >
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
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
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.3)',
                  },
                }}
              >
                {loading ? 'Logging in...' : 'Sign In'}
              </Button>
            </Box>
          </CardContent>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 