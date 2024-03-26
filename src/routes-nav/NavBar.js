import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNavicon } from "@fortawesome/free-solid-svg-icons";
import "./NavBar.css";


/** Navigation bar for site. Shows on every page.
 * 
 * When user is logged in, links to the main areas of site are shown.
 * When not logged in, links to the login and signup forms are shown.
 */ 

function NavBar({ logout }) {
    const { currentUser } = useContext(UserContext);
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const toggleDropdown = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const closeNavbar = () => {
        setIsNavbarOpen(false);
    };

    const loggedInNav = () => {
        return (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown mr-4">
                    <NavLink
                        className="nav-link dropdown-toggle"
                        data-toggle="dropdown"
                        id="recipesDropdown"
                        to="#"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        Recipes
                    </NavLink>
                    <div className="dropdown-menu" aria-labelledby="recipesDropdown">
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/meals" onClick={closeNavbar}>
                                Meals
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/drinks" onClick={closeNavbar}>
                                Drinks
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/meals/categories" onClick={closeNavbar}>
                                Meal Categories
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/drinks/categories" onClick={closeNavbar}>
                                Drink Categories
                            </NavLink>
                        </div>
                    </div>
                </li>
                <li className="nav-item dropdown mr-4">
                    <NavLink
                        className="nav-link dropdown-toggle"
                        data-toggle="dropdown"
                        id="personalDropdown"
                        to="#"
                        role="button"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        Personal
                    </NavLink>
                    <div className="dropdown-menu" aria-labelledby="personalDropdown">
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/create/meals" onClick={closeNavbar}>
                                Create Meal
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/create/drinks" onClick={closeNavbar}>
                                Create Drink
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/meals/personal" onClick={closeNavbar}>
                                Personal Meals
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/drinks/personal" onClick={closeNavbar}>
                                Personal Drinks
                            </NavLink>
                        </div>
                    </div>
                </li>
                <li className="nav-item mr-4">
                    <NavLink className="nav-link" to="/profile" onClick={closeNavbar}>
                        Profile
                    </NavLink>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/" onClick={() => { logout(); closeNavbar(); }}>
                        Logout
                    </Link>
                </li>
            </ul>
        );
    };

    const loggedOutNav = () => {
        return (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item mr-4">
                    <NavLink className="nav-link" to="/login" onClick={closeNavbar}>
                        Login
                    </NavLink>
                </li>
                <li className="nav-item mr-4">
                    <NavLink className="nav-link" to="/signup" onClick={closeNavbar}>
                        Sign Up
                    </NavLink>
                </li>
            </ul>
        );
    };

    return (
        <nav className="NavBar navbar navbar-expand-lg d-flex justify-content-between">
            <Link className="navbar-brand ml-2 pb-0 pt-0" to="/" onClick={closeNavbar}>
                DreamHost
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                onClick={toggleDropdown}
                aria-expanded={isNavbarOpen ? "true" : "false"}
                aria-label="Toggle navigation"
            >
                <FontAwesomeIcon icon={faNavicon} className="navbar-toggler-icon" style={{color: 'rgb(110, 66, 66)'}} />
            </button>
            <div className={`collapse navbar-collapse ${isNavbarOpen ? "show" : ""}`}>
                {currentUser ? loggedInNav() : loggedOutNav()}
            </div>
        </nav>
    );
}

export default NavBar;