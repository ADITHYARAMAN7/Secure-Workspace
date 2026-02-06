import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../api';
import { AuthContext } from '../../App';

const MessagingInbox = () => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [targetType, setTargetType] = useState('individual'); // 'individual' or 'group'
    const [selectedTarget, setSelectedTarget] = useState('');
    const [sending, setSending] = useState(false);

    // Fetch Contacts & Messages
    useEffect(() => {
        const fetchData = async () => {
            try {
                const contactsRes = await api.get('/features/users/contacts', user.token);
                setContacts(contactsRes);

                const msgsRes = await api.get('/features/messages', user.token);
                setMessages(msgsRes);
            } catch (err) { console.error(err); }
        };
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [user.token]);

    const handleSend = async () => {
        if (!messageText || !selectedTarget) return;
        setSending(true);
        try {
            const payload = {
                content: messageText,
                recipient_id: targetType === 'individual' ? selectedTarget : null,
                recipient_group: targetType === 'group' ? selectedTarget : null
            };
            await api.post('/features/messages', payload, user.token);
            setMessageText('');
            // Refresh
            const msgsRes = await api.get('/features/messages', user.token);
            setMessages(msgsRes);
        } catch (err) { alert(err.message); }
        finally { setSending(false); }
    };

    // Determine Group Options based on Role
    const getGroupOptions = () => {
        const options = [];
        if (user.role === 'Admin') {
            options.push({ value: 'all_managers', label: 'All Managers' });
            options.push({ value: 'all_employees', label: 'All Employees' }); // Admin sees all
        } else if (user.role === 'Manager') {
            options.push({ value: 'all_employees', label: 'All Employees' });
            options.push({ value: 'all_admins', label: 'All Admins' });
        } else if (user.role === 'Employee') {
            options.push({ value: 'all_managers', label: 'All Managers' });
        }
        return options;
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px' }}>

            {/* Compose Area */}
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', height: 'fit-content' }}>
                <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '20px' }}>Compose Message</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Switcher */}
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
                        <button
                            onClick={() => { setTargetType('individual'); setSelectedTarget(''); }}
                            style={{
                                flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                                background: targetType === 'individual' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: targetType === 'individual' ? 'white' : '#6B7280'
                            }}>
                            Individual
                        </button>
                        <button
                            onClick={() => { setTargetType('group'); setSelectedTarget(''); }}
                            style={{
                                flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                                background: targetType === 'group' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: targetType === 'group' ? 'white' : '#6B7280'
                            }}>
                            Group Broadcast
                        </button>
                    </div>

                    {/* Target Select */}
                    <div>
                        <label style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>RECIPIENT</label>
                        <select
                            value={selectedTarget}
                            onChange={e => setSelectedTarget(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'black', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px' }}
                        >
                            <option value="">Select Target...</option>
                            {targetType === 'individual' ? (
                                contacts.map(c => <option key={c.id} value={c.id}>{c.username} ({c.role})</option>)
                            ) : (
                                getGroupOptions().map(g => <option key={g.value} value={g.value}>{g.label}</option>)
                            )}
                        </select>
                    </div>

                    {/* Message Body */}
                    <div>
                        <textarea
                            value={messageText}
                            onChange={e => setMessageText(e.target.value)}
                            placeholder="Type your secure message..."
                            style={{ width: '100%', height: '150px', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '8px', resize: 'none' }}
                        />
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={sending}
                        style={{
                            width: '100%', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'white',
                            background: sending ? '#4B5563' : 'linear-gradient(90deg, #10B981, #059669)'
                        }}>
                        {sending ? 'Sending...' : 'Send Secure Message'}
                    </button>
                </div>
            </div>

            {/* Inbox List */}
            <div>
                <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '20px' }}>Inbox ({messages.length})</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {messages.map(msg => (
                        <div key={msg.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', color: 'white' }}>{msg.sender_name}</span>
                                    <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px', color: '#9CA3AF' }}>{msg.sender_role}</span>
                                    {msg.recipient_group && <span style={{ fontSize: '10px', background: 'rgba(124, 58, 237, 0.2)', color: '#A78BFA', padding: '2px 8px', borderRadius: '10px' }}>GROUP: {msg.recipient_group.replace('_', ' ').toUpperCase()}</span>}
                                </div>
                                <span style={{ fontSize: '12px', color: '#6B7280' }}>{new Date(msg.created_at).toLocaleString()}</span>
                            </div>
                            <p style={{ color: '#E5E7EB', lineHeight: '1.5' }}>{msg.content}</p>
                        </div>
                    ))}
                    {messages.length === 0 && <p style={{ color: '#6B7280' }}>No secure messages received.</p>}
                </div>
            </div>

        </div>
    );
};

export default MessagingInbox;
