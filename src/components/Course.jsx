import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Course = () => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ courseName: '', departmentId: '', teacherId: '' });
    const [editingCourse, setEditingCourse] = useState(null);  // Track the course being edited

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('https://localhost:7062/api/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();

        // Validate the form input before making the API request
        if (!newCourse.courseName || !newCourse.departmentId || !newCourse.teacherId) {
            console.error('All fields must be filled out');
            return; // Don't proceed if any field is missing
        }

        try {
            // Make the POST request to add the course
            const response = await axios.post('https://localhost:7062/api/courses', {
                Title: newCourse.courseName,  // Change "courseTitle" to "Title"
                departmentID: newCourse.departmentId,
                teacherID: newCourse.teacherId,
            });

            // Handle successful response
            console.log('Course added successfully:', response.data);

            // Refresh the course list after adding
            fetchCourses();

            // Reset the form fields
            setNewCourse({ courseName: '', departmentId: '', teacherId: '' });
        } catch (error) {
            // Handle error during the request
            if (error.response) {
                // If the server responded with an error
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                // If no response was received
                console.error('No response received:', error.request);
            } else {
                // Any other error
                console.error('Error setting up request:', error.message);
            }
        }
    };

    const handleEditCourse = (course) => {
        // Set the editing course to populate the form with its data
        setEditingCourse(course);
        setNewCourse({
            courseName: course.title,
            departmentId: course.departmentID,
            teacherId: course.teacherID,
        });
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();

        // Check if the required fields are filled out
        if (!newCourse.courseName || !newCourse.departmentId || !newCourse.teacherId) {
            console.error('All fields must be filled out');
            return; // Don't proceed if any field is missing
        }


        try {
            const response = await axios.put(`https://localhost:7062/api/courses/${editingCourse.courseID}`, {
                CourseID: editingCourse.courseID,  // Ensure CourseID is included
                Title: newCourse.courseName,
                departmentID: newCourse.departmentId,
                teacherID: newCourse.teacherId,
            });

            console.log('Course updated successfully:', response.data);

            // Refresh course list
            fetchCourses();

            // Clear editing state and reset form
            setEditingCourse(null);
            setNewCourse({ courseName: '', departmentId: '', teacherId: '' });

            // Optional: Show success message
            console.log('Course saved successfully!');
        } catch (error) {
            console.error('Error saving course:', error);

            // Optional: Handle error response and show appropriate message
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
        } 
    };

    const handleDeleteCourse = async (id) => {
        try {
            await axios.delete(`https://localhost:7062/api/courses/${id}`);
            fetchCourses(); // Refresh the course list after deletion
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
                <input
                    type="text"
                    placeholder="Department ID"
                    value={newCourse.departmentId}
                    onChange={(e) => setNewCourse({ ...newCourse, departmentId: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Teacher ID"
                    value={newCourse.teacherId}
                    onChange={(e) => setNewCourse({ ...newCourse, teacherId: e.target.value })}
                />
                <button type="submit">{editingCourse ? 'Save Changes' : 'Add'}</button>
            </form>
        </div>
    );
};

export default Course;
