const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt

// Connect to SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQLite database.');
});

// Create Users table
db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    email TEXT
)`, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Created users table');

    // Insert dummy users
    const dummyUsers = [
        { username: 'Alice', password: '9Ey?b#HXek&CT@q', email: 'alice@fh-campus.com' },
        { username: 'Bob', password: 'x5LGJLfyKo$HeML', email: 'bob@fh-campus.com' },
        { username: 'AliceAdminAccount', password: '7PEs!E?A$rsHxog', email: 'alice@admin.fh-campus.com' }
    ];

    dummyUsers.forEach(user => {
        bcrypt.hash(user.password, saltRounds, function(err, hash) {
            if (err) {
                return console.error(err.message);
            }
            db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, [user.username, hash, user.email], function(err) {
                if (err) {
                    return console.error(err.message);
                }
                console.log(`Inserted dummy user with ID: ${this.lastID}`);
            });
        });
    });
});

module.exports = db;
