const mariadb = require('mariadb');

const db = mariadb.createPool({
    host: 'mariadb', // This should match the service name in docker-compose
    user: 'root',
    password: 'AdminPassword123',
    database: 'mariadb',
    connectionLimit: 5,
    multipleStatements: true // Allow multiple statements per query
});

// Create Users table
const initDb = async () => {
    let conn;
    try {
        conn = await db.getConnection();
        await conn.query(`CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            username VARCHAR(255),
            password VARCHAR(255),
            email VARCHAR(255),
            failed_attempts INT DEFAULT 0
        )`);
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

        for (const user of dummyUsers) {
            await conn.query(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`, [user.username, user.password, user.email]);
            console.log(`Inserted dummy user: ${user.username}`);
        }
    } catch (err) {
        console.error(err.message);
    } finally {
        if (conn) conn.release(); // Release the connection back to the pool
    }
};

initDb();

module.exports = db;