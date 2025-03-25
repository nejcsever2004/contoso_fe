import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear stored user data
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('password');

        // Redirect to the login page
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} style={{ padding: '10px', margin: '10px', cursor: 'pointer' }}>
            Logout
        </button>
    );
};

export default Logout;
