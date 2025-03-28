import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterUser = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [departmentID, setDepartmentID] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('https://localhost:7062/api/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!fullName || !email || !password || !confirmPassword || !departmentID) {
            setError('Please fill out all required fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const formData = new FormData();
        formData.append('FullName', fullName);
        formData.append('Email', email);
        formData.append('Password', password);
        formData.append('ConfirmPassword', confirmPassword);
        formData.append('Role', role);
        formData.append('DepartmentID', departmentID);
        if (file) formData.append('FileUpload', file);

        try {
            const response = await axios.post('https://localhost:7062/api/userregister/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response ? err.response.data : 'An error occurred during registration.');
        }
    };

    return (
        <div>
            <h2>Register New User</h2>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {message && <div style={{ color: 'green' }}>{message}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                    </select>
                </div>
                <div>
                    <label>Department</label>
                    <select
                        value={departmentID}
                        onChange={(e) => setDepartmentID(e.target.value)}
                    >
                        <option value="">{console.log("Departments Length:", departments.length) || departments.length === 0 ? "Loading Departments..." : "Select Department"}</option>
                        {departments.length > 0 && departments.map(department => (
                            <option key={department.departmentID} value={department.departmentID}>
                                {department.name} ({department.departmentName})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Profile Picture (optional)</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterUser;