import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
    const [currentUser, setUser] = useState(null);
    const [courses, setCourses] = useState([]);  // Store courses with grades
    const [grades, setGrades] = useState([]);    // Store grades separately
    const [students, setStudents] = useState([]); // Store students (optional for further data use)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profileDocument, setProfileDocument] = useState(localStorage.getItem('profileDocument') || '');

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchData();  // Fetch grades, students, and courses when the user is available
        }
    }, [currentUser]);

    const getAuthToken = () => localStorage.getItem('authToken');

    const getHeaders = () => {
        const token = getAuthToken();
        return {
            Authorization: `Bearer ${token}`
        };
    };

    const fetchCurrentUser = async () => {
        try {
            const response = await axios.get('https://localhost:7062/api/users/me', { headers: getHeaders() });
            setUser(response.data);
            if (response.data.profileDocument) {
                setProfileDocument(response.data.profileDocument);
                localStorage.setItem('profileDocument', response.data.profileDocument);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
            setError('Error fetching current user: ' + error.message);
        }
    };

    const handleProfileDocumentChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const documentURL = URL.createObjectURL(file);
            setProfileDocument(documentURL);
            localStorage.setItem('profileDocument', documentURL);
        }
    };

    // Modified fetchData function to get grades, students, and courses and enrich them
    const fetchData = async () => {
        try {
            const [gradesResponse, studentsResponse, coursesResponse] = await Promise.all([
                axios.get('https://localhost:7062/api/grades'),
                axios.get('https://localhost:7062/api/users?role=Student'),
                axios.get('https://localhost:7062/api/courses')
            ]);

            // Map students and courses to allow easy lookup
            const studentsMap = Object.fromEntries(studentsResponse.data.map(s => [s.userID, s]));
            const coursesMap = Object.fromEntries(coursesResponse.data.map(c => [c.courseID, c]));

            // Enrich grades with student and course data
            const enrichedGrades = gradesResponse.data.map(grade => ({
                ...grade,
                student: studentsMap[grade.studentID] || null,
                course: coursesMap[grade.courseID] || null
            }));

            // Set the data to the state
            setGrades(enrichedGrades);
            setStudents(studentsResponse.data);
            setCourses(coursesResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Student Dashboard</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {currentUser && (
                <div>
                    <h2>Welcome {currentUser.fullName}</h2>
                    {profileDocument ? (
                        <div>
                            {profileDocument.endsWith('.all') ? (
                                <p>Profile Document: <a href={profileDocument} target="_blank" rel="noopener noreferrer">View Document</a></p>
                            ) : (
                                <img src={profileDocument} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                            )}
                        </div>
                    ) : (
                        <p>No profile document available.</p>
                    )}
                    <input type="file" accept="image/*,application/pdf" onChange={handleProfileDocumentChange} />
                </div>
            )}

            {/* Display all grades */}
            <h2>Grades</h2>
            {grades.length > 0 ? (
                <ul>
                    {grades.map((grade) => (
                        <li key={grade.gradeID}>
                            {grade.gradeValue} -
                            Course: {grade.course ? grade.course.title : 'No Course'} -
                            Student: {grade.student ? grade.student.fullName : 'No Student'}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No grades available</p>
            )}

            {/* Display all courses with their grades */}
            <h2>All Courses</h2>
            {courses.length > 0 ? (
                <ul>
                    {courses.map(course => {
                        // Find the grade for this course, if available
                        const grade = grades.find(g => g.courseID === course.courseID);
                        return (
                            <li key={course.courseID}>
                                <strong>{course.title}</strong> - Instructor: {course.teacher?.fullName || 'Not Assigned'}
                                <br />
                                Grade: {grade ? grade.gradeValue : 'No grade available'}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>You are not enrolled in any courses.</p>
            )}
        </div>
    );
};

export default StudentDashboard;
