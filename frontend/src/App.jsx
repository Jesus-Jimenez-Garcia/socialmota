import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Posts from './pages/Posts';
import Users from './pages/Users';
import Nav from './components/Nav';
import CreatePost from './pages/CreatePost';
import ProfileView from './pages/ProfileView';  // Importar la nueva vista de perfil

const AppWrapper = () => {
    const location = useLocation();
    const hideNav = location.pathname === '/' || location.pathname === '/register' || location.pathname === '/login';

    return (
        <>
            {!hideNav && <Nav />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Register isLoginMode={true} />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/users" element={<Users />} />
                <Route path="/profile" element={<ProfileView />} />
                <Route path="/my-posts" element={<Posts filterByUser={true} />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/edit-profile" element={<Register isEditMode={true} />} />
                <Route path="/change-password" element={<Register isChangePasswordMode={true} />} /> {/* Añadir ruta para cambiar contraseña */}
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppWrapper />
        </Router>
    );
};

export default App;
