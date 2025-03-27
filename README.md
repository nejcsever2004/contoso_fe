# Contoso University Frontend Documentation

## Overview

This document provides an in-depth overview of the Contoso University Frontend project, detailing the technologies utilized, the structure of the project, and comprehensive explanations of its components.

## Technologies Used

- **Programming Language**: JavaScript
- **Framework**: ASP.NET React
- **State Management**: React Context API / Redux (if used)
- **Package Manager**: npm / yarn
- **IDE**: Visual Studio Code

## Project Structure

The solution comprises several key directories:

- **src/components**: Contains reusable React components.
- **src/pages**: Holds the main application pages.
- **src/services**: Includes API call functions.
- **src/context**: Manages global state.
- **public**: Stores static assets such as images and the main `index.html` file.
- **node_modules**: Contains project dependencies.

## Components and Pages

### Login Page
- **Description**: Allows users to enter credentials and authenticate.
- **Key Features**:
  - Inputs for email and password.
  - API call to backend authentication endpoint.
  - Redirects user upon successful login.

### Registration Page
- **Description**: Enables new users to create an account.
- **Key Features**:
  - Form validation for required fields.
  - Password confirmation logic.
  - API call to register a new user.

### Dashboard
- **Description**: Main user interface displaying courses, schedules, and grades.
- **Key Features**:
  - Fetches and displays user-specific data from the backend.
  - Navigation menu for different sections.

## API Integration

The **services** directory contains functions that make API calls to the backend.

### authService.js
- **Methods**:
  - `login(email, password)`: Sends credentials to the backend and stores authentication token.
  - `register(userData)`: Registers a new user.

### studentService.js
- **Methods**:
  - `getStudentDetails(studentId)`: Fetches student information.
  - `getGrades(studentId)`: Retrieves student grades.
  - `getSchedule(studentId)`: Retrieves student schedule.

## Authentication & Authorization

- Uses **JWT authentication** to secure API calls.
- Protects routes using React Router’s authentication checks.
- Stores authentication tokens in **localStorage** or **sessionStorage**.

## Error Handling & Logging

### Error Handling
- Uses React error boundaries to catch UI errors.
- API responses are handled with appropriate messages to the user.

### Logging
- Console logging for development.
- Can be extended with tools like Sentry or LogRocket.

## Deployment Instructions

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/nejcsever2004/contoso_fe.git
   cd contoso_fe
   ```
2. **Install Dependencies**:
   ```sh
   npm install
   ```
3. **Start the Development Server**:
   ```sh
   npm start
   ```
4. **Build the Application**:
   ```sh
   npm run build
   ```
5. **Deploy** (Example using Netlify or Vercel):
   - Upload the `build` folder or connect the repository for automatic deployment.

## Future Enhancements

- Implement **better UI design** using Material-UI or Tailwind CSS.
- Add **unit tests** using Jest and React Testing Library.
- Improve **error handling** with custom alerts.
- Expand **role-based authorization** for different user types.

---

This documentation provides an extensive overview of the **Contoso University Frontend** project. 🚀
