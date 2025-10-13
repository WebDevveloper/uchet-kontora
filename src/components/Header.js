import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [user, setUser] = useState(null); // Состояние пользователя
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Проверка токена при загрузке
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token }); // Предполагаем, что пользователь авторизован
    }
  }, []);

  // Функция выхода
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <nav className="nav">
      <div className="burger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
      </div>
      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/">Главная</Link>
        <Link to="/listings">Квартиры</Link>
        {user ? (
          <>
            <Link to="/profile">Личный кабинет</Link>
            <button onClick={logout}>Выход</button>
          </>
        ) : (
          <>
            <Link to="/login">Вход</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;