import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Box
} from '@mui/material';

function ApartmentList() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    rooms: '',
  });
  const [page, setPage] = useState(1);
  const listingsPerPage = 9;

  const fetchListings = async () => {
    try {
      const response = await fetch('http://localhost:5000/listings');
      const data = await response.json();
      console.log('Данные с сервера:', data);
      setListings(data);
    } catch (error) {
      console.error('Ошибка при получении объявлений:', error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1); // Сброс пагинации при изменении фильтров
  };

  const filteredListings = listings.filter((listing) => {
    const price = parseFloat(listing.price);
    const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : 0;
    const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
    const bedrooms = filters.rooms ? parseInt(filters.rooms) : null;
    
    return (
      price >= minPrice &&
      price <= maxPrice &&
      (bedrooms ? listing.bedrooms === bedrooms : true)
    );
  });

  const paginatedListings = filteredListings.slice(
    (page - 1) * listingsPerPage,
    page * listingsPerPage
  );

  return (
    <Container maxWidth="lg">
      {/* Фильтры */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Минимальная цена"
              variant="outlined"
              fullWidth
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Максимальная цена"
              variant="outlined"
              fullWidth
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Количество комнат</InputLabel>
              <Select
                name="rooms"
                value={filters.rooms}
                onChange={handleFilterChange}
                label="Количество комнат"
              >
                <MenuItem value="">Все</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Список квартир */}
      <Grid container spacing={4}>
  {listings.map((listing) => (
    <Grid item key={listing.listing_id} xs={12} sm={6} md={4}>
      <Card>
        <CardMedia
          sx={{ pt: '56.25%' }}
          image={listing.images[0] || 'https://via.placeholder.com/400x225'}
          title={listing.address}
        />
        <CardContent>
          <Typography variant="h6">{listing.address}</Typography>
          <Typography>
            {listing.bedrooms} спальни, {listing.bathrooms} ванные, {listing.square_footage} м²
          </Typography>
          <Typography>{listing.price} ₽</Typography>
        </CardContent>
        <Button href={`/listings/${listing.listing_id}`}>Подробнее</Button>
      </Card>
    </Grid>
  ))}
</Grid>

      {/* Пагинация */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(filteredListings.length / listingsPerPage)}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
}

export default ApartmentList;