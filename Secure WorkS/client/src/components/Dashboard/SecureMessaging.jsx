import React, { useState } from 'react';
import { api } from '../../api';

const SecureMessaging = () => {
    const [text, setText] = useState('');
    const [recipient, setRecipient] = useState('client');
    const [secret, setSecret] = useState('');
    const [encrypted, setEncrypted] = useState(null);
    const [decrypted, setDecrypted] = useState('');

    const handleEncrypt = async () => {
        if (!text || !secret) {
            alert('Message and Key are required');
            return;
        }
        try {
            const res = await api.post('/crypto/encrypt', { text, secret });
            setEncrypted(res);
            setDecrypted('');
        } catch (err) {
            alert('Encryption failed');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Recipient Selector */}
            <div style={{ display: 'flex', gap: '8px', padding: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', width: 'fit-content' }}>
                <button
                    onClick={() => setRecipient('client')}
                    style={{
                        padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                        background: recipient === 'client' ? 'rgba(255,255,255,0.1)' : 'transparent',
                        color: recipient === 'client' ? 'white' : '#6B7280'
                    }}
                >
                    TO CLIENT
                </button>
                <button
                    onClick={() => setRecipient('manager')}
                    style={{
                        padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                        background: recipient === 'manager' ? 'rgba(255,255,255,0.1)' : 'transparent',
                        color: recipient === 'manager' ? 'white' : '#6B7280'
                    }}
                >
                    TO MANAGER
                </button>
            </div>

            {/* Message Input */}
            <div>
                <textarea
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={`Compose secure message to ${recipient.toUpperCase()}...`}
                    style={{
                        width: '100%', height: '80px', padding: '12px', borderRadius: '8px',
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white', resize: 'none', fontSize: '14px', fontFamily: 'sans-serif'
                    }}
                />
            </div>

            {/* Secret Key & Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
                <input
                    type="password"
                    value={secret}
                    onChange={e => setSecret(e.target.value)}
                    placeholder="Encryption Key"
                    style={{
                        flex: 1, padding: '10px', borderRadius: '8px',
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white', fontSize: '12px'
                    }}
                />
                <button
                    onClick={handleEncrypt}
                    style={{
                        padding: '0 24px', borderRadius: '8px',
                        background: 'linear-gradient(90deg, #10B981, #059669)',
                        color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer'
                    }}
                >
                    SEND <span style={{ fontSize: '10px', opacity: 0.8 }}>(ENCRYPT)</span>
                </button>
            </div>

            {/* Output */}
            {encrypted && (
                <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <p style={{ fontSize: '10px', color: '#10B981', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Message Sent (Encrypted & Logged)
                    </p>
                    <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'monospace', wordBreak: 'break-all', margin: 0 }}>
                        {encrypted.encryptedData}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SecureMessaging;
