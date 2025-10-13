import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Edit, Save } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';

function Profile() {
  const [user, setUser] = useState({ user_id: '', name: '', email: '', phone: '' });
  const [favorites, setFavorites] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  // Получение данных профиля пользователя
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Ошибка при получении данных профиля:', error);
    }
  };

  // Получение избранных объявлений
  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/favorites', {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
      
      if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
      
      const data = await response.json();
      setFavorites(data.map(item => ({
        ...item,
        title: `Квартира №${item.listing_id}`,
        image: item.image || 'https://via.placeholder.com/400x225',
        price: item.price.toLocaleString('ru-RU') + ' ₽'
      })));
    } catch (error) {
      console.error('Ошибка:', error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchFavorites();
  }, []);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/users/${user.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      alert('Профиль обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ p: 4 }}>
       <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar sx={{ 
          width: 56, 
          height: 56, 
          bgcolor: 'primary.main', 
          backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #4dabf5 90%)',
          fontSize: '1.5rem',
          mr: 2
        }}>
          {user.name[0]}
        </Avatar>
        <Typography variant="h4">Личный кабинет</Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
            <IconButton
              sx={{ position: 'absolute', top: 16, right: 16 }}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? <Save color="primary" /> : <Edit />}
            </IconButton>

            {editMode ? (
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                <TextField
                  label="Имя"
                  fullWidth
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Email"
                  fullWidth
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Телефон"
                  fullWidth
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                />
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>{user.name}</Typography>
                <Typography sx={{ mb: 1 }}>Email: {user.email}</Typography>
                <Typography>Телефон: {user.phone}</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Правая колонка – избранное */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Избранные квартиры
            </Typography>
            {favorites.length === 0 ? (
              <Typography sx={{ mt: 2 }}>Избранных квартир пока нет.</Typography>
            ) : (
              <Grid container spacing={4}>
                {favorites.map((favorite) => (
                  <Grid item key={favorite.favorite_id} xs={12} sm={6} md={4}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{ height: 200, objectFit: 'cover' }}
                        image={favorite.image}
                        title={favorite.title}
                      />
                      <CardContent>
                        <Typography variant="h6">{favorite.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {favorite.description}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {favorite.price} ₽
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;
