import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { loginUser } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
      const user = response.data.user || response.data;
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'kitchen') {
        navigate('/kitchen');
      } else if (user.role === 'server' || user.role === 'waiter') {
        navigate('/waiter-panel');
      } else {
        setError('Yetkisiz kullanıcı!');
      }
    } catch (err) {
      setError('Kullanıcı adı veya şifre hatalı!');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, minWidth: 350 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Personel Girişi
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="E-posta"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Şifre"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontWeight: 'bold', fontSize: 16 }}
            >
              Giriş Yap
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage; 