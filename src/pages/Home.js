import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  Box
} from '@mui/material';

function Home() {
  const [featuredListings, setFeaturedListings] = useState([]);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const response = await fetch('http://localhost:5000/listings');
        const data = await response.json();
        setFeaturedListings(data);
      } catch (error) {
        console.error('Ошибка при получении листингов:', error);
      }
    };
    fetchFeaturedListings();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 8,
        textAlign: 'center',
        borderRadius: 4,
        mb: 6,
        boxShadow: 3,
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://source.unsplash.com/random/1920x600/?apartment)',
        backgroundSize: 'cover',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
          Найди свой идеальный дом
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, maxWidth: '800px' }}>
          Профессиональный подбор квартир с гарантией безопасности сделки
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large" 
          href="/listings"
          sx={{ px: 6, py: 2, fontSize: '1.2rem' }}
        >
          Начать поиск
        </Button>
      </Box>

      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        Новые предложения
      </Typography>
      
      <Grid container spacing={4}>
        {featuredListings.map((listing) => (
          <Grid item key={listing.listing_id} xs={12} sm={6} md={4}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.05)' }
            }}>
              <CardMedia
                sx={{ pt: '56.25%' }}
                image={listing.images[0] || 'https://via.placeholder.com/400x225?text=Нет+изображения'}
                title={listing.address}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3">
                  {listing.address}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {listing.bedrooms} спальни, {listing.bathrooms} ванные, {listing.square_footage} м²
                </Typography>
                <Typography variant="h6" color="primary">
                  {listing.price} ₽
                </Typography>
              </CardContent>
              <Button
                variant="outlined"
                color="primary"
                href={`/listings/${listing.listing_id}`}
                sx={{ m: '0 16px 16px' }}
              >
                Подробнее
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 5, mb: 3 }}>
        <Button variant="contained" color="primary" href="/listings">
          Посмотреть все объявления
        </Button>
      </Box>
    </Container>
  );
}

export default Home;