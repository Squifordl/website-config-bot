import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-header">Bem-vindo ao SuperBot!</h1>
      <p className="home-description">
        O SuperBot é um bot incrível para o Discord que pode fazer todo tipo de coisas
        legais, como moderar o seu servidor, tocar músicas e até mesmo contar piadas!
      </p>
      <div className="button-container">
        <button className="btn" onClick={() => navigate('/login')}>Login</button>
        <button className="btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
      </div>
    </div>
  );
}

export default HomePage;
