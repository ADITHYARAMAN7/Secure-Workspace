const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const initDB = () => {
    db.serialize(() => {
        // Users Table - Role is now derived but we still store it for easy access after registration
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            email TEXT UNIQUE,
            password_hash TEXT,
            role TEXT, 
            salt TEXT
        )`);

        // Access Requests Table (Legacy but kept for "Request File" feature)
        db.run(`CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            resource TEXT,
            action TEXT,
            reason TEXT,
            status TEXT DEFAULT 'Pending',
            digital_signature TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // NEW: Attendance Table
        db.run(`CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            date TEXT, -- YYYY-MM-DD
            check_in_time TEXT,
            status TEXT, -- Present, Absent, Late
            FOREIGN KEY(user_id) REFERENCES users(id)
        )`);

        // NEW: Assignments Table
        db.run(`CREATE TABLE IF NOT EXISTS assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            assigned_to INTEGER, -- User ID (Employee)
            assigned_by INTEGER, -- User ID (Manager)
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(assigned_to) REFERENCES users(id),
            FOREIGN KEY(assigned_by) REFERENCES users(id)
        )`);

        // NEW: files associated with assignments (Simulated)
        db.run(`CREATE TABLE IF NOT EXISTS assignment_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assignment_id INTEGER,
            file_name TEXT,
            file_type TEXT,
            FOREIGN KEY(assignment_id) REFERENCES assignments(id)
        )`);
    });
};

module.exports = { db, initDB };
