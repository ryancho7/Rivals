import React from "react";
import '../styles/Welcome.css';
import { useNavigate } from "react-router-dom";

function Welcome() {

    const navigate = useNavigate();

    return (
        <div className="welcome-container">
          <div className="welcome-content">
            <h1 className="welcome-title">Thanks for Joining the Battle</h1>
            {/* <h1 className="welcome-title">It's Almost Time to Become a <span>Rival</span></h1> */}
            <p className="welcome-subtitle">Ready to challenge your opponents?</p>
            <button className="d-button" onClick={() => navigate('/dashboard')}>
              Enter Rivals
            </button>
          </div>
          <div className="background-animation"></div>
        </div>
      )
}

export default Welcome;