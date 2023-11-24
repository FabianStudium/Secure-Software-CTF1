const sqlite3 = require('sqlite3').verbose();

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
    email TEXT,
    failed_attempts INTEGER DEFAULT 0
)`, (err) => {
    
    if (err) {
        return console.error(err.message);
    }
    console.log('Created users table');

    // Insert dummy users
    const dummyUsers = [
        { username: 'Alice', password: '9Ey?b#HXek&CT@q', email: 'alice@fh-campus.com' },
        { username: 'Bob', password: 'x5LGJLfyKo)HeML', email: 'bob@fh-campus.com' },
        { username: 'Admin', password: 'g4iyAMxj9Ye#TGr', email: 'secretadmin@fh-campus.com' },
        { username: 'Flag', password: '7Rt@oFtxiSx95FJ', email: 'CTF{1nf0_l34k_n_1nj3cT_h4x0r!}' },
        { username: 'Charlie', password: 'p4sSw0rd!2345', email: 'charlie@fh-campus.com' },
        { username: 'David', password: 'david1234Pass', email: 'david@fh-campus.com' },
        { username: 'Eve', password: 'eve!@#Secure', email: 'eve@fh-campus.com' },
        { username: 'Frank', password: 'frankPassword!9', email: 'frank@fh-campus.com' },
        { username: 'Grace', password: 'gracePass123!', email: 'grace@fh-campus.com' },
        { username: 'Hannah', password: 'hannahSecur3!', email: 'hannah@fh-campus.com' },
        { username: 'Ivy', password: 'IvyP@ssw0rd!', email: 'ivy@fh-campus.com' },
        { username: 'John', password: 'johnDoe!@#$', email: 'john@fh-campus.com' }
    ];

    dummyUsers.forEach(user => {
        db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, [user.username, user.password, user.email], function(err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Inserted dummy user with ID: ${this.lastID}`);
        });
    });
});

module.exports = db;