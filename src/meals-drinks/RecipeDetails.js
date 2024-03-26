import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import DreamHostApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import UserContext from "../auth/UserContext";
import "./RecipeDetails.css";

/** Detail page for recipe, showing the name, category, area(or type and glass for drinks), ingredients, and instructions.
 * 
 * - If the access to this recipe is global, a heart icon is shown to favorite the recipe.
 * - If access is personal, an edit button is shown which redirects to an update form for the specific recipe.
 */ 

function RecipeDetails() {
    const { access, item, id } = useParams();
    const { currentUser, hasFavoritedRecipe, favoriteRecipe } = useContext(UserContext);

    const [recipe, setRecipe] = useState(null);

    /** Get a specific recipe by "id" and "item"(meals or drinks). 
     * 
     * If access is personal, get a personal recipe by "id" and "item"(meals or drinks).
     */
    useEffect(() => {
        const getRecipe = async () => {
            access === "personal"
                    ? setRecipe(await DreamHostApi.getPersonalRecipe(currentUser.username, id, item))
                    : setRecipe(await DreamHostApi.getRecipe(id, item));
        }

        getRecipe();
    }, [id, item, currentUser.username, access]);

    const organizeInstructions = (instructionString) => {
        // Check if the string starts with a number followed by a dot and space
        const isNumbered = /^\d+\.\s+/.test(instructionString);
      
        if (isNumbered) {
          // Split the string based on the numbered pattern
          return instructionString.split(/\d+\.\s+/).filter(Boolean);
        } else {
          // Split the string based on sentences
          return instructionString.split('.').map(instruction => instruction.trim()).filter(Boolean);
        }
    }

    const organizedInstructions = recipe ? organizeInstructions(recipe.instructions) : [];

    if (!recipe) return <LoadingSpinner />;

    return (
        <div className="RecipeDetails-container"
             style={{
                backgroundImage: `url(${recipe.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                width: '100%',
                paddingTop: '60px',
                margin: '0',
                position: 'relative',
             }}
        >
            <div className="RecipeDetails-overlay"></div>
            <div className="RecipeDetails-content container">
                <div className="row">
                    <div className="col">
                        <h2 className="RecipeDetails-title text-center mt-4">{recipe.name.toUpperCase()}</h2>
                        <h3 className="RecipeDetails-category text-center">
                            {item === "meals"
                                ? `${recipe.area} ${recipe.category} Dish`
                                : recipe.category}
                        </h3>
                        {item === "drinks" && (
                            <>
                                <h4 className="RecipeDetails-type heading-title text-center mt-3">{recipe.type}</h4>
                                <h6 className="RecipeDetails-glass heading-title text-center">*Serve in a {recipe.glass}*</h6>
                            </>
                        )}
                    </div>
                </div>
                <div className="row mt-4 d-flex justify-content-around">
                    <div className="col-12 col-sm-6">
                        <h4 className="instructions-title heading-title">Instructions</h4>
                        <ol className="RecipeDetails-instructions">
                            {organizedInstructions.map((instruction, idx) => (
                                <li key={idx} className="RecipeDetails-list-item">{instruction}</li>
                            ))}
                        </ol>
                    </div>
                    <div className="col-12 col-sm-1 split-line"></div>
                    <div className="col-12 col-sm-4">
                        <h4 className="ingredients-title heading-title">Ingredients</h4>
                        <ul className="RecipeDetails-ingredients">
                            {recipe.ingredients.map((ingredient, idx) => (
                                <li key={idx} className="RecipeDetails-list-item">{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                {access === "global" ? (
                    <button
                        className={`btn btn-favorite font-weight-bold  ${hasFavoritedRecipe(id, item) ? "favorited" : ""}`}
                        onClick={() => favoriteRecipe(id, item)}
                    >
                        <FontAwesomeIcon icon={hasFavoritedRecipe(id, item) ? solidHeart : regularHeart} />
                    </button>
                ) : (
                    <div className="container d-flex justify-content-end">
                        <Link to={`/recipes/update/${item}/${id}`}>
                            <button className="btn btn-edit btn-danger active mt-4 mb-4">Edit Recipe</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}


export default RecipeDetails;