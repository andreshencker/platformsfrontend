import React, { useState } from 'react';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }) => Promise<void>;
};

export default function CreateAdminDialog({ open, onClose, onSubmit }: Props) {
    const [firstName, setFirst] = useState('');
    const [lastName, setLast] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');

    if (!open) return null;

    return (
        <div role="dialog" aria-modal="true" style={backdrop}>
            <div className="card" style={modal}>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong style={{ color: '#E6E6E6' }}>Create admin</strong>
                    <button onClick={onClose} className="btn" style={btnClose} aria-label="Close dialog">✕</button>
                </div>

                <div className="grid" style={{ gap: 10 }}>
                    <div>
                        <label style={label}>First name</label>
                        <input value={firstName} onChange={e=>setFirst(e.target.value)} style={input} />
                    </div>
                    <div>
                        <label style={label}>Last name</label>
                        <input value={lastName} onChange={e=>setLast(e.target.value)} style={input} />
                    </div>
                    <div>
                        <label style={label}>Email</label>
                        <input value={email} onChange={e=>setEmail(e.target.value)} style={input} />
                    </div>
                    <div>
                        <label style={label}>Password</label>
                        <input type="password" value={password} onChange={e=>setPass(e.target.value)} style={input} />
                    </div>
                </div>

                <div className="row" style={{ justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                    <button className="btn" onClick={onClose} style={btnGhost}>Cancel</button>
                    <button
                        className="btn"
                        onClick={() => onSubmit({ firstName, lastName, email, password })}
                        style={btnPrimary}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

const backdrop: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 50
};
const modal: React.CSSProperties = {
    width: 520, padding: 16, border: '1px solid #22242A', background: '#111214', borderRadius: 14,
    boxShadow: '0 16px 48px rgba(0,0,0,0.6)'
};
const input: React.CSSProperties = {
    width: '100%', padding: '10px 12px', background: '#1A1B1F', color: '#E6E6E6',
    border: '1px solid #22242A', borderRadius: 10
};
const label: React.CSSProperties = { color: '#E6E6E6', display: 'block', marginBottom: 6 };
const btnPrimary: React.CSSProperties = {
    background: 'var(--yellow)', color: '#111214', border: '1px solid #D5A90A', borderRadius: 12, padding: '10px 14px'
};
const btnGhost: React.CSSProperties = {
    background: '#1A1B1F', color: '#E6E6E6', border: '1px solid #22242A', borderRadius: 12, padding: '10px 14px'
};
const btnClose: React.CSSProperties = {
    background: '#1A1B1F', color: '#E6E6E6', border: '1px solid #22242A', borderRadius: 10, padding: '6px 10px'
};