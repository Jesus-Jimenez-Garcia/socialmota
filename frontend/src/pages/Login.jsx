import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });
            if (response.ok) {
                const data = await response.json();
                // Guardar el token y redirigir al usuario a la página de posts
                localStorage.setItem('token', data.token);
                navigate('/posts');
            } else {
                const errorData = await response.json();
                setError(errorData.mensaje || 'Error al iniciar sesión');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre de Usuario:</label>
                    <input type="text" name="username" value={form.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;
