import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import DreamHostApi from "./api/api";
import RouteList from "./routes-nav/RouteList";
import NavBar from "./routes-nav/NavBar";
import UserContext from "./auth/UserContext";
import LoadingSpinner from "./common/LoadingSpinner";
import useLocalStorage from "./hooks/useLocalStorage";


export const TOKEN_STORAGE_ID = "dreamhost-token";


function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [favMealIds, setFavMealIds] = useState(new Set([]));
  const [favDrinkIds, setFavDrinkIds] = useState(new Set([]));
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  console.debug(
      "App",
      "infoLoaded=", infoLoaded,
      "currentUser=", currentUser,
      "token=", token,
  );

  /** Loads user info from API.
   * Only runs if the user is logged in and has a token, or when a user logs out.
   * The value of token is a dependency for this effect.
   */

  useEffect(function loadUserInfo() {
    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwtDecode(token);
          // put the token on the Api class so it can use it to call the API.
          DreamHostApi.token = token;
          let currentUser = await DreamHostApi.getUser(username);
          setCurrentUser(currentUser);
          setFavMealIds(new Set(currentUser.favMeals));
          setFavDrinkIds(new Set(currentUser.favDrinks));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  /** Handles site-wide logout. */
  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  /** Handles site-wide signup.
   * 
   * Automatically logs in (set token) when user signs up. 
   */ 
  const signup = async (signupData) => {
    try {
      let token = await DreamHostApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  };

  /** Handles site-wide login. */ 
  const login = async (loginData) => {
    try {
      let token = await DreamHostApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  };

  /** Checks if meal or drink has been favorited. */
  const hasFavoritedRecipe = (id, type) => {
    return ((type === "meals") 
          ? favMealIds.has(+id)
          : favDrinkIds.has(+id));
  };

  /** Favorite a recipe(either meal or drink), depending on "type" passed in the function.
   * Make an API call accordingly and update set of favMeal or favDrink IDs. */ 
  const favoriteRecipe = async (id, type) => {
    try {
      if (hasFavoritedRecipe(id, type)) {
        // If already favorited, remove from favorites
        await DreamHostApi.unmarkFavRecipe(currentUser.username, id, type);
      } else {
        // If not favorited, add to favorites
        await DreamHostApi.markFavRecipe(currentUser.username, id, type);
      }
  
      // Update the local state based on the type
      if (type === "meals") {
        setFavMealIds((prevSet) => {
          if (!hasFavoritedRecipe(id, type)) {
            return new Set([...prevSet, +id]);
          } else {
            return new Set([...prevSet].filter((favMealId) => favMealId !== +id));
          }
        });
      } else {
        setFavDrinkIds((prevSet) => {
          if (!hasFavoritedRecipe(id, type)) {
            return new Set([...prevSet, +id]);
          } else {
            return new Set([...prevSet].filter((favDrinkId) => favDrinkId !== +id));
          }
        });
      }
    } catch (error) {
      console.error("Error favoriting/unfavoriting recipe:", error);
    }
  };

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <BrowserRouter>
      <UserContext.Provider
          value={{ currentUser, setCurrentUser, hasFavoritedRecipe, favoriteRecipe, favMealIds, favDrinkIds }}>
        <div className="App">
          <NavBar logout={logout} />
          <RouteList login={login} signup={signup} />
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
