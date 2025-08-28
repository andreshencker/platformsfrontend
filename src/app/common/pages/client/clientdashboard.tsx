import { Link } from "react-router-dom";

export default function ClientDashboard() {
    return (
        <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
            <div className="auth-card">
                <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                    <span className="badge badge-yellow">CLIENT</span>
                    <Link to="/settings" className="btn btn-outline">Settings</Link>
                </div>

                <h2 className="h2 mt-3">Client Dashboard</h2>
                <p className="muted mt-1">Vista principal para usuarios con rol <strong>client</strong>.</p>
            </div>
        </div>
    );
}