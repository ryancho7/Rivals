import React from "react";
import '../styles/Thanks.css';
import { useNavigate } from "react-router-dom";

function Thanks() {

    const navigate = useNavigate();

    return (
        <div className="thanks-container">
            <div className="thanks-card">
                <h1 className="thanks-title">Thank You!</h1>
                <p className="thanks-message">Your report has been successfully submitted. We appreciate your hard work but Woojae probably reported more than you. </p>
                <button className="back-button" onClick={() => navigate("/dashboard")}>Back to Home</button>
            </div>
        </div>
    );
}

export default Thanks;