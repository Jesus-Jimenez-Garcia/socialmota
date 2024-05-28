import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
        profile_picture: '',
        name: '',
        description: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
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
                setSuccess('Registro exitoso');
                setTimeout(() => {
                    navigate('/posts');
                }, 2000);
            } else {
                const errorData = await response.json();
                setError(errorData.mensaje || 'Error al registrar el usuario');
            }
        } catch (error) {
            setError('Error: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Crear Usuario</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre de Usuario:</label>
                    <input type="text" name="username" value={form.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>Contraseña:</label>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Foto de Perfil (URL):</label>
                    <input type="text" name="profile_picture" value={form.profile_picture} onChange={handleChange} />
                </div>
                <div>
                    <label>Nombre:</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} />
                </div>
                <div>
                    <label>Descripción:</label>
                    <textarea name="description" value={form.description} onChange={handleChange}></textarea>
                </div>
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
};

export default Register;
