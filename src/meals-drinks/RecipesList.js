import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SearchForm from "../common/SearchForm";
import DreamHostApi from "../api/api";
import RecipeCard from "./RecipeCard";
import LoadingSpinner from "../common/LoadingSpinner";
import UserContext from "../auth/UserContext";
import "./RecipesList.css";

/** Shows a list of recipes, depending on the following factors:
 * - item === "meals" (list of all meals)
 * - item === "drinks" (list of all drinks)
 * - item === "meals" && category !== undefined (list of all meals in the specific category)
 * - item === "drinks" && category !== undefined (list of all drinks in the specific category)
 * 
 * The link to go to favorited recipes (either meals or drinks) is also shown here,
 * along with a link to the category list for either meals or drinks.
 */ 

function RecipesList() {
    const { currentUser, favMealIds, favDrinkIds } = useContext(UserContext);
    const { item, category } = useParams();
    const [recipes, setRecipes] = useState(null);
    const [favorites, setFavorites] = useState(false);
    const navigate = useNavigate();

    useEffect(function getRecipesOnMount() {
        category
                ? category === "personal"
                        ? searchPersonal(currentUser.username, item)
                        : search(item, {category})
                : search(item);
        
    }, [category, item, currentUser.username]);

    const searchPersonal = async (username, type) => {
        let personalRecipes = await DreamHostApi.getPersonalRecipes(username, type);
        setRecipes(personalRecipes);
    };

    const search = async (type, searchData) => {
        let recipes = await DreamHostApi.getRecipes(type, searchData);
        setRecipes(recipes);
    };

    const toggleFavorites = async () => {
        if (favorites && category) {
            navigate(`/recipes/${item}`);
        } else if (favorites && !category) {
            search(item);
        } else {
            await showFavRecipes();
        }

        setFavorites(!favorites);
    };

    const showFavRecipes = async () => {
        let favRecipes;
    
        if (item === "meals") {
            favRecipes = favMealIds ? await Promise.all([...favMealIds].map(async id => {
                return await DreamHostApi.getRecipe(id.toString(), item);
            })) : [];
        } else {
            favRecipes = favDrinkIds ? await Promise.all([...favDrinkIds].map(async id => {
                return await DreamHostApi.getRecipe(id.toString(), item);
            })) : [];
        }
    
        setRecipes(favRecipes);
    };
    
    const capitalizedItem = item[0].toUpperCase() + item.slice(1);

    if (!recipes) return <LoadingSpinner />;

    return (
        <div className="RecipesList col-md-8 offset-md-2 mt-5 pt-5">
            <h4 className="RecipesList-title display-4 text-center">
                {category && !favorites
                        ? `- ${category.toUpperCase()} RECIPES -`
                        : `- ${item.toUpperCase()} -`}
            </h4>
            {!category
                    ? <SearchForm searchFor={search} item={item} />
                    : null}
            
            {category !== "personal" 
                ? <div className="text-center">
                    <Link to={`/recipes/${item}/categories`}>
                        <button className="filter-button btn btn-sm btn-secondary mr-2">
                            Filter by Category
                        </button>
                    </Link>

                    <button className="filter-button btn btn-sm btn-secondary" onClick={toggleFavorites}>
                        {favorites ? `Back to All ${capitalizedItem}` : "Show Favorites"}
                    </button>
                  </div>
                : null}
            
            {recipes.length
                ? (
                    <div className="RecipesList-list mt-4">
                        {recipes.map(r => (
                            <RecipeCard 
                                key={r.id}
                                id={r.id}
                                name={r.name}
                                area={r.area}
                                type={r.type}
                                thumbnail={r.thumbnail}
                                ingredients={r.ingredients}
                                item={item}
                                access={category === "personal"
                                                ? "personal"
                                                : "global"}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="lead">Sorry, no results were found!</p>
                )}
        </div>
    );
}

export default RecipesList;