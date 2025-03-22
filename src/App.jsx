import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Course from "./components/Course.jsx";
import Department from "./components/Department.jsx";
import User from "./components/User.jsx";
import Grade from "./components/Grade.jsx";

const App = () => {
    return (
        <Router>
            <div style={{ padding: '20px' }}>
                <h1>University Management System</h1>
                <nav style={{ marginBottom: '20px' }}>
                    <Link to="/courses" style={{ marginRight: '15px' }}>Courses</Link>
                    <Link to="/departments" style={{ marginRight: '15px' }}>Departments</Link>
                    <Link to="/users" style={{ marginRight: '15px' }}>Users</Link>
                    <Link to="/grades">Grades</Link>
                </nav>

                <Routes>
                    <Route path="/courses" element={<Course />} />
                    <Route path="/departments" element={<Department />} />
                    <Route path="/users" element={<User />} />
                    <Route path="/grades" element={<Grade />} />
                    <Route path="/" element={<h2>Welcome to the University Management System</h2>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
