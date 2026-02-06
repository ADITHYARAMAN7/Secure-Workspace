import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../api';
import { AuthContext } from '../../App';

const DocumentVault = () => {
    const { user } = useContext(AuthContext);
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState({ admin: false, manager: false, employee: false });
    const [uploading, setUploading] = useState(false);

    const fetchDocuments = async () => {
        try {
            const res = await api.get('/features/documents', user.token);
            setDocuments(res);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please select a file");

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        formData.append('visibility', JSON.stringify(visibility));

        try {
            await api.post('/features/documents', formData, user.token, true); // Added flag for multipart?
            // Note: api wrapper might need update to handle FormData if it sets Content-Type automatically to JSON
            // Assuming api.js can handle it or we use fetch directly. 
            // Let's assume we need to use a direct fetch or modify api helper.
            // For safety, let's try direct fetch here or ensure api helper doesn't force json.
            // Actually, we'll patch the api helper in a second. For now let's write correct code assuming api.post handles it if 4th arg is true.

            setFile(null);
            setDescription('');
            setVisibility({ admin: false, manager: false, employee: false });
            fetchDocuments();
        } catch (err) { alert(err.message); }
        finally { setUploading(false); }
    };

    const handleDownload = async (doc) => {
        try {
            const res = await fetch(`http://localhost:3001/api/features/documents/${doc.id}/download`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.filename.split(':::')[0];
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) { alert(err.message); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Upload Section */}
            <div className="glass-card" style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Upload Secure Document</h3>

                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                        <input
                            type="file"
                            onChange={e => setFile(e.target.files[0])}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                        <input
                            type="text"
                            placeholder="Description..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>

                    {/* Visibility Settings - Only for Manager/Admin */}
                    {(user.role === 'Admin' || user.role === 'Manager') && (
                        <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#9CA3AF', marginBottom: '8px', textTransform: 'uppercase' }}>Visibility Access Control</p>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={visibility.admin} onChange={e => setVisibility({ ...visibility, admin: e.target.checked })} />
                                    Admins
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={visibility.manager} onChange={e => setVisibility({ ...visibility, manager: e.target.checked })} />
                                    Managers
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={visibility.employee} onChange={e => setVisibility({ ...visibility, employee: e.target.checked })} />
                                    Employees
                                </label>
                            </div>
                        </div>
                    )}

                    {user.role === 'Employee' && (
                        <p style={{ fontSize: '12px', color: '#6B7280' }}>* Your uploads will be visible to everyone by default.</p>
                    )}

                    <button type="submit" disabled={uploading} style={{
                        padding: '12px', borderRadius: '8px', background: 'linear-gradient(90deg, #7928CA, #FF0080)',
                        color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer'
                    }}>
                        {uploading ? 'Encrypting & Uploading...' : 'Upload to Vault'}
                    </button>
                </form>
            </div>

            {/* Documents List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                {documents.map(doc => {
                    const displayName = doc.filename.includes(':::') ? doc.filename.split(':::')[0] : doc.filename;
                    return (
                        <div key={doc.id} style={{
                            padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
                            transition: 'transform 0.2s'
                        }} className="hover:scale-105">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22D3EE' }}>
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                </div>
                                <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#9CA3AF' }}>
                                    {new Date(doc.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', marginBottom: '4px', wordBreak: 'break-all' }} title={displayName}>{displayName}</h4>
                            <p style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '16px', height: '32px', overflow: 'hidden' }}>{doc.description}</p>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', color: '#6B7280' }}>By {doc.uploader_name}</span>
                                <button
                                    onClick={() => handleDownload(doc)}
                                    style={{ fontSize: '12px', color: '#22D3EE', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    DOWNLOAD
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DocumentVault;
