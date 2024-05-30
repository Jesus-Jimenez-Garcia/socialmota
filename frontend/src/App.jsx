import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import Users from './pages/Users';
import Nav from './components/Nav';
import CreatePost from './pages/CreatePost';
import Profile from './pages/ProfileVew'; // Importar la nueva página Profile

const AppWrapper = () => {
    const location = useLocation();
    const hideNav = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            {!hideNav && <Nav />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/users" element={<Users />} />
                <Route path="/profile" element={<Profile />} /> {/* Nueva ruta para Profile */}
                <Route path="/edit-profile" element={<Register isEditMode={true} />} /> {/* Cambiar ruta de edición */}
                <Route path="/my-posts" element={<Posts filterByUser={true} />} />
                <Route path="/create-post" element={<CreatePost />} />
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
