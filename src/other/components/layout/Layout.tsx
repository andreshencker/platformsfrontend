import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout(){
    return (
        <div style={{minHeight:"100vh", display:"grid", gridTemplateColumns:"240px 1fr"}}>
            <Sidebar />
            <div>
                <Navbar />
                <main style={{padding:"24px 0"}} className="accent-rows">
                    <div className="container">
                        <Outlet />
                    </div>
                </main>
                <footer className="footer">
                    <div className="container row" style={{justifyContent:"space-between"}}>
                        <div className="row" style={{gap:10}}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <circle cx="12" cy="12" r="10" fill="#ffd400"/>
                                <path d="M8.5 12.5h7M12 9v7" stroke="#111119" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                            <strong>Solflare-Style</strong>
                        </div>
                        <div className="row" style={{gap:12}}>
                            <a href="#" className="btn btn-outline">Twitter</a>
                            <a href="#" className="btn btn-outline">GitHub</a>
                            <a href="#" className="btn btn-outline">Contact</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}