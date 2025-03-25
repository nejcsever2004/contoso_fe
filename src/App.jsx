import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Course from './components/Course.jsx';
import Department from './components/Department.jsx';
import User from './components/User.jsx';
import Grade from './components/Grade.jsx';
import RegisterUser from './components/RegisterUser.jsx';
import LoginUser from './components/LoginUser.jsx';

const App = () => {
    // Store the token from localStorage in a variable
    const authToken = localStorage.getItem('authToken');

    // State to track whether the user is authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);

    // Update the authentication state when localStorage changes
    useEffect(() => {
        // Listen for changes in localStorage (on reload or login)
        const checkAuthToken = localStorage.getItem('authToken');
        setIsAuthenticated(!!checkAuthToken);
    }, [authToken]);

    return (
        <Router>
            <div style={{ padding: '20px' }}>
                <h1>University Management System</h1>
                <nav style={{ marginBottom: '20px' }}>
                    {isAuthenticated ? (
                        <>
                            <Link to="/courses" style={{ marginRight: '15px' }}>Courses</Link>
                            <Link to="/departments" style={{ marginRight: '15px' }}>Departments</Link>
                            <Link to="/users" style={{ marginRight: '15px' }}>Users</Link>
                            <Link to="/grades" style={{ marginRight: '15px' }}>Grades</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register" style={{ marginRight: '15px' }}>Register</Link>
                            <Link to="/login">Login</Link>
                        </>
                    )}
                </nav>

                <Routes>
                    {/* Protected Routes */}
                    {isAuthenticated ? (
                        <>
                            <Route path="/courses" element={<Course />} />
                            <Route path="/departments" element={<Department />} />
                            <Route path="/users" element={<User />} />
                            <Route path="/grades" element={<Grade />} />
                            <Route path="/" element={<h2>Welcome to the Dashboard!</h2>} />
                        </>
                    ) : (
                        <Route path="*" element={<Navigate to="/login" />} />
                    )}

                    {/* Unprotected Routes */}
                    <Route path="/register" element={<RegisterUser />} />
                    <Route path="/login" element={<LoginUser setIsAuthenticated={setIsAuthenticated} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
