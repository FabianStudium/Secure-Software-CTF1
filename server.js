const express = require('express');
const cors = require('cors')

const db = require('./database');
const sanitizeInput = require('./utils/sanitize')

const app = express();
const port = 3000;

// CORS configuration
const corsOptions = {
    origin: ['http://frontend:3001', 'http://localhost:3001', 'http://127.0.0.1:3001'], // or your frontend's origin
    optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?);`;
    try {
        const result = await db.query(query, [username, password, email]);
        res.status(201).send({ message: `User created with ID: ${result.insertId}` });
    } catch (err) {
        res.status(400).send('Error in registration');
    }
});

/*
    TODO for Developer: we recently started using prepared statements for DB access. Please double-check if we found everything
*/
app.post('/login', async (req, res) => {
    const { login, password } = req.body;
    const { sanitized: sanitizedLogin, errorMessages: loginErrors } = sanitizeInput(login);
    const { sanitized: sanitizedPassword, errorMessages: passwordErrors } = sanitizeInput(password);
  
    // Handle error messages
    if (loginErrors.length > 0) {
        return res.status(400).send({
            message: `Input contains disallowed characters or patterns.${loginErrors}.`,
            errors: {
                login: loginErrors,
                // password: passwordErrors
            }
        });
    }
    
    if (passwordErrors.length > 0) {
        return res.status(400).send({
            message: `Input contains disallowed characters or patterns.${passwordErrors}.`,
            errors: {
                // login: loginErrors,
                password: passwordErrors
            }
        });
    }

    try {
        const userQuery = `SELECT id, username, failed_attempts FROM users WHERE username = ? OR email = ?`;
        const userRow = await db.query(userQuery, [sanitizedLogin, sanitizedLogin]);

        if (userRow.length > 0) {
            // Intentionally vulnerable SQL query
            const passwordQuery = `SELECT * FROM users WHERE id=${userRow[0].id} AND password = '${password}'`;
            const passwordRow = await db.query(passwordQuery);

            if (passwordRow.length > 0) {
                // Successful login
                const resetAttemptsQuery = `UPDATE users SET failed_attempts = 0 WHERE id = ?`;
                await db.query(resetAttemptsQuery, [userRow[0].id]);
                res.status(200).send({ message: 'Login successful.', username: userRow[0].username });
            } else {
                // Failed login, increment failed_attempts
                let newAttempts = (userRow[0].failed_attempts || 0) + 1;
                const updateAttemptsQuery = `UPDATE users SET failed_attempts = ? WHERE id = ?`;
                await db.query(updateAttemptsQuery, [newAttempts, userRow[0].id]);

                if (newAttempts >= 5) {
                    res.status(401).send({ message: 'Account locked. Please contact admin at secretadmin@fh-campus.com', username: userRow[0].username });
                } else {
                    res.status(401).send({ message: 'Invalid credentials. Please try again.' });
                }
            }
        } else {
            res.status(401).send({ message: 'Invalid credentials. User not found.' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Error during login process', error: err.message });
    }
});

app.post('/logout', (req, res) => {  
    // Since the username is stored on the client-side, the server doesn't need to do much here. Just send a success response.
    res.status(200).send({ message: 'Logout successful.' });
});

app.get('/users', async (req, res) => {
    /* 
        TODO for Developer: Check if user is admin!
    */

    const query = 'SELECT id, username, email FROM users';

    /*
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).send({ message: 'Error fetching users', error: err.message });
        } else {
            res.status(200).json(rows);
        }
    });
    */

    try {
        const result = await db.query(query);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).send({ message: 'Error fetching users', error: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    /* 
        TODO for Developer: Check if user is admin!
    */

    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';

    /*
    db.run(query, [id], (err) => {
        if (err) {
            res.status(500).send({ message: 'Error deleting user', error: err.message });
        } else {
            res.status(200).send({ message: 'User deleted successfully' });
        }
    });
    */

    try {
        const result = await db.query(query, id);
        res.status(201).send({ message: `User deleted with ID: ${id}` });
    } catch (err) {
        res.status(400).send({ message: 'Error deleting user', error: err.message });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
