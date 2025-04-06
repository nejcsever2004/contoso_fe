import React, { useState, useEffect } from 'react';
import axios from 'axios';

const User = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'Student',
        DepartmentID: '',
        profileDocument: null
    });
    const [editingUserID, setEditingUserID] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
        getCurrentUser();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:7062/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('https://localhost:7062/api/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const getCurrentUser = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            const response = await axios.get("https://localhost:7062/api/userregister/current", {
                headers: { "Authorization": `Bearer ${token}` },
            });

            setCurrentUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        if (!newUser.profileDocument) {
            alert('Please upload a profile document');
            return;
        }

        const formData = new FormData();
        formData.append('fullName', newUser.fullName);
        formData.append('email', newUser.email);
        if (newUser.password) formData.append('password', newUser.password); // Only send password if provided
        formData.append('role', newUser.role);
        formData.append('DepartmentID', newUser.DepartmentID ? parseInt(newUser.DepartmentID) : null);
        if (editingUserID) formData.append('UserID', editingUserID);
        formData.append('profileDocument', newUser.profileDocument);

        try {
            let response;
            if (editingUserID) {
                response = await axios.put(`https://localhost:7062/api/users/${editingUserID}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                response = await axios.post('https://localhost:7062/api/users', formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }

            console.log("✅ User processed successfully:", response.data);
            fetchUsers();
            resetForm();
        } catch (error) {
            handleError(error);
        }
    };

    const handleDeleteUser = async (userID) => {
        try {
            await axios.delete(`https://localhost:7062/api/users/${userID}`);
            fetchUsers();
        } catch (error) {
            handleError(error);
        }
    };

    const handleEditUser = (user) => {
        setNewUser({
            fullName: user.fullName,
            email: user.email,
            password: '',
            role: user.role,
            DepartmentID: user.DepartmentID || '',
            profileDocument: null, // Prevent overwriting existing profile image
        });
        setEditingUserID(user.userID);
    };

    const resetForm = () => {
        setNewUser({
            fullName: '',
            email: '',
            password: '',
            role: 'Student',
            DepartmentID: '',
            profileDocument: null
        });
        setEditingUserID(null);
    };

    const handleError = (error) => {
        if (error.response) {
            console.error("🚨 Response Error:", error.response.data);
            alert(`Error: ${error.response.data.title || error.response.data.detail || error.response.data}`);
        } else if (error.request) {
            console.error("🚨 No response received:", error.request);
            alert("Error: No response received from the server.");
        } else {
            console.error("🚨 Error:", error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Users</h2>
            {currentUser ? (
                <div>
                    <h3>Logged In As: {currentUser.fullName} - {currentUser.role}</h3>
                    {currentUser.profileDocument && (
                        <img src={currentUser.profileDocument} alt="Profile" width="100" />
                    )}
                </div>
            ) : (
                <p>Please log in to view user details.</p>
            )}

            <ul>
                {users.map(user => (
                    <li key={user.userID}>
                        {user.fullName} - {user.email} - {user.role} - {user.department?.departmentName || "No Department"}
                        <button onClick={() => handleEditUser(user)}>Edit</button>
                        <button onClick={() => handleDeleteUser(user.userID)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>{editingUserID ? "Edit User" : "Add User"}</h3>
            <form onSubmit={handleAddUser}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
                <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    required
                >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                </select>
                <select
                    value={newUser.DepartmentID}
                    onChange={(e) => setNewUser({ ...newUser, DepartmentID: e.target.value })}
                >
                    <option value="">No Department</option>
                    {departments.map(dep => (
                        <option key={dep.departmentID} value={dep.departmentID}>
                            {dep.departmentName}
                        </option>
                    ))}
                </select>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewUser({ ...newUser, profileDocument: e.target.files[0] })}
                />
                <button type="submit">{editingUserID ? "Update User" : "Add User"}</button>
            </form>
        </div>
    );
};

export default User;
