import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../api';
import { AuthContext } from '../../App';

const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);
    const [assignments, setAssignments] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [checkInStatus, setCheckInStatus] = useState(null);

    const fetchAssignments = async () => {
        try {
            const res = await api.get('/features/assignments', user.token);
            setAssignments(res);
        } catch (err) { console.error(err); }
    };

    const fetchAttendance = async () => {
        try {
            const res = await api.get('/features/attendance/my', user.token);
            setAttendance(res);
            const today = new Date().toISOString().split('T')[0];
            const todayRecord = res.find(r => r.date === today);
            if (todayRecord) setCheckInStatus(todayRecord.check_in_time);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchAssignments();
        fetchAttendance();
    }, []);

    const handleCheckIn = async () => {
        try {
            const res = await api.post('/features/attendance/checkin', {}, user.token);
            setCheckInStatus(res.time);
            fetchAttendance();
        } catch (err) { alert(err.message); }
    };

    const AssignmentCard = ({ work }) => (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.3s ease',
            height: '100%'
        }} className="hover:scale-[1.02]">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>{work.title}</h3>
                    <p style={{ fontSize: '12px', color: '#9CA3AF' }}>Assigned by {work.assigned_by_name}</p>
                </div>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7928CA, #FF0080)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 'bold', color: 'white'
                }}>
                    {work.assigned_by_name ? work.assigned_by_name.charAt(0).toUpperCase() : '?'}
                </div>
            </div>

            <p style={{ fontSize: '14px', color: '#D1D5DB', marginBottom: '24px', lineHeight: '1.6' }}>{work.description}</p>

            <div style={{
                background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px',
                border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
                <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '8px', borderRadius: '8px', color: '#A78BFA' }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', margin: 0 }}>briefing_doc.pdf</p>
                    <p style={{ fontSize: '10px', color: '#9CA3AF', margin: 0 }}>ENCRYPTED</p>
                </div>
                <button style={{ fontSize: '12px', color: '#EC4899', background: 'transparent', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>ACCESS</button>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '32px' }}>
            {/* Left Col: Attendance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px', padding: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        background: 'rgba(0,0,0,0.2)', borderRadius: '20px', padding: '32px', textAlign: 'center', height: '100%',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'
                    }}>
                        <h3 style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>Attendance Tracker</h3>

                        {checkInStatus ? (
                            <div>
                                <div style={{ fontSize: '48px', fontWeight: 'bold', background: 'linear-gradient(90deg, #34D399, #059669)', backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', marginBottom: '8px' }}>
                                    {checkInStatus.substring(0, 5)}
                                </div>
                                <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '12px', fontWeight: 'bold' }}>
                                    CHECKED IN
                                </div>
                            </div>
                        ) : (
                            <button onClick={handleCheckIn} style={{
                                width: '140px', height: '140px', borderRadius: '50%', border: 'none', cursor: 'pointer',
                                background: 'linear-gradient(135deg, #7928CA, #FF0080)', padding: '2px',
                                transition: 'transform 0.2s'
                            }} className="hover:scale-105">
                                <div style={{
                                    width: '100%', height: '100%', borderRadius: '50%', background: '#030014',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>TAP</span>
                                    <span style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase' }}>to Check-in</span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '4px', height: '16px', background: 'linear-gradient(to bottom, #7928CA, #FF0080)', borderRadius: '4px' }}></span>
                        Recent Activity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {attendance.slice(0, 4).map(r => (
                            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '14px', color: '#D1D5DB' }}>{r.date}</span>
                                <span style={{ fontSize: '12px', color: '#EC4899', fontFamily: 'monospace' }}>{r.check_in_time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Col: Missions */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '24px' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>Active Missions</h2>
                        <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '4px 0 0 0' }}>Classified Assignments & Assets</p>
                    </div>
                    <div style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)', color: '#EC4899', fontSize: '10px', fontWeight: 'bold' }}>
                        {assignments.length} PENDING
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {assignments.map(work => <AssignmentCard key={work.id} work={work} />)}

                    {assignments.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: '40px', borderRadius: '16px', border: '2px dashed rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#4B5563' }}>
                                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>All Clear</h3>
                            <p style={{ fontSize: '14px', color: '#6B7280' }}>No active missions on your radar.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
