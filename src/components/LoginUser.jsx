import React, { useState } from 'react';
import axios from 'axios';

const LoginUser = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

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

            if (response.data && response.data.token && response.data.email && response.data.fullName) {
                const { token, email: userEmail, fullName } = response.data;

                // Store the JWT token and user info in localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('username', fullName);
                localStorage.setItem('email', userEmail);

                // Debugging: Check if the values are correctly saved in localStorage
                console.log('Stored data in localStorage:', {
                    authToken: localStorage.getItem('authToken'),
                    username: localStorage.getItem('username'),
                    email: localStorage.getItem('email'),
                });

                // After storing the token, update the authentication state
                setIsAuthenticated(true); // Update the authentication state

                // Optionally, navigate to a different page (e.g., dashboard or courses)
                window.location.href = '/dashboard';
            } else {
                throw new Error('Unexpected response structure.');
            }
        } catch (err) {
            console.error('Error occurred during login:', err);

            // Handle different types of errors
            if (err.response) {
                // If the server responded with an error
                setError(err.response.data?.message || 'Login failed. Please check your credentials.');
            } else if (err.request) {
                // If there was no response from the server
                setError('No response received from the server. Please try again later.');
            } else {
                // If there's an error while setting up the request
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
