import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

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
            <div className="background-container">
                <div className="overlay"></div>
                <div className="content">
                    <h1>SocialMota</h1>
                    <h2>La red social de tu pueblo</h2>
                    <div className="buttons">
                        <button className="btn login" onClick={handleLogin}>Iniciar sesión</button>
                        <button className="btn register" onClick={handleRegister}>Crear usuario</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
