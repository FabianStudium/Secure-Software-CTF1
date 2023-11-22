const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt');

const db = require('./backend/database');
const sanitizeInput = require('./backend/utils/sanitize')

const app = express();
const port = 3000;
const saltRounds = 10; // Number of salt rounds for bcrypt

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3001', // or your frontend's origin
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));

app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?);`;
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
    // const { sanitized: sanitizedUsername, errorMessages: loginErrors } = {sanitized: login, errorMessages: []};
    // const { sanitized: sanitizedPassword, errorMessages: passwordErrors } = {sanitized: password, errorMessages: []};
  
    // Handle error messages
    if (loginErrors.length > 0 || passwordErrors.length > 0) {
      return res.status(400).send({
        message: 'Input contains disallowed characters or patterns',
        loginErrors,
        passwordErrors
      });``
    }

    
    // const query = `SELECT * FROM users WHERE username = '${sanitizedUsername}' AND password = '${sanitizedPassword}' OR email = '${sanitizedEmail}' AND password = '${sanitizedPassword}';`;
    const query = `SELECT * FROM users WHERE username = '${sanitizedLogin}' AND (password = '${sanitizedPassword}') OR email = '${sanitizedLogin}' AND (password = '${sanitizedPassword}');`;

    db.get(query, [], (err, row) => {
        if (err) {
            res.status(400).send('Error in login');
        } else if (row) {
            res.status(200).send({message: 'Login successfull.', username: row.username });
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
    

    // const userCheckQuery = `SELECT * FROM users WHERE username = '${sanitizedUsername}' OR email = '${sanitizedEmail}'`;
    

    // db.get(userCheckQuery, [], (err, user) => {
    //     if (err) {
    //         return res.status(400).send('Error in login');
    //     }
    //     if (!user) {
    //         return res.status(401).send('Invalid credentials');
    //     }

    //     // If user exists, proceed to password verification
    //     const passwordCheckQuery = `SELECT * FROM users WHERE id = ${user.id} AND password = '${sanitizedPassword}'`;

    //     db.get(passwordCheckQuery, [], (err, validUser) => {
    //         if (err) {
    //             return res.status(400).send('Error in login');
    //         }
    //         if (validUser) {
    //             res.status(200).send({message: 'Login successful.', username: validUser.username });
    //         } else {
    //             res.status(401).send('Invalid credentials');
    //         }
    //     });
    // });
});
  

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
