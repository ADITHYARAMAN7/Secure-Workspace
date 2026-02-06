import React, { useState } from 'react';
import { api } from '../../api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-aurora-bg">
            <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] animate-blob"></div>
            <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>

            <div className="glass-card p-10 w-full max-w-md relative z-10 backdrop-blur-2xl bg-black/40 border-white/10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-1">Initialize ID</h1>
                    <p className="text-gray-500 text-xs uppercase tracking-widest">Secure Access Protocol</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Full Identity</label>
                        <input
                            type="text"
                            className="input-elite"
                            placeholder="John Doe"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Comms Channel</label>
                        <input
                            type="email"
                            className="input-elite"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <p className="text-[10px] text-gray-600 mt-1 ml-1">
                            * Roles assigned by email domain (admin, manager)
                        </p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">Passcode</label>
                        <input
                            type="password"
                            className="input-elite"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-gradient w-full mt-4" disabled={loading}>
                        {loading ? 'Processing...' : 'Create Credentials'}
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-gray-500">
                    Already operational? <Link to="/login" className="text-primary hover:text-white transition font-bold">Login Here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
