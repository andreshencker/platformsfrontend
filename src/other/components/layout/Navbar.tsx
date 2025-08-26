import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/other/hooks/useAuth";

export default function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    async function handleLogout() {
        try {
            await logout(); // limpia token/usuario según tu hook
        } finally {
            // por si quedan restos antiguos
            try {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } catch {}
            navigate("/login", { replace: true });
        }
    }

    return (
        <header className="header">
            <div className="container nav">
                <Link to="/" className="row" aria-label="Home">
                    {/* Logo simple: llave/moneda estilo sólido */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle cx="12" cy="12" r="10" fill="#ffd400" />
                        <path d="M8.5 12.5h7M12 9v7" stroke="#111119" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <strong style={{ fontSize: 16 }}>Solflare-Style</strong>
                </Link>

                <nav className="row" style={{ gap: 18 }}>
                    {[
                        ["Dashboard", "/"],
                        ["Trades", "/trades"],
                        ["Positions", "/positions"],
                        ["Income", "/income"],
                        ["Clientsettings", "/settings"],
                    ].map(([label, to]) => (
                        <NavLink
                            key={label}
                            to={to}
                            className={({ isActive }) => (isActive ? "btn btn-outline" : "btn btn-outline")}
                            style={{ padding: "10px 16px", borderRadius: 999 }}
                        >
                            {label}
                        </NavLink>
                    ))}

                    {/* Misma estructura y estilos del CTA original, pero ahora ejecuta logout */}
                    <button type="button" className="btn btn-primary" onClick={handleLogout}>
                        Log out
                    </button>
                </nav>
            </div>
        </header>
    );
}