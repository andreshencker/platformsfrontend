import React from "react";
import UserPlatformsList from "../components/UserPlatformsList";

export default function UserPlatformsPage() {
    return (
        <section className="section container">
            <h1 className="h1">Your Platforms</h1>
            <p className="lead">Manage, disconnect or reconnect your linked platforms.</p>

            <div className="spacer" />
            <UserPlatformsList onManage={(up) => console.log("Manage", up)} />
        </section>
    );
}