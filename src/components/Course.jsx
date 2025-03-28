import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Course = () => {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [newCourse, setNewCourse] = useState({ courseName: '', departmentName: '', teacherId: '' });
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        fetchCourses();
        fetchDepartments();
        console.log("Departments data:", departments); // Add this line
        fetchTeachers();
        console.log("Departments data: ", departments);
    }, [departments.length]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('https://localhost:7062/api/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('https://localhost:7062/api/departments');
            console.log("Departments API Response:", response.data);
            setDepartments(response.data);
            console.log("Departments State:", response.data); // Add this line
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('https://localhost:7062/api/users');
            const filteredTeachers = response.data.filter(user => user.role === 'Teacher');
            setTeachers(filteredTeachers);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();

        if (!newCourse.courseName || !newCourse.departmentName || !newCourse.teacherId) {
            console.error('All fields must be filled out');
            return;
        }

        try {
            await axios.post('https://localhost:7062/api/courses', {
                Title: newCourse.courseName,
                departmentName: newCourse.departmentName,
                teacherID: newCourse.teacherId,
            });
            fetchCourses();
            setNewCourse({ courseName: '', departmentName: '', teacherId: '' });
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    const handleEditCourse = (course) => {
        setEditingCourse(course);
        setNewCourse({
            courseName: course.title,
            departmentName: course.department?.name || '',
            teacherId: course.teacherID,
        });
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!newCourse.courseName || !newCourse.departmentName || !newCourse.teacherId) {
            console.error('All fields must be filled out');
            return;
        }

        try {
            await axios.put(`https://localhost:7062/api/courses/${editingCourse.courseID}`, {
                CourseID: editingCourse.courseID,
                Title: newCourse.courseName,
                departmentName: newCourse.departmentName,
                teacherID: newCourse.teacherId,
            });
            fetchCourses();
            setEditingCourse(null);
            setNewCourse({ courseName: '', departmentName: '', teacherId: '' });
        } catch (error) {
            console.error('Error saving course:', error);
        }
    };

    const handleDeleteCourse = async (id) => {
        try {
            await axios.delete(`https://localhost:7062/api/courses/${id}`);
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    return (
        <div>
            <h2>Courses</h2>
            <ul>
                {courses.map(course => (
                    <li key={course.courseID}>
                        <strong>{course.title}</strong>

                        {course.teacher ? (
                            <span> - Instructor: {course.teacher.fullName}</span>
                        ) : (
                            <span> - Instructor: Not Assigned</span>
                        )}
                        <button onClick={() => handleEditCourse(course)}>Edit</button>
                        <button onClick={() => handleDeleteCourse(course.courseID)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>{editingCourse ? 'Edit Course' : 'Add Course'}</h3>
            <form onSubmit={editingCourse ? handleSaveEdit : handleAddCourse}>
                <input
                    type="text"
                    placeholder="Course Name"
                    value={newCourse.courseName}
                    onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
                />
                <select
                    value={newCourse.departmentName}
                    onChange={(e) => setNewCourse({ ...newCourse, departmentName: e.target.value })}
                >
                    <option value="">{console.log("Departments Length:", departments.length) || departments.length === 0 ? "Loading Departments..." : "Select Department"}</option>
                    {departments.length > 0 && departments.map(department => (
                        <option key={department.departmentID} value={department.name}>
                            {department.name} ({department.departmentName})
                        </option>
                    ))}
                </select>

                <select
                    value={newCourse.teacherId}
                    onChange={(e) => setNewCourse({ ...newCourse, teacherId: e.target.value })}
                >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                        <option key={teacher.userID} value={teacher.userID}>{teacher.fullName}</option>
                    ))}
                </select>
                <button type="submit">{editingCourse ? 'Save Changes' : 'Add'}</button>
            </form>
        </div>
    );
};

export default Course;
