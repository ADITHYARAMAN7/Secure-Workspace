const crypto = require('crypto');
const express = require('express');
const router = express.Router();

// --- 3. Encryption (AES) & 4. Hashing ---

// AES-256-CBC Encryption
const encryptData = (text, key) => {
    // Key must be 32 bytes for aes-256
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
};

const decryptData = (encryptedData, key, iv) => {
    let ivBuffer = Buffer.from(iv, 'hex');
    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), ivBuffer);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

// Hashing with SHA-256
const hashData = (data) => {
    return crypto.createHash('sha256').update(data).digest('hex');
};

// Digital Signature (Simulated using HMAC)
const createSignature = (data, privateKey) => {
    // In a real scenario, use RSA/ECDSA. Here we use HMAC-SHA256 as a simplified "Signature" using a user's secret
    return crypto.createHmac('sha256', privateKey).update(data).digest('hex');
};

const verifySignature = (data, signature, publicKey) => {
    // Verification logic
    const computed = createSignature(data, publicKey); // In HMAC symmetric, key is same. 
    return computed === signature;
};

// Diffie-Hellman Key Exchange (Simulation)
// 3. Key Exchange Mechanism
const generateDHKeys = () => {
    const dh = crypto.createDiffieHellman(2048);
    const publicKey = dh.generateKeys('hex');
    const privateKey = dh.getPrivateKey('hex');
    // In real DH, we would share Prime and Generator.
    return { publicKey, privateKey, prime: dh.getPrime('hex'), generator: dh.getGenerator('hex') };
};

const computeSecret = (localPrivateKey, localPrime, localGenerator, remotePublicKey) => {
    const dh = crypto.createDiffieHellman(Buffer.from(localPrime, 'hex'), Buffer.from(localGenerator, 'hex'));
    dh.setPrivateKey(Buffer.from(localPrivateKey, 'hex'));
    return dh.computeSecret(Buffer.from(remotePublicKey, 'hex'), 'hex');
};


// --- Routes for Demo ---
// Used by frontend to demonstrate encryption concepts
router.post('/encrypt', (req, res) => {
    const { text, secret } = req.body;
    // Hash secret to ensure 32 bytes
    const key = crypto.createHash('sha256').update(secret).digest('hex');
    const result = encryptData(text, key);
    res.json(result);
});

router.post('/decrypt', (req, res) => {
    const { encryptedData, iv, secret } = req.body;
    const key = crypto.createHash('sha256').update(secret).digest('hex');
    try {
        const result = decryptData(encryptedData, key, iv);
        res.json({ decryptedData: result });
    } catch (e) {
        res.status(400).json({ error: "Decryption failed" });
    }
});

router.get('/dh-init', (req, res) => {
    const keys = generateDHKeys();
    // Server acts as one party. For demo, we just send params so client can make their own.
    res.json(keys);
});

module.exports = router;
module.exports.encryptData = encryptData;
module.exports.decryptData = decryptData;
module.exports.hashData = hashData;
module.exports.createSignature = createSignature;
