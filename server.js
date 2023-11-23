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

app.get('/', (req, res) => {
    res.send('Hello World!');
});

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

/*
    TODO for Developer: we recently started using prepared statements for DB access. Please double-check if we found everything
*/

app.post('/login', (req, res) => {
    const { login, password } = req.body;
    const { sanitized: sanitizedLogin, errorMessages: loginErrors } = sanitizeInput(login);
    const { sanitized: sanitizedPassword, errorMessages: passwordErrors } = sanitizeInput(password);
  
    // Handle error messages
    if (loginErrors.length > 0 || passwordErrors.length > 0) {
        return res.status(400).send({
            message: 'Input contains disallowed characters or patterns',
            errors: {
                login: loginErrors,
                password: passwordErrors
            }
        });
    }

    // Securely check if the user exists and get their failed_attempts count
    const userQuery = `SELECT id, username, password, failed_attempts FROM users WHERE username = ? OR email = ?`;
    db.get(userQuery, [sanitizedLogin, sanitizedLogin], (err, user) => {
        if (err) {
            return res.status(500).send({ message: 'Error during login process', error: err.message });
        } else if (user) {
            // User exists, now perform a vulnerable password check
            const passwordQuery = `SELECT * FROM users WHERE id=${user.id} AND password = '${sanitizedPassword}'`;
            db.get(passwordQuery, [], (passwordErr, passwordRow) => {
                if (passwordRow) {
                    // Successful login
                    const resetAttemptsQuery = `UPDATE users SET failed_attempts = 0 WHERE id = ?`;
                    db.run(resetAttemptsQuery, [user.id]);
                    res.status(200).send({ message: 'Login successful.', username: user.username });
                } else {
                    // Failed login, increment failed_attempts
                    let newAttempts = (user.failed_attempts || 0) + 1;
                    const updateAttemptsQuery = `UPDATE users SET failed_attempts = ? WHERE id = ?`;
                    db.run(updateAttemptsQuery, [newAttempts, user.id]);

                    console.log(`Failed Login attempts for ${user.username}: ${user.failed_attempts}.`)

                    if (newAttempts >= 5) {
                        // Lock account and send error message
                        res.status(401).send({ message: 'Account locked. Please contact admin at admin@example.com', username: user.username });
                    } else {
                        // Send regular error message
                        res.status(401).send({ message: 'Invalid credentials. Please try again.' });
                    }
                }
            });
        } else {
            // User does not exist
            res.status(401).send({ message: 'Invalid credentials. User not found.' });
        }
    });
});

    /*
    // const query = `SELECT * FROM users WHERE username = '${sanitizedUsername}' AND password = '${sanitizedPassword}' OR email = '${sanitizedEmail}' AND password = '${sanitizedPassword}';`;
    const query = `SELECT * FROM users WHERE username = '${sanitizedLogin}' AND (password = '${sanitizedPassword}') OR email = '${sanitizedLogin}' AND (password = '${sanitizedPassword}');`;

    db.get(query, [], (err, row) => {
        if (err) {
            res.status(400).send('Error in login');
        } else if (row) {
            res.status(200).send({message: 'Login successfull.', username: row.username });
            // Reset failed_attempts to 0
            db.run("UPDATE users SET failed_attempts = 0 WHERE id = ?", [row.id]);
        } else {
            // Increment failed_attempts
            let newAttempts = (row.failed_attempts || 0) + 1;
            db.run("UPDATE users SET failed_attempts = ? WHERE id = ?", [newAttempts, row.id]);
            
            if (newAttempts >= 5) {
                // Lock account and send error message
                res.status(401).send('Account locked. Please contact admin at alice@admin.fh-campus.com');
            } else {
                // Send regular error message
                res.status(401).send('Invalid credentials');
            }        
        }
    });
    */

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
// });

app.post('/logout', (req, res) => {  
    // Since the username is stored on the client-side, the server doesn't need to do much here. Just send a success response.
    res.status(200).send({ message: 'Logout successful.' });
});

app.get('/users', (req, res) => {
    /* 
        TODO for Developer: Check if user is admin!
    */

    const query = 'SELECT id, username, email FROM users';

    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).send({ message: 'Error fetching users', error: err.message });
        } else {
            res.status(200).json(rows);
        }
    });
});

app.delete('/users/:id', (req, res) => {
    /* 
        TODO for Developer: Check if user is admin!
    */

    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';

    db.run(query, [id], (err) => {
        if (err) {
            res.status(500).send({ message: 'Error deleting user', error: err.message });
        } else {
            res.status(200).send({ message: 'User deleted successfully' });
        }
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
