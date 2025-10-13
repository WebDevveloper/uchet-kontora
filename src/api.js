const API_URL = 'http://localhost:3000'; // Базовый URL сервера

// Получение списка квартир
export const getListings = async () => {
  const response = await fetch(`${API_URL}/listings`);
  if (!response.ok) throw new Error('Ошибка при получении объявлений');
  return response.json();
};

// Авторизация пользователя
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Ошибка при входе');
  return response.json();
};

// Добавление нового объявления (для агентов)
export const createListing = async (listingData, token) => {
  const response = await fetch(`${API_URL}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(listingData),
  });
  if (!response.ok) throw new Error('Ошибка при создании объявления');
  return response.json();
};