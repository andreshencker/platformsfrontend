import React from 'react';
import type { User } from '../types/user';

type Props = {
    users: User[];
    onChangeRole: (u: User) => void;
};

export default function UsersTable({ users, onChangeRole }: Props) {
    return (
        <div className="card" style={{ padding: 16, border: '1px solid #22242A', background: '#121316' }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
                <strong style={{ color: '#E6E6E6' }}>Users</strong>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ color: 'var(--muted)' }}>
                    <tr>
                        <th style={th}>Name</th>
                        <th style={th}>Email</th>
                        <th style={th}>Role</th>
                        <th style={th}>Status</th>
                        <th style={th}>Created</th>
                        <th style={th}></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr key={u.id} style={{ borderTop: '1px solid #1b1d22' }}>
                            <td style={td}>{u.firstName} {u.lastName}</td>
                            <td style={td}>{u.email}</td>
                            <td style={td}>
                  <span className="badge" style={{
                      background: u.role === 'admin' ? 'rgba(240,185,11,0.1)' : '#1A1B1F',
                      color: u.role === 'admin' ? '#F0B90B' : '#E6E6E6',
                      padding: '4px 8px', borderRadius: 8, border: '1px solid #22242A'
                  }}>
                    {u.role}
                  </span>
                            </td>
                            <td style={td}>{u.status}</td>
                            <td style={td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td style={{ ...td, textAlign: 'right' }}>
                                <button
                                    className="btn"
                                    onClick={() => onChangeRole(u)}
                                    style={btnGhost}
                                    aria-label={`Change role for ${u.email}`}
                                >
                                    Change role
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ ...td, color: 'var(--muted)', textAlign: 'center', padding: 32 }}>
                                No users found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const th: React.CSSProperties = { textAlign: 'left', padding: '10px 8px', fontWeight: 600 };
const td: React.CSSProperties = { padding: '12px 8px', color: '#E6E6E6' };
const btnGhost: React.CSSProperties = {
    background: '#1A1B1F',
    color: '#E6E6E6',
    border: '1px solid #22242A',
    borderRadius: 10,
    padding: '8px 12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.45)'
};