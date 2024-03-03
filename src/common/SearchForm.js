import React, { useState } from "react";
import "./SearchForm.css";

/** Form that is rendered in RecipesList for all meals or drinks.
 * 
 * Searches for recipe by name, using the search function passed in through props.
 */ 

function SearchForm({ searchFor, item }) {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        searchFor(item, {name: searchTerm.trim() || undefined});
        setSearchTerm(searchTerm.trim());
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="SearchForm mb-3">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input 
                        className="form-control form-control-lg flex-grow-1"
                        name="searchTerm"
                        placeholder="Enter search term..."
                        value={searchTerm}
                        onChange={handleChange}
                    />
                    <button type="submit" className="btn btn-lg">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SearchForm;