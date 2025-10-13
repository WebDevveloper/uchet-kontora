import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Компонент для кнопки "следующий слайд"
function NextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: '50%',
        padding: '8px',
        zIndex: 2,
        cursor: 'pointer',
      }}
    >
      <ArrowForwardIosIcon style={{ color: 'white' }} />
    </div>
  );
}

// Компонент для кнопки "предыдущий слайд"
function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        left: '10px',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: '50%',
        padding: '8px',
        zIndex: 2,
        cursor: 'pointer',
      }}
    >
      <ArrowBackIosNewIcon style={{ color: 'white' }} />
    </div>
  );
}

function ApartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchListing = async () => {
    try {
      const response = await fetch(`http://localhost:5000/listings/${id}`);
      const data = await response.json();
      console.log('Данные квартиры:', data);
      setListing(data);
    } catch (error) {
      console.error('Ошибка при получении объявления:', error);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  // После загрузки объявления проверяем, находится ли оно в избранном
  useEffect(() => {
    if (listing) {
      const checkFavorite = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
          const response = await fetch(
            `http://localhost:5000/favorites/check?listing_id=${listing.listing_id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        } catch (error) {
          console.error('Ошибка при проверке избранного:', error);
        }
      };
      checkFavorite();
    }
  }, [listing]);

  const sliderSettings = {
    dots: true, // Показ точек навигации
    infinite: true, // Бесконечная прокрутка
    speed: 500, // Скорость анимации в мс
    slidesToShow: 1, // Показывается один слайд за раз
    slidesToScroll: 1, // Прокрутка по одному слайду
    autoplay: true, // Автоматическая прокрутка
    autoplaySpeed: 3000, // Интервал автопрокрутки: 3 сек.
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  // Обработчик переключения избранного
  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Войдите в аккаунт для добавления в избранное.');
      navigate('/login');
      return;
    }
    try {
      if (!isFavorite) {
        // Добавление в избранное
        const response = await fetch('http://localhost:5000/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ listing_id: listing.listing_id }),
        });
        if (response.ok) {
          setIsFavorite(true);
        } else {
          alert('Не удалось добавить в избранное');
        }
      } else {
        // Удаление из избранного
        const response = await fetch(
          `http://localhost:5000/favorites?listing_id=${listing.listing_id}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          setIsFavorite(false);
        } else {
          alert('Не удалось удалить из избранного');
        }
      }
    } catch (error) {
      console.error('Ошибка при изменении избранного:', error);
      alert('Ошибка при изменении избранного');
    }
  };

  if (!listing) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} style={{ position: 'relative' }}>
          {listing.images && listing.images.length > 0 ? (
            <Slider {...sliderSettings}>
              {listing.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Квартира ${index + 1}`}
                    style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                    onError={() => console.log('Ошибка загрузки изображения:', image)}
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <Typography>Изображения отсутствуют</Typography>
          )}
          {/* Иконка избранного */}
          <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
            <IconButton onClick={toggleFavorite}>
              {isFavorite ? (
                <FavoriteIcon color="error" fontSize="large" />
              ) : (
                <FavoriteBorderIcon fontSize="large" />
              )}
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom>
                {listing.address}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                {listing.price} ₽
              </Typography>
              <Typography variant="body1" paragraph>
                {listing.description || 'Описание отсутствует'}
              </Typography>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Адрес:</strong> {listing.address}
                </Typography>
                <Typography variant="body2">
                  <strong>Спальни:</strong> {listing.bedrooms}
                </Typography>
                <Typography variant="body2">
                  <strong>Ванные:</strong> {listing.bathrooms}
                </Typography>
                <Typography variant="body2">
                  <strong>Площадь:</strong> {listing.square_footage} м²
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="h6">Контактная информация агента</Typography>
            <Typography variant="body2">
              <strong>Имя:</strong> {listing.agent_name}
            </Typography>
            <Typography variant="body2">
              <strong>Телефон:</strong> {listing.agent_phone}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {listing.agent_email}
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              Связаться с агентом
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ApartmentDetail;
