import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../api';
import { AuthContext } from '../../App';

const ManagerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', assigned_to: '' });

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/features/employees/status', user.token);
            setEmployees(res);
            if (res.length > 0 && !newAssignment.assigned_to) {
                setNewAssignment(prev => ({ ...prev, assigned_to: res[0].id }));
            }
        } catch (err) { console.error(err); }
    };

    const fetchMyAssignments = async () => {
        try {
            const res = await api.get('/features/assignments', user.token);
            setAssignments(res);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchEmployees();
        fetchMyAssignments();
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post('/features/assignments', newAssignment, user.token);
            setNewAssignment({ title: '', description: '', assigned_to: employees[0]?.id || '' });
            fetchMyAssignments();
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>

            {/* Squad Status */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3" style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    Squad Status
                </h2>

                <div className="glass-card overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', overflow: 'hidden' }}>
                    <table className="w-full text-left" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase' }}>Operative</th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px', fontSize: '12px', fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase' }}>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: 'bold', color: 'white' }}>{emp.username}</div>
                                        <div style={{ fontSize: '12px', color: '#EC4899' }}>{emp.email}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '99px', fontSize: '10px', fontWeight: 'bold',
                                            background: emp.status === 'Present' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)',
                                            color: emp.status === 'Present' ? '#4ADE80' : '#F87171'
                                        }}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', fontFamily: 'monospace', color: '#9CA3AF' }}>{emp.check_in_time || '--:--'}</td>
                                </tr>
                            ))}
                            {employees.length === 0 && (
                                <tr><td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: '#6B7280' }}>No operatives online.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assignment Hub */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="glass-card" style={{ padding: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', position: 'relative' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: 'linear-gradient(90deg, #7928CA, #FF0080)', borderRadius: '4px', padding: '4px', display: 'flex' }}>
                            <svg style={{ width: '16px', height: '16px', color: 'white' }} width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        </span>
                        Initialize Mission
                    </h3>

                    <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Target</label>
                                <select
                                    value={newAssignment.assigned_to}
                                    onChange={e => setNewAssignment({ ...newAssignment, assigned_to: e.target.value })}
                                    style={{ width: '100%', background: '#000', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px', borderRadius: '8px' }}
                                >
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.username}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Codename</label>
                                <input
                                    type="text"
                                    value={newAssignment.title}
                                    onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                    placeholder="Operation X"
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Directives</label>
                            <textarea
                                value={newAssignment.description}
                                onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                placeholder="Mission parameters..."
                                style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: '8px', resize: 'none' }}
                            />
                        </div>

                        <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'linear-gradient(90deg, #7928CA, #FF0080)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(121, 40, 202, 0.3)' }}>
                            DEPLOY ORDER
                        </button>
                    </form>
                </div>

                <div>
                    <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Deployment Log</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {assignments.map(a => (
                            <div key={a.id} style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ fontWeight: 'bold', color: 'white', margin: 0 }}>{a.title}</h4>
                                    <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>To: <span style={{ color: '#EC4899' }}>{a.assigned_to_name}</span></p>
                                </div>
                                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#4B5563', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px' }}>{new Date(a.created_at).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ManagerDashboard;
