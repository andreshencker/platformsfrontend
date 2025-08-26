import { Link } from "react-router-dom";

export default function PublicFooter() {
    return (
        <footer className="footer">
            <div
                className="container row"
                style={{ justifyContent: "space-between", color: "var(--muted)" }}
            >
                <div>© {new Date().getFullYear()} Binance Dashboard</div>

                <nav className="row">
                    <Link className="link" to="#">
                        Privacy
                    </Link>
                    <Link className="link" to="#">
                        Terms
                    </Link>
                    <Link className="link" to="#">
                        Contact
                    </Link>
                </nav>
            </div>
        </footer>
    );
}