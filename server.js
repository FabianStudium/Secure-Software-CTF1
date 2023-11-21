const express = require('express');
const bcrypt = require('bcrypt');

const db = require('./database');
const sanitizeInput = require('./utils/sanitize')

const app = express();
const port = 3000;
const saltRounds = 10; // Number of salt rounds for bcrypt

app.use(express.json());

app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    db.run(query, [username, password, email], function(err) {
        if (err) {
            res.status(400).send('Error in registration');
        } else {
            res.status(201).send(`User created with ID: ${this.lastID}`);
        }
    });
});

app.post('/login', (req, res) => {
    const { login, password } = req.body;
    const { sanitized: sanitizedLogin, errorMessages: loginErrors } = sanitizeInput(login);
    const { sanitized: sanitizedPassword, errorMessages: passwordErrors } = sanitizeInput(password);
  
    // Handle error messages
    if (loginErrors.length > 0 || passwordErrors.length > 0) {
      return res.status(400).send({
        message: 'Input contains disallowed characters or patterns',
        loginErrors,
        passwordErrors
      });
    }

    // First, retrieve the user by username or email
    const query = `SELECT * FROM users WHERE (username = ? OR email = ?)`;

    db.get(query, [sanitizedLogin, sanitizedLogin], (err, user) => {
        if (err) {
            return res.status(400).send('Error in login');
        }
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        // Compare provided password with hashed password
        bcrypt.compare(sanitizedPassword, user.password, function(err, result) {
            if (err) {
                return res.status(400).send('Error in login');
            }
            if (result) {
                res.status(200).send('Login successful');
            } else {
                res.status(401).send('Invalid credentials');
            }
        });
    });
});
  

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
