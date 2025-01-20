import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Navbar.css';

function Navbar() {

    const [ isOpen, setIsOpen ] = useState(false);

    const toggleNavbar = () => {
        setIsOpen((prev) => !prev);
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">

            </div>
        </nav>
    )
}

export default Navbar;