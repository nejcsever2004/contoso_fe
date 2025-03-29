# Contoso University Frontend

## Overview

The **Contoso University Frontend** is a React-based web application that provides a user-friendly interface for students to manage their academic records. It interacts with the **Contoso University Backend**, allowing users to register, log in, view their schedules, check grades, and manage their courses. 

This project follows **modern web development practices**, integrating **React Router, Context API/Redux**, and **JWT authentication** to deliver a **secure and efficient user experience**.

---

## Technologies Used

- **Programming Language**: JavaScript (ES6+)
- **Framework**: React (with Vite/Webpack)
- **State Management**: React Context API / Redux (if used)
- **Routing**: React Router
- **Authentication**: JWT (JSON Web Token)
- **Package Manager**: npm / yarn
- **HTTP Client**: Axios / Fetch API
- **CSS Framework**: Tailwind CSS / Bootstrap (if used)
- **IDE**: Visual Studio Code

---

## Project Structure

The project follows a **structured directory layout** for maintainability and scalability.


---

## Components and Pages

### **Login Page**
**Path:** `/login`

#### **Description**:
- Allows users to **authenticate** using email and password.
- **Stores JWT tokens** in `localStorage` or `sessionStorage`.

#### **Features**:
✅ Email and password input fields.  
✅ "Remember Me" option for persistent login.  
✅ API call to backend authentication endpoint.  
✅ Displays error messages for failed logins.  
✅ Redirects to dashboard after successful login.

---

### **Registration Page**
**Path:** `/register`

#### **Description**:
- Enables new users to create an account.

#### **Features**:
✅ Form validation for required fields.  
✅ Password strength validation.  
✅ Password confirmation logic.  
✅ API call to backend for user registration.  
✅ Redirects user upon successful registration.

---

### **Dashboard**
**Path:** `/dashboard`

#### **Description**:
- Main interface where students view their academic details.

#### **Features**:
✅ Fetches student data from backend API.  
✅ Displays **enrolled courses, schedules, and grades**.  
✅ Navigation menu for switching sections.  
✅ Logout functionality.

---

### **Grades Page**
**Path:** `/grades`

#### **Description**:
- Displays the **student's grades** for completed courses.

#### **Features**:
✅ API call to fetch student's grades.  
✅ Table-based grade display.  
✅ Color-coded grade status (Pass/Fail).  

---

### **Schedule Page**
**Path:** `/schedule`

#### **Description**:
- Shows the **student's class schedule**.

#### **Features**:
✅ API call to retrieve the class schedule.  
✅ Calendar-like view for classes.  

---

## API Integration

The **services** directory contains **modular API call functions** to interact with the backend.

### **authService.js**
Handles authentication-related API requests.

#### **Methods**:
```js
const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    return response.data;
};

const register = async (userData) => {
    const response = await axios.post('/api/auth/register', userData);
    return response.data;
};
