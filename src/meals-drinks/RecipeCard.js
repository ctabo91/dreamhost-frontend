import React from "react";
import { Link } from "react-router-dom";
import "./RecipeCard.css";

/** Card that is displayed in the RecipeList Component.
 * 
 * A link that shows minimal information on a specific recipe.
 * When clicked, redirects to the RecipeDetails page for the recipe.
 */ 

function RecipeCard({ access, item, id, name, thumbnail, ingredients, area = undefined, type = undefined }) {
    return (
        <Link className="RecipeCard card mb-3" to={`/recipes/details/${access}/${item}/${id}`}>
            <div className="row no-gutters align-items-center">
                <div className="col-md-4">
                    <img src={thumbnail}
                        alt={name}
                        className="card-img img-fluid"
                    />
                </div>
                <div className="col-md-8">
                    <div className="card-body pt-0 pb-0">
                        <h3 className="RecipeCard-title card-title text-center pb-0">{name.toUpperCase()}</h3>
                        <hr className="top-line mt-0"/>
                        <h4 className="RecipeCard-subheading card-text text-center">
                            <i>{type ? type.toUpperCase() : `${area.toUpperCase()}`}</i>
                        </h4>
                        <hr className="mt-0"/>
                        <h5 className="RecipeCard-ingredients text-center">Ingredients</h5>
                        <div className="RecipeCard-list text-center ">
                            {ingredients.map(ingredient => (
                                <div className="RecipeCard-ingredient">{ingredient}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default RecipeCard;