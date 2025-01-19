import React, { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css';

function Dashboard() {

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!user) {
            navigate("/");
        }
    },[user, navigate]);

    if(!user) {
        return <div>Loading ...</div>
    }

    const handleSignOut = async () => {
        try {
            signOut(auth);
            navigate("/");
        } catch (error) {
            console.log("Error signing out: ", error);
        }
    }

    return (
        <div className="dashboard-container">
            <h1 className="welcome-text">Welcome, {user.displayName}</h1>
            <div>This is the dashboard</div>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    )
}

export default Dashboard;