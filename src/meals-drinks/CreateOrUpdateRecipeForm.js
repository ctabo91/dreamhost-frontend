import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DreamHostApi from "../api/api";
import UserContext from "../auth/UserContext";
import Alert from "../common/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./CreateOrUpdateRecipeForm.css";

/** Form to Create a meal or drink, or to Update a meal or drink:
 * 
 * The form that is shown depends on the route that is visited:
 * - /recipes/create/:item (where :item can be either "meals" or "drinks") renders a Create Form, for either a new meal or a new drink.
 * - /recipes/update/:item/:id (where :item = "meals" or "drinks", and :id is the ID associated to a specific meal or drink) renders an Update Form, for an existing meal or drink.
 * 
 * The Component looks to see if :id is passed as a param:
 * - if it is, the form will be an Update Form
 * - if not, the form will be a Create Form 
 * - the :item param will decide whether it is for a meal or a drink
 */ 

function CreateOrUpdateRecipeForm() {
    const { item, id } = useParams();
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();

    // Determine if it's a create or update scenario.
    const isUpdate = id !== undefined;

    // Initial state for the form, depending on the value of :item param and if the :id param is passed or not.
    const INITIAL_STATE = isUpdate
                    ? { ingredients: [] }
                    : (item === "meals") 
                    ? {
                        name: "",
                        category: "",
                        area: "",
                        instructions: "",
                        thumbnail: "",
                        ingredients: [],
                      }
                    : {
                        name: "",
                        category: "",
                        type: "",
                        glass: "",
                        instructions: "",
                        thumbnail: "",
                        ingredients: [],
                      };

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [formErrors, setFormErrors] = useState([]);
    const [newIngredient, setNewIngredient] = useState("");

    // Fetch existing recipe data if it's an update.
    useEffect(() => {
        const fetchRecipeData = async () => {
            try {
                const existingData = await DreamHostApi.getPersonalRecipe(currentUser.username, id, item);
                setFormData(existingData);
            } catch (error) {
                console.error("Error fetching recipe data:", error);
            }
        };
    
        if (isUpdate) {
            fetchRecipeData();
        }
    }, [id, item, isUpdate, currentUser.username]);

    /** Handler function to submit the form data:
     * 
     * Make the appropriate API call, setFormData back to it's INITIAL_STATE, and redirect to home page.
     */ 
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a copy of formData without the 'id' property
        const formDataWithoutId = { ...formData };
        delete formDataWithoutId.id;

        try {
            if (isUpdate) {
                await DreamHostApi.updatePersonalRecipe(currentUser.username, id, formDataWithoutId, item);
            } else {
                await DreamHostApi.createPersonalRecipe(currentUser.username, formDataWithoutId, item);
            }
        } catch (errors) {
            setFormErrors(errors);
            return;
        }

        setFormData(INITIAL_STATE);
        setFormErrors([]);
        navigate("/");
    };

    // Handler function to update the form data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handler function to update the new ingredient value
    const handleNewIngredientChange = (e) => {
        setNewIngredient(e.target.value);
    };

    // Handler function to add ingredient to the list
    const addIngredient = (e) => {
        e.preventDefault();
        setFormData((prevData) => ({
            ...prevData,
            ingredients: [...prevData.ingredients, newIngredient],
        }));

        // Clear the input field after adding the ingredient
        setNewIngredient("");
    };

    // Handler function to remove ingredient from the list
    const removeIngredient = (index) => {
        setFormData((prevData) => {
            const updatedIngredients = [...prevData.ingredients];
            updatedIngredients.splice(index, 1);
            return {
                ...prevData,
                ingredients: updatedIngredients,
            };
        });
    };

    const itemStringForTitle = item[0].toUpperCase() + item.slice(1, -1);

    return (
        <div className="CreateOrUpdateRecipeForm">
            <div className="CreateOrUpdateRecipeForm-container form-container container col-md-6 offset-md-3 col-lg-6 offset-lg-3 mt-5 pt-5">
                <h4 className="form-title display-4 text-center mb-3">
                    {isUpdate
                            ? `- Update ${itemStringForTitle} -`
                            : `- Create ${itemStringForTitle} -`}
                </h4>
                <div className="CreateOrUpdateRecipeForm-card form-card card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name" className="CreateOrUpdateRecipeForm-label">Name</label>
                                <input
                                    id="name"  
                                    name="name" 
                                    className="form-control"
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="Recipe Name"
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="category" className="CreateOrUpdateRecipeForm-label">Category</label>
                                <input
                                    id="category"  
                                    name="category" 
                                    className="form-control"
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    placeholder={item === "meals"
                                                        ? "ex: Chicken"
                                                        : "ex: Cocktails"}
                                />
                            </div>
                            {item === "meals" 
                                    ? <>
                                        <div className="form-group mt-3">
                                            <label htmlFor="area" className="CreateOrUpdateRecipeForm-label">Area</label>
                                            <input
                                                id="area"  
                                                name="area"
                                                className="form-control" 
                                                value={formData.area} 
                                                onChange={handleChange} 
                                                placeholder="ex: Colombian"
                                            />
                                        </div>
                                      </>
                                    : <>
                                        <fieldset className="mt-3">
                                            <p className="mb-1">Select a type of drink</p>
                                            <div className="form-group">
                                                <div className="form-check form-check-inline">
                                                <label htmlFor="Alcoholic" className="form-check-label">Alcoholic</label>
                                                <input
                                                    type="radio"  
                                                    name="type" 
                                                    id="Alcoholic"
                                                    className="form-check-input"
                                                    value="Alcoholic"
                                                    onChange={handleChange} 
                                                />
                                                </div>
                                                <div className="form-check form-check-inline">
                                                <label htmlFor="Non alcoholic" className="form-check-label">Non-Alcoholic</label>
                                                <input
                                                    type="radio"  
                                                    name="type" 
                                                    id="Non alcoholic"
                                                    className="form-check-input"
                                                    value="Non alcoholic"
                                                    onChange={handleChange} 
                                                />
                                                </div>
                                            </div>
                                        </fieldset>
                                        <div className="form-group mt-3">
                                            <label htmlFor="glass" className="CreateOrUpdateRecipeForm-label">Glass</label>
                                            <input
                                                id="glass"  
                                                name="glass" 
                                                className="form-control"
                                                value={formData.glass} 
                                                onChange={handleChange} 
                                                placeholder="ex: Cocktail glass"
                                            />
                                        </div>
                                      </>}
                            <div className="form-group mt-3">
                                <label htmlFor="instructions" className="CreateOrUpdateRecipeForm-label">Instructions</label>
                                <textarea
                                    id="instructions" 
                                    name="instructions" 
                                    className="form-control"
                                    value={formData.instructions} 
                                    onChange={handleChange}
                                    placeholder="Details on how to make your recipe...">
                                </textarea>
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="thumbnail" className="CreateOrUpdateRecipeForm-label">Thumbnail</label>
                                <input
                                    id="thumbnail"  
                                    name="thumbnail" 
                                    className="form-control"
                                    value={formData.thumbnail} 
                                    onChange={handleChange}
                                    placeholder="Optional photo url" 
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label className="CreateOrUpdateRecipeForm-label">Ingredients</label>
                                <ul>
                                    {formData.ingredients.map((ingredient, index) => (
                                        <li key={index}>
                                            {ingredient}{" "}
                                            <button
                                                className="btn trash-button"
                                                type="button"
                                                onClick={() => removeIngredient(index)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <form onSubmit={addIngredient}>        
                                    <label className="CreateOrUpdateRecipeForm-label">New Ingredient <p className="mb-1"><small>(Add an ingredient and click button below to display it)</small></p></label>
                                    <div className="input-group">
                                        <input
                                            className="form-control flex-grow-1"
                                            value={newIngredient}
                                            onChange={handleNewIngredientChange}
                                            placeholder={item === "meals"
                                                                ? "ex: 1 tsp Salt"
                                                                : "ex: 1 oz Bacardi"}
                                        />

                                        <button 
                                            type="submit" 
                                            className="submit-button btn btn-secondary"
                                            onClick={addIngredient}
                                        >
                                            Add Ingredient
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {formErrors.length
                                ? <Alert type="danger" messages={formErrors} />
                                : null}
                                  
                            <button
                                type="submit"
                                className="submit-button btn btn-primary btn-block float-right mt-3"
                                onClick={handleSubmit}
                            >
                                {isUpdate ? "Update" : "Create"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateOrUpdateRecipeForm;
