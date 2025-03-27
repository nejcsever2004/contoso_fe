import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';  // Correct import for Route and Routes
import Course from './components/Course.jsx';
import Department from './components/Department.jsx';
import User from './components/User.jsx';
import Grade from './components/Grade.jsx';
import RegisterUser from './components/RegisterUser.jsx';
import LoginUser from './components/LoginUser.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';

const App = () => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('role'); // Retrieve user role

    const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);
    const [role, setRole] = useState(userRole || '');

    useEffect(() => {
        const checkAuthToken = localStorage.getItem('authToken');
        const storedRole = localStorage.getItem('role');
        setIsAuthenticated(!!checkAuthToken);
        setRole(storedRole || '');
    }, [authToken]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        setRole('');
    };

    return (
        <Router>
            <div style={{ padding: '20px' }}>
                <h1>University Management System</h1>

                <nav style={{ marginBottom: '20px' }}>
                    {isAuthenticated ? (
                        <>
                            {role === 'Teacher' && (
                                <>
                                    <Link to="/courses" style={{ marginRight: '15px' }}>Courses</Link>
                                    <Link to="/departments" style={{ marginRight: '15px' }}>Departments</Link>
                                    <Link to="/users" style={{ marginRight: '15px' }}>Users</Link>
                                    <Link to="/grades" style={{ marginRight: '15px' }}>Grades</Link>
                                </>
                            )}
                            {role === 'Student' && (
                                <Link to="/gradesandschedule" style={{ marginRight: '15px' }}>Grades & Schedule</Link>
                            )}
                            <button onClick={handleLogout} style={{ marginLeft: '15px' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" style={{ marginRight: '15px' }}>Register</Link>
                            <Link to="/login">Login</Link>
                        </>
                    )}
                </nav>

                <Routes>
                    {/* Protected routes for authenticated users */}
                    {isAuthenticated ? (
                        <>
                            {role === 'Teacher' && (
                                <>
                                    <Route path="/courses" element={<Course />} />
                                    <Route path="/departments" element={<Department />} />
                                    <Route path="/users" element={<User />} />
                                    <Route path="/grades" element={<Grade />} />
                                    <Route path="*" element={<Navigate to="/courses" />} />
                                </>
                            )}
                            {role === 'Student' && (
                                <>
                                    <Route path="/studentdashboard" element={<StudentDashboard />} /> {/* Route to show courses */}
                                    <Route path="*" element={<Navigate to="/studentdashboard" />} /> {/* Default redirect for students */}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Public routes */}
                            <Route path="/register" element={<RegisterUser />} />
                            <Route path="/login" element={<LoginUser setIsAuthenticated={setIsAuthenticated} />} />
                            <Route path="*" element={<Navigate to="/login" />} />
                        </>
                    )}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
