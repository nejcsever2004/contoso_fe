import React, { useState, useEffect } from 'react';
import axios from 'axios';

const User = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'Student',  // Default role
        DepartmentID: '',  // Matches backend model
        profileDocument: null // Changed to null since it will be a file
    });
    const [editingUserID, setEditingUserID] = useState(null); // Track the user being edited
    const [currentUser, setCurrentUser] = useState(null); // To store current logged-in user

    useEffect(() => {
        fetchUsers();
        fetchDepartments();
        getCurrentUser();  // Fetch current logged-in user data
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:7062/api/users');
            setUsers(response.data);  // Ensure the response structure matches your expected model
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('https://localhost:7062/api/departments');
            setDepartments(response.data);  // Ensure the response structure is as expected
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const getCurrentUser = async () => {
        const token = localStorage.getItem("authToken");  // Retrieve the token

        if (!token) {
            console.log("User is not logged in.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7062/api/userregister/current", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,  // Send the token in the Authorization header
                },
            });

            const data = await response.json();

            if (response.ok) {
                setCurrentUser(data);  // Set the current user data
            } else {
                console.error(data.message);  // Error message
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('fullName', newUser.fullName);
        formData.append('email', newUser.email);
        formData.append('password', newUser.password);
        formData.append('role', newUser.role);
        formData.append('DepartmentID', newUser.DepartmentID ? parseInt(newUser.DepartmentID) : null);
        formData.append('UserID', editingUserID ? parseInt(editingUserID) : null);

        // Only append profileDocument if it's a new file
        if (newUser.profileDocument) {
            formData.append('profileDocument', newUser.profileDocument);
        } else {
            console.error('Profile document is required');
            alert('Please upload a profile document');
            return; // Prevent form submission
        }

        try {
            let response;
            if (editingUserID) {
                // If editing, ensure PUT request uses the correct user ID
                response = await axios.put(`https://localhost:7062/api/users/${editingUserID}`, formData);
            } else {
                // If adding, perform a POST request
                response = await axios.post('https://localhost:7062/api/users', formData);
            }

            console.log("✅ User processed successfully:", response.data);

            // Refresh user list after the operation (either add or update)
            fetchUsers(); // This will reload the user list after editing

            // Reset the form fields
            setNewUser({
                fullName: '',
                email: '',
                password: '',
                role: 'Student',
                DepartmentID: '',
                profileDocument: null,
            });
            setEditingUserID(null); // Clear editing state after successful operation
        } catch (error) {
            // Handle errors appropriately
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
        }
    };

    const handleDeleteUser = async (userID) => {
        try {
            const response = await axios.delete(`https://localhost:7062/api/users/${userID}`);
            console.log("✅ User deleted successfully:", response.data);
            fetchUsers(); // Refresh user list after deletion
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const handleEditUser = (user) => {
        setNewUser({
            fullName: user.fullName,
            email: user.email,
            password: '', // Don't pre-fill password for security
            role: user.role,
            DepartmentID: user.DepartmentID,
            profileDocument: user.profileDocument, // Retain the existing profile document (if available)
        });
        console.log("Editing: ", user.userID);
        setEditingUserID(user.userID); // Ensure the correct user ID is set
    };

    return (
        <div>
            <h2>Users</h2>
            {currentUser ? (
                <div>
                    <h3>Logged In As: {currentUser.fullName} - {currentUser.role}</h3>
                    <img src={currentUser.profileDocument} alt="Profile" />
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
                    required
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
