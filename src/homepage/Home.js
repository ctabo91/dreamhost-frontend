import React, { useContext } from "react";
import UserContext from "../auth/UserContext";
import "./Home.css";

/** Home page for App.
 * 
 * Shows a welcome message, depending on whether or not user is logged in.
 */ 

function Home() {
    const { currentUser } = useContext(UserContext);

    return (
        <div className="Home mt-5 pt-5">
            <h1 className="Home-title display-1 text-center pt-5">
                {
                    !currentUser
                        ? <>
                            <span>Welcome To</span>
                            <p className="logo">DreamHost</p>
                          </>
                        : `Welcome ${currentUser.firstName}!`
                }
            </h1>
        </div>
    );
}

export default Home;