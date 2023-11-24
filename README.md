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
* Setup Instructions

## Local Setup

Clone the Repository

```sh
=git clone https://github.com/FabianStudium/Secure-Software-CTF1.git
cd Secure-Software-CTF1
```

Install Dependencies

```sh
npm install
```

Start the Backend Server

```sh
node server.js
```

Start the Frontend Application

```sh
Copy code
npm start
```

## Docker Setup

Alternatively, you can build and run the application using Docker:

```sh
docker build -t secure-software-ctf1 .
docker run -p 80:80 secure-software-ctf1
```

## Educational Objectives

* Understanding Information Leakage: Learn how repeated failed login attempts can lead to information leakage and how this can be exploited.
* SQL Injection: Practice identifying and exploiting SQL injection vulnerabilities in a web application.
* Find the Flag in this format `CTF{<hacker-text>}`.

## Disclaimer

This application is for educational purposes only. The vulnerabilities demonstrated should not be exploited in any real-world scenario, and it is important to practice ethical hacking guidelines.