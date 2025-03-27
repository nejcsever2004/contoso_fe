import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginUser = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');  // Clear any previous errors
        setMessage('');  // Clear any previous success message

        // Validate input
        if (!email || !password) {
            setError('Please fill out all fields.');
            return;
        }

        try {
            const response = await axios.post('https://localhost:7062/api/userlogin/login', {
                Email: email,
                Password: password,
            });

            if (response.data && response.data.token && response.data.email && response.data.fullName && response.data.role) {
                const { token, email: userEmail, fullName, role } = response.data;
                const userID = response.data.userID || null; // Check if userID is present, otherwise set it to null

                // Store the JWT token, user info, and role in localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('username', fullName);
                localStorage.setItem('email', userEmail);
                localStorage.setItem('role', role);
                localStorage.setItem('userID', userID); // Store the userID in localStorage

                // After storing the token, update the authentication state
                setIsAuthenticated(true);

                // Redirect based on role
                if (role === 'Student') {
                    console.log('Student Email:', userEmail);
                    console.log('Student Token:', token);
                    console.log('Student ID:', userID);
                    navigate('/studentdashboard');
                } else if (role === 'Teacher') {
                    console.log('Teacher Email:', userEmail);
                    console.log('Teacher Token:', token);
                    console.log('Teacher ID:', userID);
                    navigate('/courses');
                }
            } else {
                throw new Error('Unexpected response structure.');
            }
        } catch (err) {
            console.error('Error occurred during login:', err);

            // Handle different types of errors
            if (err.response) {
                setError(err.response.data?.message || 'Login failed. Please check your credentials.');
            } else if (err.request) {
                setError('No response received from the server. Please try again later.');
            } else {
                setError(`Error: ${err.message}`);
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {message && <div style={{ color: 'green' }}>{message}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginUser;