import { Link } from "react-router-dom";

export default function Sidebar(){
    return (
        <aside className="sidebar">
            <div className="row" style={{justifyContent:"space-between"}}>
                <strong>Navigation</strong>
            </div>
            <div className="spacer"></div>
            <nav className="grid" style={{gap:10}}>
                <Link to="/" className="btn btn-outline" style={{width:"100%"}}>Dashboard</Link>
                <Link to="/trades" className="btn btn-outline" style={{width:"100%"}}>Trades</Link>
                <Link to="/positions" className="btn btn-outline" style={{width:"100%"}}>Positions</Link>
                <Link to="/income" className="btn btn-outline" style={{width:"100%"}}>Income</Link>
                <Link to="/settings" className="btn btn-outline" style={{width:"100%"}}>Settings</Link>
            </nav>
        </aside>
    );
}