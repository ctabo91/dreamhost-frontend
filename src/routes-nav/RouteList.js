import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../homepage/Home";
import RecipesList from "../meals-drinks/RecipesList";
import RecipeDetails from "../meals-drinks/RecipeDetails";
import CreateOrUpdateRecipeForm from "../meals-drinks/CreateOrUpdateRecipeForm";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import Profile from "../profiles/Profile";
import UserContext from "../auth/UserContext";
import CategoryList from "../meals-drinks/CategoryList";


/** Site-wide routes.
 * 
 * Certain sites should be restricted, unless logged in.
 * 
 * Visiting these restricted routes when not logged in redirects to the login page.
 */ 

function RouteList({ login, signup, hasFavoritedRecipe, favoriteRecipe }) {
    const { currentUser } = useContext(UserContext);
    return (
        <div>
            <Routes>

                <Route exact path="/" element={<Home />} />

                <Route exact path="/login" element={<LoginForm login={login} />} />

                <Route exact path="/signup" element={<SignupForm signup={signup} />} />            

                {currentUser ? (
                    <>
                        <Route 
                            exact
                            path="/recipes/:item"
                            element={<RecipesList />}
                        />

                        <Route 
                            exact
                            path="/recipes/:item/categories"
                            element={<CategoryList />}
                        />

                        <Route 
                            exact 
                            path="/recipes/:item/:category"
                            element={<RecipesList />}
                        />

                        <Route 
                            exact 
                            path="/recipes/details/:access/:item/:id"
                            element={<RecipeDetails hasFavoritedRecipe={hasFavoritedRecipe} favoriteRecipe={favoriteRecipe} />}
                        />

                        <Route 
                            exact 
                            path="/recipes/create/:item" 
                            element={<CreateOrUpdateRecipeForm />} 
                        />
                        

                        <Route 
                            exact 
                            path="/recipes/update/:item/:id"
                            element={<CreateOrUpdateRecipeForm />}
                        />

                        <Route 
                            exact 
                            path="/profile"
                            element={<Profile />}
                        />
                    </>
                ) : (
                    <>
                        <Route 
                            exact
                            path="/recipes/:item"
                            element={<Navigate to="/login" replace />}
                        />

                        <Route 
                            exact
                            path="/recipes/:item/categories"
                            element={<Navigate to="/login" replace />}
                        />

                        <Route
                            exact
                            path="/recipes/:item/:category"
                            element={<Navigate to="/login" replace />} 
                        />

                        <Route
                            exact
                            path="/recipes/:item/:id"
                            element={<Navigate to="/login" replace />} 
                        />

                        <Route
                            exact
                            path="/recipes/create/:item"
                            element={<Navigate to="/login" replace />} 
                        />

                        <Route
                            exact
                            path="/recipes/update/:item/:id"
                            element={<Navigate to="/login" replace />} 
                        />

                        <Route
                            exact
                            path="/profile"
                            element={<Navigate to="/login" replace />} 
                        />
                    </>
                )}

            </Routes>
        </div>
    )
}

export default RouteList;