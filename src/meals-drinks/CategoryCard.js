import React from "react";
import { Link } from "react-router-dom";
import "./CategoryList.css";

/** A card showing category "name" and a "count" for how many recipes that category contains
 * 
 * Card is a link that redirects to RecipesList with category name passed as the :category param.
 */

function CategoryCard({ category, count, item }) {
    return (
        <div className="col-4 mb-4">
            <Link className="CategoryCard card border-0" to={`/recipes/${item}/${encodeURIComponent(category)}`}>
                <div className="card-body text-center pl-0 pr-0">
                    <h5 className="card-title">{category.toUpperCase()}</h5>
                    <p className="card-text"><small>{count} recipes</small></p>
                </div>
            </Link>
        </div>
    );
}

export default CategoryCard;