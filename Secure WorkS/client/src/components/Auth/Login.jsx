import React, { useState, useContext } from 'react';
import { api } from '../../api';
import { AuthContext } from '../../App';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [mfaCode, setMfaCode] = useState('');
    const [tempToken, setTempToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', formData);
            if (res.mfaRequired) {
                setTempToken(res.tempToken);
                setStep(2);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMfa = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/verify-mfa', { tempToken, code: mfaCode });

            // Safe fallbacks to prevent crash
            const userEmail = res.email || 'user@secure.ai';
            const username = userEmail.includes('@') ? userEmail.split('@')[0] : 'User';

            login({
                role: res.role,
                token: res.accessToken,
                username: username,
                email: userEmail,
                id: res.id
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#030014',
            position: 'relative',
            overflow: 'hidden'
        }} className="bg-aurora-bg">

            {/* Fallback Background if Tailwind fails */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'rgba(139, 92, 246, 0.3)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'rgba(236, 72, 153, 0.3)', filter: 'blur(100px)', borderRadius: '50%' }}></div>
            </div>

            <div className="glass-card" style={{
                padding: '40px',
                width: '100%',
                maxWidth: '400px',
                position: 'relative',
                zIndex: 10,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{
                        width: '48px', height: '48px', margin: '0 auto 16px',
                        background: 'linear-gradient(135deg, #7928CA, #FF0080)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>S</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>Welcome Back</h1>
                    <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '8px' }}>Enter your credentials to access the secure vault.</p>
                </div>

                {error && (
                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#F87171', borderRadius: '8px', marginBottom: '20px', fontSize: '12px' }}>
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <input
                                type="email"
                                className="input-elite"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                className="input-elite"
                                placeholder="Password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-gradient" style={{
                            width: '100%', padding: '12px', borderRadius: '12px',
                            background: 'linear-gradient(90deg, #7928CA, #FF0080)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer'
                        }} disabled={loading}>
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '12px', color: '#6B7280', marginTop: '20px' }}>
                            New Personnel? <Link to="/register" style={{ color: '#EC4899', fontWeight: 'bold', textDecoration: 'none' }}>Register Access</Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleMfa} style={{ textAlign: 'center' }}>
                        <h3 style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>2-Step Verification</h3>
                        <input
                            type="text"
                            placeholder="000000"
                            value={mfaCode}
                            onChange={e => setMfaCode(e.target.value)}
                            style={{ width: '100%', padding: '16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'center', fontSize: '24px', letterSpacing: '8px', marginBottom: '20px' }}
                        />
                        <button type="submit" className="btn-gradient" style={{
                            width: '100%', padding: '12px', borderRadius: '12px',
                            background: 'linear-gradient(90deg, #7928CA, #FF0080)', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer'
                        }} disabled={loading}>
                            Verify & Access
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
