// src/components/AuthGuard.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        // Si no hay token en el almacenamiento local, redirigir al usuario a la página de inicio
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    // Renderiza los hijos del componente AuthGuard si el usuario está autenticado
    return children;
};

export default AuthGuard;
