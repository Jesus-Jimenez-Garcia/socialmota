// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';

const Home = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="home-container">
            <Header />
            <div className="buttons">
                <button onClick={handleLogin}>Iniciar sesión</button>
                <button onClick={handleRegister}>Crear usuario</button>
            </div>
        </div>
    );
};

export default Home;
