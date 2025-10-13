import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ApartmentList from './pages/ApartmentList';
import ApartmentDetail from './pages/ApartmentDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Header user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<ApartmentList />} />
        <Route path="/listings/:id" element={<ApartmentDetail />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;