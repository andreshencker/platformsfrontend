// src/context/client/components/ClientSidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function ClientSidebar() {
    const Item = ({ to, label }: { to: string; label: string }) => (
        <NavLink
            to={to}
            className="btn btn-outline"
            style={{ display: "block", marginBottom: 8, borderRadius: 10, textAlign: "left" }}
        >
            {label}
        </NavLink>
    );

    return (
        <aside style={{ padding: 16, borderRight: "1px solid var(--border, #20202a)" }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>CLIENT</div>
            <div style={{ marginTop: 12 }}>
                <Item to="/dashboard" label="Dashboard" />
                <Item to="/trades" label="Trades" />
                <Item to="/positions" label="Positions" />
                <Item to="/income" label="Income" />
                <Item to="/settings" label="Clientsettings" />
            </div>
        </aside>
    );
}