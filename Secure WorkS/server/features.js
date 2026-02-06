const express = require('express');
const router = express.Router();
const { db } = require('./db');
const { authenticateToken } = require('./accessControl');

// NEW: Documents Table with Visibility Settings
db.run(`CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uploader_id INTEGER,
    filename TEXT,
    description TEXT,
    visible_to_admin INTEGER DEFAULT 0,
    visible_to_manager INTEGER DEFAULT 0,
    visible_to_employee INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(uploader_id) REFERENCES users(id)
)`);

// NEW: Messages Table for Inbox
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    recipient_id INTEGER, -- Nullable if group
    recipient_group TEXT, -- 'all', 'managers', 'employees', etc.
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id)
)`);

// --- Attendance Features ---

// Check-in (Employee)
router.post('/attendance/checkin', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const time = new Date().toLocaleTimeString();

    // Check if already checked in
    db.get("SELECT * FROM attendance WHERE user_id = ? AND date = ?", [userId, date], (err, row) => {
        if (row) return res.status(400).json({ error: "Already checked in today" });

        db.run("INSERT INTO attendance (user_id, date, check_in_time, status) VALUES (?, ?, ?, ?)",
            [userId, date, time, 'Present'],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Check-in successful", time });
            }
        );
    });
});

// Get My Attendance (Employee)
router.get('/attendance/my', authenticateToken, (req, res) => {
    db.all("SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC", [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- Manager Features ---

// Get All Employees Status (Manager)
router.get('/employees/status', authenticateToken, (req, res) => {
    if (req.user.role !== 'Manager' && req.user.role !== 'Admin') return res.status(403).json({ error: "Access Denied" });

    const today = new Date().toISOString().split('T')[0];

    // Left Join Users with Attendance for today
    const sql = `
        SELECT u.id, u.username, u.email, a.check_in_time, a.status 
        FROM users u 
        LEFT JOIN attendance a ON u.id = a.user_id AND a.date = ?
        WHERE u.role = 'Employee'
    `;

    db.all(sql, [today], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // If check_in_time is null, they are "Absent" (or not yet checked in)
        const result = rows.map(r => ({
            ...r,
            status: r.status || 'Absent'
        }));
        res.json(result);
    });
});

// Assign Work (Manager)
router.post('/assignments', authenticateToken, (req, res) => {
    if (req.user.role !== 'Manager' && req.user.role !== 'Admin') return res.status(403).json({ error: "Access Denied" });

    const { title, description, assigned_to } = req.body;

    db.run("INSERT INTO assignments (title, description, assigned_to, assigned_by) VALUES (?, ?, ?, ?)",
        [title, description, assigned_to, req.user.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            const assignmentId = this.lastID;
            // Add mock files
            db.run("INSERT INTO assignment_files (assignment_id, file_name, file_type) VALUES (?, ?, ?)", [assignmentId, 'brief.pdf', 'pdf']);
            res.json({ message: "Work assigned successfully" });
        }
    );
});

// Get Assignments (Employee: My Work, Manager: Created Work)
router.get('/assignments', authenticateToken, (req, res) => {
    if (req.user.role === 'Employee') {
        // Show work assigned TO me, plus files
        const sql = `
            SELECT a.*, u.username as assigned_by_name 
            FROM assignments a 
            JOIN users u ON a.assigned_by = u.id 
            WHERE a.assigned_to = ?
        `;
        db.all(sql, [req.user.id], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            // For now, just return assignments. In real app, we'd join files too or separate call.
            res.json(rows);
        });
    } else {
        // Show work assigned BY me
        const sql = `
            SELECT a.*, u.username as assigned_to_name 
            FROM assignments a 
            JOIN users u ON a.assigned_to = u.id 
            WHERE a.assigned_by = ?
        `;
        db.all(sql, [req.user.id], (err, rows) => {
            res.json(rows);
        });
    }
});

// Verify Files for Assignment
router.get('/assignments/:id/files', authenticateToken, (req, res) => {
    db.all("SELECT * FROM assignment_files WHERE assignment_id = ?", [req.params.id], (err, rows) => {
        res.json(rows);
    });
});



// --- DOCUMENT VAULT ROUTES ---
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure uploads directory exists
        const dir = 'uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        // secure filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Upload Document
router.post('/documents', authenticateToken, upload.single('file'), (req, res) => {
    // If no file uploaded, handle gracefully (or mandatory?)
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const { description, visibility } = req.body;
    // visibility might be a JSON string if sent from FormData
    let visObj = {};
    try {
        visObj = JSON.parse(visibility || '{}');
    } catch (e) {
        visObj = {};
    }

    const { role, id } = req.user;

    let vAdmin = 0, vManager = 0, vEmployee = 0;

    if (role === 'Employee') {
        // Employee uploads are visible to everyone by default
        vAdmin = 1; vManager = 1; vEmployee = 1;
    } else {
        vAdmin = visObj?.admin ? 1 : 0;
        vManager = visObj?.manager ? 1 : 0;
        vEmployee = visObj?.employee ? 1 : 0;
    }

    // Use req.file.originalname as the display name, and req.file.filename as internal reference
    // But original schema has "filename" column. Let's start basic and store actual filename in DB as well if needed or verify schema.
    // Storing user provided filename separately from disk filename is good practice.
    // Schema: filename TEXT. We'll store the original name here for display.
    // We should add a 'filepath' column or just store the disk filename in a new column?
    // For simplicity, let's reuse 'filename' column for display name, and maybe prepend original name to description?
    // Or just store the disk filename in 'filename' column, and user sees that.

    // Better: Allow user to provide a 'display name' (filename in body), and store the actual file path in description? No.
    // Let's alter table if possible? `sqlite3` `ALTER TABLE ADD COLUMN` is supported.
    // Let's try to add `file_path` column to `documents` table safely.

    // Actually, let's just store the JSON string `{ original: ..., path: ... }` in the strict 'filename' column? No that breaks sorting.
    // Let's just add `file_path` column.

    // Check if column exists, if not add it.
    // We can do this in the `db.run` callback of table creation, or just run it here once.
    // Or just simplify: Store the generated filename in `filename` column. The user provided `filename` (from simulator) is now `req.file.originalname`.

    const dbFilename = req.file.originalname; // Display name
    const filePath = req.file.filename;       // Disk name

    // We need to store filePath to retrieve it.
    // Let's modify the INSERT to store the path in a new way.
    // Quickest hack: Store `DISPLAY_NAME:::DISK_NAME` in the filename column?
    // Or just add the column.

    // To be safe and clean, let's just use the `filename` column to store the Disk Filename (unique), 
    // and rely on `description` or just the filename itself for display.
    // Wait, the UI shows `doc.filename`. If it's `123123-file.pdf`, it's ugly but fine.

    // Let's update the INSERT to use the stored filename.
    const stmt = db.prepare('INSERT INTO documents (uploader_id, filename, description, visible_to_admin, visible_to_manager, visible_to_employee) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run([id, req.file.originalname + ':::' + req.file.filename, description, vAdmin, vManager, vEmployee], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Document uploaded', id: this.lastID });
    });
});

// Download Route
router.get('/documents/:id/download', authenticateToken, (req, res) => {
    db.get('SELECT * FROM documents WHERE id = ?', [req.params.id], (err, row) => {
        if (!row) return res.status(404).json({ error: 'File not found' });

        // Authorization Check
        const { role } = req.user;
        const canView = (role === 'Admin' && row.visible_to_admin) ||
            (role === 'Manager' && row.visible_to_manager) ||
            (role === 'Employee' && row.visible_to_employee) ||
            row.uploader_id === req.user.id;

        if (!canView) return res.status(403).json({ error: 'Access Denied' });

        // Parse filename
        const parts = row.filename.split(':::');
        const diskFilename = parts.length > 1 ? parts[1] : row.filename; // Fallback
        const originalName = parts[0];

        const filePath = path.join(__dirname, 'uploads', diskFilename);
        if (fs.existsSync(filePath)) {
            res.download(filePath, originalName);
        } else {
            res.status(404).json({ error: 'File on disk not found.' });
        }
    });
});


// Get Documents (Filtered by Role)
router.get('/documents', authenticateToken, (req, res) => {
    const { role } = req.user;
    let query = 'SELECT documents.*, users.username as uploader_name FROM documents JOIN users ON documents.uploader_id = users.id WHERE ';

    if (role === 'Admin') query += 'visible_to_admin = 1';
    else if (role === 'Manager') query += 'visible_to_manager = 1';
    else query += 'visible_to_employee = 1';

    query += ' ORDER BY created_at DESC';

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


// --- MESSAGING ROUTES ---

// Get Users for Recipients List (Constrained by Role)
router.get('/users/contacts', authenticateToken, (req, res) => {
    const { role, id } = req.user;

    db.all('SELECT id, username, role, email FROM users WHERE id != ?', [id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const contacts = rows.filter(u => {
            if (role === 'Admin') return u.role === 'Manager'; // + Client (mocked later if needed)
            if (role === 'Manager') return u.role === 'Admin' || u.role === 'Employee';
            if (role === 'Employee') return u.role === 'Manager' || u.role === 'Employee';
            return false;
        });
        res.json(contacts);
    });
});

// Send Message
router.post('/messages', authenticateToken, (req, res) => {
    const { recipient_id, recipient_group, content } = req.body;
    const sender_id = req.user.id;

    const stmt = db.prepare('INSERT INTO messages (sender_id, recipient_id, recipient_group, content) VALUES (?, ?, ?, ?)');
    console.log(`Sending message: ${content} from ${sender_id} to ${recipient_id} (group: ${recipient_group})`);

    stmt.run([sender_id, recipient_id, recipient_group, content], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Message sent' });
    });
});

// Get My Messages
router.get('/messages', authenticateToken, (req, res) => {
    const { id, role } = req.user;

    const query = `
        SELECT messages.*, users.username as sender_name, users.role as sender_role 
        FROM messages 
        JOIN users ON messages.sender_id = users.id 
        WHERE recipient_id = ? 
        OR (recipient_group = 'all_managers' AND ? = 'Manager')
        OR (recipient_group = 'all_employees' AND ? = 'Employee')
        OR (recipient_group = 'all_admins' AND ? = 'Admin')
        OR (recipient_group = 'all')
        ORDER BY created_at DESC
    `;

    db.all(query, [id, role, role, role], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
