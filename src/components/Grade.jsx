import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Grade = () => {
    const [grades, setGrades] = useState([]);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [newGrade, setNewGrade] = useState({ gradeValue: '', studentId: '', courseId: '' });
    const [editingGrade, setEditingGrade] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [gradesResponse, studentsResponse, coursesResponse] = await Promise.all([
                axios.get('https://localhost:7062/api/grades'),
                axios.get('https://localhost:7062/api/users?role=Student'),
                axios.get('https://localhost:7062/api/courses')
            ]);

            const studentsMap = Object.fromEntries(studentsResponse.data.map(s => [s.userID, s]));
            const coursesMap = Object.fromEntries(coursesResponse.data.map(c => [c.courseID, c]));

            const enrichedGrades = gradesResponse.data.map(grade => ({
                ...grade,
                student: studentsMap[grade.studentID] || null,
                course: coursesMap[grade.courseID] || null
            }));

            setGrades(enrichedGrades);
            setStudents(studentsResponse.data);
            setCourses(coursesResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddGrade = async (e) => {
        e.preventDefault();
        try {
            if (editingGrade) {
                const updatedGrade = {
                    gradeID: editingGrade.gradeID,  // Ensure ID is included
                    gradeValue: newGrade.gradeValue,
                    studentID: newGrade.studentId,
                    courseID: newGrade.courseId
                };

                await axios.put(`https://localhost:7062/api/grades/${editingGrade.gradeID}`, updatedGrade);
                setEditingGrade(null);
            } else {
                await axios.post('https://localhost:7062/api/grades', newGrade);
            }

            fetchData();
            setNewGrade({ gradeValue: '', studentId: '', courseId: '' });
        } catch (error) {
            console.error('Error adding/updating grade:', error.response ? error.response.data : error);
        }
    };

    const handleEditGrade = (grade) => {
        setEditingGrade(grade);
        setNewGrade({ gradeValue: grade.gradeValue, studentId: grade.studentID, courseId: grade.courseID });
    };

    const handleDeleteGrade = async (id) => {
        try {
            await axios.delete(`https://localhost:7062/api/grades/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting grade:', error);
        }
    };

    return (
        <div>
            <h2>Grades</h2>
            <ul>
                {grades.length > 0 ? (
                    grades.map((grade) => (
                        <li key={grade.gradeID}>
                            {grade.gradeValue} -
                            Course: {grade.course ? grade.course.title : 'No Course'} -
                            Student: {grade.student ? grade.student.fullName : 'No Student'}
                            <button onClick={() => handleEditGrade(grade)}>Edit</button>
                            <button onClick={() => handleDeleteGrade(grade.gradeID)}>Delete</button>
                        </li>
                    ))
                ) : (
                    <li>No grades available</li>
                )}
            </ul>

            <h3>{editingGrade ? 'Edit Grade' : 'Add Grade'}</h3>
            <form onSubmit={handleAddGrade}>
                <input
                    type="number"
                    placeholder="Grade Value"
                    value={newGrade.gradeValue}
                    onChange={(e) => setNewGrade({ ...newGrade, gradeValue: e.target.value })}
                    required
                />

                <select
                    value={newGrade.studentId}
                    onChange={(e) => setNewGrade({ ...newGrade, studentId: e.target.value })}
                    required
                >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                        <option key={student.userID} value={student.userID}>
                            {student.fullName}
                        </option>
                    ))}
                </select>

                <select
                    value={newGrade.courseId}
                    onChange={(e) => setNewGrade({ ...newGrade, courseId: e.target.value })}
                    required
                >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                        <option key={course.courseID} value={course.courseID}>
                            {course.title}
                        </option>
                    ))}
                </select>

                <button type="submit">{editingGrade ? 'Update Grade' : 'Add Grade'}</button>
            </form>
        </div>
    );
};

export default Grade;
