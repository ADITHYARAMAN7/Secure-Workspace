import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../api';
import { AuthContext } from '../../App';
import SecureMessaging from './SecureMessaging';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [projectCount, setProjectCount] = useState(0);

    // Fetch assignments to use as "Ongoing Projects" count
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/features/assignments', user.token);
                setProjectCount(res.length || 12); // Fallback to 12 if 0 for demo
            } catch (err) {
                setProjectCount(12); // Demo data
            }
        };
        fetchStats();
    }, []);

    const StatsCard = ({ title, value, subtext, gradient }) => (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px',
                background: gradient
            }}></div>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '8px' }}>{title}</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>{value}</p>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>{subtext}</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* Business Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <StatsCard
                    title="Ongoing Projects"
                    value={projectCount}
                    subtext="+2 launched this week"
                    gradient="linear-gradient(to bottom, #7928CA, #FF0080)"
                />
                <StatsCard
                    title="Pending Client Meetings"
                    value="5"
                    subtext="Next: Tomorrow, 10:00 AM"
                    gradient="linear-gradient(to bottom, #06B6D4, #3B82F6)"
                />
                <StatsCard
                    title="Projected Revenue"
                    value="$124.5k"
                    subtext="Q1 Performance: On Track"
                    gradient="linear-gradient(to bottom, #10B981, #34D399)"
                />
            </div>

            {/* Content Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>

                {/* Meeting Schedule */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></span>
                        Upcoming Meetings
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {['Client Sync: Alpha Corp', 'Budget Review: Internal', 'Discovery Call: New Lead'].map((meeting, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                <div>
                                    <p style={{ fontWeight: 'bold', color: 'white', margin: 0, fontSize: '14px' }}>{meeting}</p>
                                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0 0' }}>Today, {10 + i}:00 AM • Zoom</p>
                                </div>
                                <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', fontSize: '12px', cursor: 'pointer' }}>
                                    Join
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Secure Messaging */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></span>
                        Secure Communicator
                    </h3>
                    <SecureMessaging />
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
