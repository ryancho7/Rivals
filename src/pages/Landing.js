import React from "react";
import { FcGoogle } from "react-icons/fc";
import '../styles/Landing.css'

function Landing() {
    return (
        <div className="main-container">
            {/* <h1 className="header">Marvel Rivals Just <span>Got Better</span></h1> */}
            <h1 className="header">Welcome to <span>Rivals</span></h1>
            <p className="subheader">Enter the ultimate battleground where heroes and villains report each other.</p>
            <button className="login-button"><FcGoogle className="google-icon" size={24}/>Continue with Google</button>
        </div>
    )
}

export default Landing;