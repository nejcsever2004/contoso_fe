import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Department = () => {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState({ departmentName: '' });
    const [editingDepartment, setEditingDepartment] = useState(null);

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

    const handleAddOrEditDepartment = async (e) => {
        e.preventDefault();
        try {
            if (editingDepartment) {
                // Update existing department
                await axios.put(`https://localhost:7062/api/departments/${editingDepartment.departmentID}`, {
                    departmentID: editingDepartment.departmentID,
                    departmentName: newDepartment.departmentName
                });
                setEditingDepartment(null);
            } else {
                // Create new department
                await axios.post('https://localhost:7062/api/departments', newDepartment);
            }
            fetchDepartments();
            setNewDepartment({ departmentName: '' });
        } catch (error) {
            console.error('Error adding/updating department:', error);
        }
    };

    const handleEditDepartment = (department) => {
        setEditingDepartment(department);
        setNewDepartment({ departmentName: department.departmentName });
    };

    const handleDeleteDepartment = async (id) => {
        try {
            await axios.delete(`https://localhost:7062/api/departments/${id}`);
            fetchDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
        }
    };

    return (
        <div>
            <h2>Departments</h2>
            <ul>
                {departments.map((department) => (
                    <li key={department.departmentID}>
                        {department.departmentName}
                        <button onClick={() => handleEditDepartment(department)}>Edit</button>
                        <button onClick={() => handleDeleteDepartment(department.departmentID)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>{editingDepartment ? 'Edit Department' : 'Add Department'}</h3>
            <form onSubmit={handleAddOrEditDepartment}>
                <input
                    type="text"
                    placeholder="Department Name"
                    value={newDepartment.departmentName}
                    onChange={(e) => setNewDepartment({ ...newDepartment, departmentName: e.target.value })}
                    required
                />
                <button type="submit">{editingDepartment ? 'Update' : 'Add'}</button>
                {editingDepartment && <button onClick={() => setEditingDepartment(null)}>Cancel</button>}
            </form>
        </div>
    );
};

export default Department;
