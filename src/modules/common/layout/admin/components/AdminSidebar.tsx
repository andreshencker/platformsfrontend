import React from "react";
import { NavLink } from "react-router-dom";

const itemStyle =
    "block rounded-xl px-3 py-2 text-sm border border-transparent hover:border-[#2D2F36] hover:bg-[#16181D] transition";
const activeStyle =
    "bg-[#16181D] border border-[#2D2F36] text-[#F0B90B]";

export default function AdminSidebar() {
    return (
        <nav className="bg-[#111214] border border-[#22242A] rounded-2xl p-4">
            <div className="text-xs uppercase tracking-wider text-[#8C8C8C] mb-3">
                Administration
            </div>

            <ul className="space-y-1">
                <li>
                    <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) => `${itemStyle} ${isActive ? activeStyle : "text-[#E6E6E6]"}`}
                        end
                    >
                        Dashboard
                    </NavLink>
                </li>

          \
                <li>
                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) => `${itemStyle} ${isActive ? activeStyle : "text-[#E6E6E6]"}`}
                    >
                        Settings
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}