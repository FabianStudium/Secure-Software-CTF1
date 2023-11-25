# Secure Software CTF1

## Overview

This application is designed for educational purposes, providing a hands-on experience in understanding and exploiting two common security vulnerabilities: information leakage and SQL injection. It simulates a vulnerable login page where users can practice identifying and exploiting these vulnerabilities in a controlled environment.

## Key Features

1. User Registration: Users can register an account to interact with the application.
2. Login Attempts: After logging out, users can attempt to log in. After 5 unsuccessful attempts, the account is "locked," and an error message suggests contacting the admin.
3. Exploitation Scenario: A simulated vulnerability allows a malicious user to log in using the admin's email with SQL injection in the password field.

## Technology Stack

* Frontend: React.js
* Backend: Node.js with Express.js
* Database: MariaDB

## Application Setup

You can run the application using Docker Compose. This setup includes the backend, frontend, and a MariaDB database. Here are the steps:

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/FabianStudium/Secure-Software-CTF1.git
   cd Secure-Software-CTF1
   ```

2. **Run Docker Compose**

    ```sh
    docker-compose up
    ```

This will start three containers:

* backend: The Node.js backend server, accessible at <http://localhost:3000>.
* frontend: The React.js frontend application, accessible at <http://localhost:3001>.
* mariadb: A MariaDB database instance.

The database is configured with a root password AdminPassword123 and a database named mariadb.

## Educational Objectives

* Understanding Information Leakage: Learn how repeated failed login attempts can lead to information leakage and how this can be exploited.
* SQL Injection: Learn to identify and exploit SQL injection vulnerabilities. The application now uses MariaDB, which allows multiple query executions.
* Find the Flag in this format `CTF{some_text}`.

## Disclaimer

This application is for educational purposes only. The vulnerabilities demonstrated should not be exploited in any real-world scenario, and it is important to practice ethical hacking guidelines.
