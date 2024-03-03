import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";


class DreamHostApi {
    static token;

    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${DreamHostApi.token}` };
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.error.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    // Individual API routes
    /** Get list of all meals. */ 

    static async getRecipes(type, searchParams) {
        let res = await this.request(`${type}?${new URLSearchParams(searchParams)}`);
        return res.meals || res.drinks;
    }


    /** Get details on a recipe by id (either a meal or a drink). */

    static async getRecipe(id, type) {
        let res = await this.request(`${type}/${id}`);
        return res.meal || res.drink;
    }


    /** Create a recipe (either a meal or a drink). */ 

    static async createRecipe(newRecipeData, type) {
        let res = await this.request(`${type}`, newRecipeData, "post");
        return res.meal || res.drink;
    }


    /** Update a recipe (either a meal or a drink). */ 

    static async updateRecipe(id, recipeUpdateData, type) {
        let res = await this.request(`${type}/${id}`, recipeUpdateData, "patch");
        return res.meal || res.drink;
    }


    /** Get names of categories (depending on whether "type" equals "meals" or "drinks") 
     * and a count of how many recipes are in each particular category. 
     */ 

    static async getCategories(type) {
        let res = await this.request(`${type}/categories`);
        return res.categories;
    }


    /** Login with user credentials. */ 

    static async login(loginData) {
        let res = await this.request("auth/token", loginData, "post");
        return res.token;
    }


    /** Sign up a new user. */ 

    static async signup(signupData) {
        let res = await this.request("auth/register", signupData, "post");
        return res.token;
    }


    /** Update users profile. */ 

    static async updateUser(username, updatedData) {
        let res = await this.request(`users/${username}`, updatedData, "patch");
        return res.user;
    }


    /** Get single user by username. */ 

    static async getUser(username) {
        let res = await this.request(`users/${username}`);
        return res.user;
    }


    /** Favorite a meal or drink (depending on the type passed). */
    
    static async markFavRecipe(username, id, type) {
        await this.request(`users/${username}/${type}/${id}/add`, {}, "post");
    }


    /** Unfavorite a meal or drink (depending on the type passed). */
    
    static async unmarkFavRecipe(username, id, type) {
        await this.request(`users/${username}/${type}/${id}/remove`, {}, "post");
    }


    /** Get list of personal recipes (either meals or drinks). */

    static async getPersonalRecipes(username, type) {
        let res = await this.request(`users/${username}/${type}/personal`);
        return res.personalRecipes;
    }


    /** Get a single personal recipe (either meal or drink). */
    
    static async getPersonalRecipe(username, id, type) {
        let res = await this.request(`users/${username}/${type}/personal/${id}`);
        return res.personalRecipe;
    }


    /** Create a personal recipe (either meal or drink). */
    
    static async createPersonalRecipe(username, newRecipeData, type) {
        let res = await this.request(`users/${username}/${type}/personal`, newRecipeData, "post");
        return res.personalRecipe;
    }


    /** Update a personal recipe (either meal or drink). */
    
    static async updatePersonalRecipe(username, id, recipeUpdateData, type) {
        let res = await this.request(`users/${username}/${type}/personal/${id}`, recipeUpdateData, "patch");
        return res.personalRecipe;
    }
}


export default DreamHostApi;