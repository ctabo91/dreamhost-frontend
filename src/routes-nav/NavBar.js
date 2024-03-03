import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import "./NavBar.css";


/** Navigation bar for site. Shows on every page.
 * 
 * When user is logged in, links to the main areas of site are shown.
 * When not logged in, links to the login and signup forms are shown.
 */ 

function NavBar({ logout }) {
    const { currentUser } = useContext(UserContext);

    const loggeInNav = () => {
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
                            <NavLink className="nav-link pr-0" to="/recipes/meals">
                                Meals
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/drinks">
                                Drinks
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/meals/categories">
                                Meal Categories
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/drinks/categories">
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
                            <NavLink className="nav-link pr-0" to="/recipes/create/meals">
                                Create Meal
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/create/drinks">
                                Create Drink
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/meals/personal">
                                Personal Meals
                            </NavLink>
                        </div>
                        <div className="dropdown-item-container">
                            <NavLink className="nav-link pr-0" to="/recipes/drinks/personal">
                                Personal Drinks
                            </NavLink>
                        </div>
                    </div>
                </li>
                <li className="nav-item mr-4">
                    <NavLink className="nav-link" to="/profile">
                        Profile
                    </NavLink>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/" onClick={logout}>
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
                    <NavLink className="nav-link" to="/login">
                        Login
                    </NavLink>
                </li>
                <li className="nav-item mr-4">
                    <NavLink className="nav-link" to="/signup">
                        Sign Up
                    </NavLink>
                </li>
            </ul>
        );
    };

    return (
        <div className="container">
            <nav className="NavBar navbar navbar-expand-lg d-flex justify-content-between">
                <Link className="navbar-brand ml-2 pb-0 pt-0" to="/">
                    DreamHost
                </Link>
                <div className="collapse navbar-collapse">
                    {currentUser ? loggeInNav() : loggedOutNav()}
                </div>
            </nav>
        </div>
    );
}

export default NavBar;