import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../common/Alert";
import "../meals-drinks/CreateOrUpdateRecipeForm.css";

/** Form to Signup.
 * 
 * Renders form and saves data that is entered into state
 * When submitted:
 * - signup function prop is called
 * - redirects to "/" route
 * 
 * if any errors, use Alert component to show error messages on bottom of form.
 */ 

function SignupForm({ signup }) {
    const navigate = useNavigate();
    const INITIAL_STATE = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
    };

    const [formData, setFormData] = useState(INITIAL_STATE);
    const [formErrors, setFormErrors] = useState([]);

    /** Handler function to submit the formData.
     * 
     * signup function prop is called, and, if successful, redirect to "/" route.
     * if not successful, set formErrors to show what went wrong.
     */ 
    const handleSubmit = async (e) => {
        e.preventDefault();
        let result = await signup(formData);
        if (result.success) {
            navigate("/");
        } else {
            setFormErrors(result.errors);
        }
    };

    /** Handler function to update formData. */ 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="SignupForm">
            <div className="form-container container col-md-6 offset-md-3 col-lg-6 offset-lg-3 mt-5 pt-5">
                <h2 className="form-title display-2 mb-3 text-center">- Sign Up -</h2>
                <div className="form-card card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input 
                                    name="username"
                                    className="form-control"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input 
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>First Name</label>
                                <input 
                                    name="firstName"
                                    className="form-control"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input 
                                    name="lastName"
                                    className="form-control"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            {formErrors.length
                                ? <Alert type="danger" messages={formErrors} />
                                : null
                            }

                            <button
                                type="submit"
                                className="submit-button btn btn-primary float-right"
                                onSubmit={handleSubmit}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
                <h2 className="form-redirect text-center mt-3">Already have an account? Login <Link to="/login">here</Link></h2>
            </div>
        </div>
    );
}

export default SignupForm;