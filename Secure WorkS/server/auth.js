const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('./db');
const { hashData } = require('./cryptoUtils');

const SECRET_KEY = 'your_super_secret_key_for_jwt_signing';

// Helper to determine role from email
const determineRole = (email) => {
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('admin')) return 'Admin';
    if (lowerEmail.includes('manager')) return 'Manager';
    return 'Employee';
};

// 1. Authentication - Registration (Smart Role)
router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Auto-detect Role
    const role = determineRole(email);

    try {
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const sql = `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`;
        db.run(sql, [username, email, password_hash, role], function (err) {
            if (err) {
                return res.status(400).json({ error: err.message }); // Likely duplicate email
            }
            res.status(201).json({ message: `Registered successfully as ${role}`, userId: this.lastID, role });
        });
    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
});

// 1. Authentication - Single Factor (Login)
router.post('/login', (req, res) => {
    const { email, password } = req.body; // Changed from username to email for login as per elite requirement

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: "Invalid credentials" });

        // MFA Simulation
        const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Return temp token for MFA step
        const tempToken = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
            stage: 'mfa_pending',
            mfaCodeHash: await bcrypt.hash(mfaCode, 10)
        }, SECRET_KEY, { expiresIn: '5m' });

        console.log(`[MFA SMART] Code for ${user.email} (${user.role}): ${mfaCode}`);

        res.json({
            mfaRequired: true,
            tempToken,
            message: "Authentication Code sent to email"
        });
    });
});

// MFA Verification
router.post('/verify-mfa', async (req, res) => {
    const { tempToken, code } = req.body;

    try {
        const decoded = jwt.verify(tempToken, SECRET_KEY);
        if (decoded.stage !== 'mfa_pending') return res.status(401).json({ error: "Invalid token stage" });

        const match = await bcrypt.compare(code, decoded.mfaCodeHash);
        if (!match) return res.status(401).json({ error: "Invalid MFA Code" });

        const accessToken = jwt.sign({ id: decoded.id, role: decoded.role, email: decoded.email }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ accessToken, role: decoded.role, email: decoded.email, id: decoded.id });

    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
});

module.exports = router;
module.exports.SECRET_KEY = SECRET_KEY;
