import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './navbar.css';
import logo from '../assets/loogo.png';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Add this hook for navigation
    const isDashboard = ["/child-dashboard", "/parent-dashboard", "/teacher-dashboard"].includes(location.pathname);

    return (
        !isDashboard && (
            <nav className="navbar">
                <div className="logo-container">
                    <img src={logo} alt="Logo" className="navbar-logo" />
                </div>
                <ul>
                    {location.pathname !== "/login" && (
                        <li>
                            <button className="nav-btn" onClick={() => window.open("/login", "_self")}>
                                LOG IN
                            </button>
                        </li>
                    )}
                    {location.pathname !== "/signup" && (
                        <li>
                            <button className="nav-btn" onClick={() => window.open("/signup", "_self")}>
                                SIGN UP
                            </button>
                        </li>
                    )}
                    <li>
                        <button 
                            className="nav-btn" 
                            onClick={() => navigate('/contact')} // Use navigate instead of window.open
                        >
                            CONTACT US
                        </button>
                    </li>
                </ul>
            </nav>
        )
    );
};

export default Navbar;