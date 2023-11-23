# Capture The Flag (CTF) Application Documentation

## Table of Contents  
[Overview](#overview)  

## Overview
The CTF application is an educational tool designed to demonstrate and teach about two critical security vulnerabilities: information leakage and SQL injection. It simulates a real-world scenario with a login system where users can experience firsthand how these vulnerabilities can be exploited. The application is structured to guide users through the process of account creation, locking, and unauthorized access using SQL injection.

## Technologies Used
This section outlines the technologies and frameworks used in the development of the CTF application.

### Frontend

- **React.js:** A JavaScript library for building user interfaces. It is used to create the interactive elements of the application, such as the registration, login, and admin panels.

### Backend

- **Node.js with Express.js:** Node.js is a JavaScript runtime. Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. Together, they handle the server-side logic and HTTP requests.

### Database

- **SQLite3:** A C library that provides a lightweight disk-based database. In this application, SQLite3 is used to manage user data and authentication details.

### Other Libraries

- **axios:** A promise-based HTTP client for making HTTP requests from the browser. It is used for communication between the frontend and backend.

## Setup
This section describes the steps to set up and run the CTF application.

### Prerequisites

- Node.js installed on the system.

- Basic knowledge of JavaScript and SQL.

### Installation and Running the Application

1. **Clone the Repository:**

```bash
git clone https://github.com/FabianStudium/Secure-Software-CTF1.git
```

2. **Install Dependencies:**
Navigate to the cloned directory and install the necessary packages using npm.

```bash 
cd Secure-Software-CTF1
npm install
```

3. **Start the Backend Server:**

```bash
node server.js
```

This will start the Express.js server on `localhost:3000`.

4. **Start the Frontend Application:**
In a new terminal, navigate to the `client` directory and start the React application.

```bash
cd client
npm start
```

This will serve the frontend on `localhost:3001`.

5. **Accessing the Application:**
Open a web browser and navigate to `http://localhost:3001` to interact with the application.

### Database Setup
The SQLite3 database is configured to run in-memory for simplicity. Upon starting the server, it automatically creates a `users` table and populates it with some dummy data for testing purposes.

### Server Configuration
The server is configured to handle various routes for user registration, login, logout, and admin actions. It includes middleware for CORS to allow cross-origin requests, which is essential for the frontend to communicate with the backend.

---

## Implementation of Vulnerabilities

### Information Leakage
The application inadvertently leaks sensitive information, specifically the administrator's email, through its account lockout mechanism. This occurs in the following manner:

1. **Account Lockout Mechanism:** The application tracks the number of consecutive failed login attempts. Upon reaching a threshold (5 failed attempts), the account is considered "locked".
2. **Error Message with Admin's Email:** When an account is locked, the application displays an error message advising the user to contact the administrator. This message includes the admin's email address, which was mistakenly used for account creation, thus revealing a part of the admin's credential pair (the email) to the user.
3. **Security Implication:** By obtaining the admin's email, a malicious user gains a significant advantage, as they now possess one half of the credential pair required for admin access. This information leakage can lead to more targeted and effective attacks, such as SQL injection.

### SQL Injection
The application is vulnerable to SQL injection due to improper input sanitization. The developer attempted to implement a custom sanitization function, which is generally not recommended due to the complexity and evolving nature of injection attacks. The function's shortcomings are as follows:

1. **Custom Sanitization Function:** Located in `backend/utils/sanitize.js`, this function attempts to filter out known SQL injection patterns and certain SQL keywords. However, it fails to cover all possible injection techniques and keywords.
   - [Sanitization Function](https://github.com/FabianStudium/Secure-Software-CTF1/blob/main/backend/utils/sanitize.js)
2. **Limited Pattern Recognition:** The function only filters basic SQL injection patterns and some common SQL keywords. Advanced or less common patterns and keywords are not accounted for, leaving the application vulnerable. Patterns like simple `OR` equation are recognized, while forgetting about inequalities - `OR 1 != 2`
3. **Inadequate Security Practice:** Relying on pattern matching for SQL injection prevention is inadequate. It is generally recommended to use parameterized queries or prepared statements, which are more robust against SQL injection attacks.
4. **Vulnerable Login Query:** The login functionality constructs SQL queries using string concatenation, particularly in the password check. This makes it susceptible to SQL injection if a user inputs a malicious string.
   - [Login Query Vulnerability](https://github.com/FabianStudium/Secure-Software-CTF1/blob/main/server.js)

### Exploiting the Vulnerabilities

1. **Information Leakage Exploitation:**
   - The user registers an account and logs out afterwards
   - A user attempts to log in with incorrect credentials multiple times until the account is locked.
   - The error message displayed includes the admin's email, which the user notes.
2. **SQL Injection Exploitation:**
   - Using the obtained admin email, the user attempts to log in again.
   - In the password field, the user inputs a crafted SQL injection payload (e.g., `' OR '1'!='2`). Due to the inadequate sanitization, this payload alters the SQL query logic, bypassing the authentication check and granting access.

### Conclusion
These vulnerabilities highlight the importance of following best practices in security, such as avoiding custom sanitization functions and using parameterized queries. They also demonstrate how seemingly minor oversights, like revealing an admin email, can lead to significant security breaches.
