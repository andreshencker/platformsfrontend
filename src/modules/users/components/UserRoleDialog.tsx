import React, { useState } from 'react';
import type { UserRole, User } from '../types/user';

type Props = {
    open: boolean;
    user?: User | null;
    onClose: () => void;
    onSubmit: (role: UserRole) => Promise<void>;
};

export default function UserRoleDialog({ open, user, onClose, onSubmit }: Props) {
    const [role, setRole] = useState<UserRole>('client');

    React.useEffect(() => {
        if (user) setRole(user.role);
    }, [user]);

    if (!open || !user) return null;

    return (
        <div role="dialog" aria-modal="true" style={backdrop}>
            <div className="card" style={modal}>
                <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                    <strong style={{ color: '#E6E6E6' }}>Change role</strong>
                    <button onClick={onClose} className="btn" style={btnClose} aria-label="Close dialog">✕</button>
                </div>

                <p style={{ color: 'var(--muted)', marginBottom: 12 }}>
                    {user.email}
                </p>

                <label style={{ color: '#E6E6E6', display: 'block', marginBottom: 8 }}>Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    style={select}
                >
                    <option value="admin">admin</option>
                    <option value="client">client</option>
                </select>

                <div className="row" style={{ justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                    <button className="btn" onClick={onClose} style={btnGhost}>Cancel</button>
                    <button
                        className="btn"
                        onClick={() => onSubmit(role)}
                        style={btnPrimary}
                    >
                        Save
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
    width: 420, padding: 16, border: '1px solid #22242A', background: '#111214', borderRadius: 14,
    boxShadow: '0 16px 48px rgba(0,0,0,0.6)'
};
const select: React.CSSProperties = {
    width: '100%', padding: '10px 12px', background: '#1A1B1F', color: '#E6E6E6',
    border: '1px solid #22242A', borderRadius: 10
};
const btnPrimary: React.CSSProperties = {
    background: 'var(--yellow)', color: '#111214', border: '1px solid #D5A90A', borderRadius: 12, padding: '10px 14px'
};
const btnGhost: React.CSSProperties = {
    background: '#1A1B1F', color: '#E6E6E6', border: '1px solid #22242A', borderRadius: 12, padding: '10px 14px'
};
const btnClose: React.CSSProperties = {
    background: '#1A1B1F', color: '#E6E6E6', border: '1px solid #22242A', borderRadius: 10, padding: '6px 10px'
};