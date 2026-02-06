import React, { useState, useContext } from 'react';
import { AuthContext } from '../../App';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';
import AdminDashboard from './AdminDashboard';
import MessagingInbox from './MessagingInbox';
import DocumentVault from './DocumentVault';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeView, setActiveView] = useState('Dashboard');

    const NavItem = ({ icon, label, viewName }) => (
        <button
            onClick={() => setActiveView(viewName)}
            style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', borderRadius: '12px',
                background: activeView === viewName ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))' : 'transparent',
                color: activeView === viewName ? 'white' : '#9CA3AF', border: 'none', cursor: 'pointer', transition: 'all 0.3s'
            }}
        >
            {icon}
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{label}</span>
        </button>
    );

    const renderContent = () => {
        if (activeView === 'Dashboard') {
            switch (user.role) {
                case 'Admin': return <AdminDashboard />;
                case 'Manager': return <ManagerDashboard />;
                default: return <EmployeeDashboard />;
            }
        }
        if (activeView === 'Inbox') {
            return (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>Secure Inbox</h2>
                    <MessagingInbox />
                </div>
            );
        }
        if (activeView === 'Vault') {
            return (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>Document Vault ({user.role})</h2>
                    <DocumentVault />
                </div>
            );
        }
        if (activeView === 'Security') {
            return (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>Security Settings</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            <div>
                                <p style={{ fontWeight: 'bold', color: 'white', margin: 0 }}>Multi-Factor Authentication</p>
                                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>Additional layer of security for your account.</p>
                            </div>
                            <span style={{ color: '#10B981', fontWeight: 'bold', fontSize: '12px' }}>ENABLED</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            <div>
                                <p style={{ fontWeight: 'bold', color: 'white', margin: 0 }}>Password Rotation</p>
                                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '4px 0 0 0' }}>Last changed: 3 days ago</p>
                            </div>
                            <button style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Change</button>
                        </div>
                    </div>
                </div>
            );
        }
        return <div style={{ color: 'white' }}>View not found</div>;
    };

    return (
        <div style={{ minHeight: '100vh', background: '#030014', display: 'flex', color: 'white' }}>
            <aside style={{
                width: '280px', height: '100vh', position: 'fixed', left: 0, top: 0, background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column'
            }} className="hidden lg:flex">
                <div style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #7928CA, #FF0080)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px 0 rgba(121, 40, 202, 0.3)'
                        }}>
                            <span style={{ fontWeight: 'bold', color: 'white', fontSize: '20px' }}>W</span>
                        </div>
                        <div>
                            <span style={{ fontWeight: 'bold', fontSize: '24px', color: 'white' }}>Work</span>
                            <span style={{ fontWeight: 'bold', fontSize: '24px', color: '#EC4899' }}>Station</span>
                        </div>
                    </div>
                </div>

                <nav style={{ padding: '0 16px', flex: 1 }}>
                    <p style={{ padding: '0 16px', fontSize: '12px', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>Main Menu</p>
                    <NavItem viewName="Dashboard" icon={<HomeIcon />} label="Dashboard" />
                    <NavItem viewName="Inbox" icon={<InboxIcon />} label="Inbox" />
                    <NavItem viewName="Vault" icon={<FileIcon />} label="Vault" />

                    <p style={{ padding: '0 16px', fontSize: '12px', fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', marginTop: '32px', marginBottom: '8px' }}>System</p>
                    <NavItem viewName="Security" icon={<ShieldIcon />} label="Security" />
                </nav>

                <div style={{ padding: '16px', margin: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                            {user.username.charAt(0)}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{user.username}</p>
                            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>{user.role}</p>
                        </div>
                    </div>
                    <button onClick={logout} style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#F87171', fontSize: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                        LOGOUT
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: '280px', padding: '32px', minHeight: '100vh', position: 'relative' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                            {activeView === 'Dashboard' ? `Hello, ${user.username}` : activeView}
                        </h1>
                        <p style={{ color: '#9CA3AF', margin: 0 }}>
                            {activeView === 'Dashboard' ? 'Welcome to your secure command center.' : `Manage your ${activeView.toLowerCase()}.`}
                        </p>
                    </div>
                </header>

                {renderContent()}
            </main>
        </div>
    );
};

// Icons (Same as before)
const HomeIcon = () => <svg width="20" height="20" style={{ minWidth: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const InboxIcon = () => <svg width="20" height="20" style={{ minWidth: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>;
const FileIcon = () => <svg width="20" height="20" style={{ minWidth: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const ShieldIcon = () => <svg width="20" height="20" style={{ minWidth: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;

export default Dashboard;
