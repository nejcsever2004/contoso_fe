import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
    const [currentUser, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profileDocument, setProfileDocument] = useState(localStorage.getItem('profileDocument') || '');

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchData();
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

    const fetchData = async () => {
        try {
            const [gradesResponse, coursesResponse] = await Promise.all([
                axios.get(`https://localhost:7062/api/grades?studentId=${currentUser.userID}`, { headers: getHeaders() }),
                axios.get('https://localhost:7062/api/courses', { headers: getHeaders() })
            ]);

            const userGrades = gradesResponse.data;
            const enrolledCourseIds = new Set(userGrades.map(grade => grade.courseID));

            const enrolledCourses = coursesResponse.data.filter(course => enrolledCourseIds.has(course.courseID));

            setGrades(userGrades);
            setCourses(enrolledCourses);
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
                            {profileDocument.endsWith('.pdf') ? (
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

            <h2>Your Enrolled Courses</h2>
            <ul>
                {courses.length > 0 ? (
                    courses.map(course => (
                        <li key={course.courseID}>
                            <strong>{course.title}</strong> - Instructor: {course.teacher?.fullName || 'Not Assigned'}
                        </li>
                    ))
                ) : (
                    <li>You are not enrolled in any courses.</li>
                )}
            </ul>

            <h2>Your Grades</h2>
            <ul>
                {grades.length > 0 ? (
                    grades.map(grade => (
                        <li key={grade.gradeID}>
                            {grade.gradeValue} - Course: {courses.find(c => c.courseID === grade.courseID)?.title || 'Not Available'}
                        </li>
                    ))
                ) : (
                    <li>No grades available</li>
                )}
            </ul>
        </div>
    );
};

export default StudentDashboard;
