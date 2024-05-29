import React from 'react';
import { useNavigate } from 'react-router-dom';

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
            <h1>SocialMota</h1>
            <div className="buttons">
                <button onClick={handleLogin}>Iniciar sesión</button>
                <button onClick={handleRegister}>Crear usuario</button>
            </div>
        </div>
    );
};

export default Home;
