// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Posts from './pages/Posts';
import Users from './pages/Users';
import Nav from './components/Nav';
import Chat from './pages/Chat';
import CreatePost from './pages/CreatePost';
import ProfileView from './pages/ProfileView';
import Conversations from './pages/Conversations';  // Importar la nueva vista de conversaciones

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
                <Route path="/change-password" element={<Register isChangePasswordMode={true} />} />
                <Route path="/chat/:contactId" element={<Chat />} />
                <Route path="/followed-users" element={<Users showFollowedOnly={true} />} />
                <Route path="/conversations" element={<Conversations />} /> {/* Nueva ruta */}
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppWrapper />
            </AuthProvider>
        </Router>
    );
};

export default App;
