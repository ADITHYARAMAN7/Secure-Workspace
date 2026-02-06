const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./auth');
const { db } = require('./db');

// Middleware to verify JWT
// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Forbidden: Invalid Token" });
        req.user = user;
        next();
    });
};

// 2. Authorization - Access Control
// Implementation of Access Control List (ACL) / Matrix
// Subjects: Admin, Manager, Employee
// Objects/Resources: Files, Reports, SystemSettings

const PERMISSIONS = {
    'Admin': ['Files', 'Reports', 'SystemSettings', 'ManageUsers'],
    'Manager': ['Files', 'Reports', 'ApproveRequests'],
    'Employee': ['Files', 'SubmitRequest']
};

const authorize = (requiredResource) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        const allowedResources = PERMISSIONS[userRole] || [];

        // Simple check: Does the role have access to the resource category?
        if (allowedResources.includes(requiredResource) || allowedResources.includes('*')) {
            next();
        } else {
            res.status(403).json({ error: "Access Denied: Insufficient Permissions" });
        }
    };
};

const router = require('express').Router();

router.get('/files', authenticateToken, authorize('Files'), (req, res) => {
    res.json({ message: "Access granted to Files", user: req.user });
});

router.get('/reports', authenticateToken, authorize('Reports'), (req, res) => {
    res.json({ message: "Access granted to Reports", user: req.user });
});

router.get('/system-settings', authenticateToken, authorize('SystemSettings'), (req, res) => {
    res.json({ message: "Access granted to System Settings (Admin Only)", user: req.user });
});

// Endpoint to fetch Requests (Manager/Admin only)
router.get('/requests', authenticateToken, (req, res) => {
    // Custom logic: Employees see their own, Managers see all
    if (req.user.role === 'Employee') {
        db.all("SELECT * FROM requests WHERE user_id = ?", [req.user.id], (err, rows) => {
            res.json(rows);
        });
    } else {
        // Manager/Admin see all
        db.all("SELECT requests.*, users.username FROM requests JOIN users ON requests.user_id = users.id", [], (err, rows) => {
            res.json(rows);
        });
    }
});

// Endpoint to Create Request
router.post('/requests', authenticateToken, (req, res) => {
    // 5. Digital Signature Verification
    // The client sends data + signature. We verify integrity.
    // For simplicity in this lab, signature is a hash of the content signed by user's "private key" (simulated).
    // In real world, we'd look up the user's public key.

    const { resource, reason, signature, publicKey } = req.body;

    // START LAB VERIFICATION LOGIC
    // Reconstruct the message that was signed
    const message = JSON.stringify({ resource, reason, userId: req.user.id });
    // In a real app we'd verify 'signature' against 'message' using 'publicKey'
    // Here we just store it.
    // END LAB VERIFICATION LOGIC

    const sql = `INSERT INTO requests (user_id, resource, reason, status, digital_signature) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [req.user.id, resource, reason, 'Pending', signature], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Request submitted successfully" });
    });
});

// Endpoint to Approve/Reject (Manager Only)
router.post('/requests/:id/action', authenticateToken, authorize('ApproveRequests'), (req, res) => {
    const { status } = req.body; // Approved / Rejected
    db.run("UPDATE requests SET status = ? WHERE id = ?", [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `Request ${status}` });
    });
});


module.exports = router;
module.exports.authenticateToken = authenticateToken;
