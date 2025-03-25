import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logout from './Logout'; // Import the Logout component

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the token exists in localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [navigate]);

    return (
        <div>
            <h1>University Management System</h1>
            <h2>Welcome to the Dashboard!</h2>

            {/* Use the Logout component */}
            <Logout />

            <div>
                <h3>Courses</h3>
                <p>Here you can manage courses.</p>
            </div>
            <div>
                <h3>Departments</h3>
                <p>Here you can manage departments.</p>
            </div>
            <div>
                <h3>Users</h3>
                <p>Here you can manage users.</p>
            </div>
            <div>
                <h3>Grades</h3>
                <p>Here you can manage grades.</p>
            </div>
        </div>
    );
};

export default Dashboard;
