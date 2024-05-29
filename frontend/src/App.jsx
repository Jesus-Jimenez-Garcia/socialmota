import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import Users from './pages/Users';
import Nav from './components/Nav';

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
