import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DreamHostApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import CategoryCard from "./CategoryCard";
import "./CategoryList.css";

/** Shows a list of CategoryCards depending on the value of "items"
 */ 

function CategoryList() {
    const { item } = useParams();
    const [categories, setCategories] = useState(null);

    // Get categories for the specific item passed (meals or drinks).
    useEffect(() => {
        const getCategories = async (type) => {
            try {
                const categories = await DreamHostApi.getCategories(type);
                setCategories(categories);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        getCategories(item);
    }, [item]);

    if (!categories) return <LoadingSpinner />;

    return (
        <div className="CategoryList col-md-8 offset-md-2 mt-5 pt-5">
            <h4 className="CategoryList-title display-4 text-center mb-5">
                {item === "meals"
                        ? "- Select A Meal Category -"
                        : "- Select A Drink Category -"
                }
            </h4>
            {categories.length
                ? (
                    <div className="CategoryList-list row row-cols-1 row-cols-md-3">
                        {categories.map((c, idx) => (
                            <CategoryCard 
                                key={idx}
                                category={c.category}
                                count={c.count}
                                item={item}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="lead">Sorry, no results were found!</p>
                )}
        </div>
    );
}

export default CategoryList;
