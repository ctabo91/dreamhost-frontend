import React, { useState, useContext } from "react";
import Alert from "../common/Alert";
import DreamHostApi from "../api/api";
import UserContext from "../auth/UserContext";

/** Shows user profile info, and allows the user to update the info as desired. 
 * 
 * If there are any errors submitting the form, they will be displayed directly above the submit button.
 */ 

function Profile() {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const [formData, setFormData] = useState({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.username,
        password: "",
    });
    const [formErrors, setFormErrors] = useState([]);

    const [saveConfirmed, setSaveConfirmed] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let profileData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
        };

        let username = formData.username;
        let updatedUser;

        try {
            updatedUser = await DreamHostApi.updateUser(username, profileData);
        } catch (errors) {
            setFormErrors(errors);
            return;
        }

        setFormData(formData => ({
            ...formData,
            password: "",
        }));
        setFormErrors([]);
        setSaveConfirmed(true);

        setCurrentUser(updatedUser);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(formData => ({
            ...formData,
            [name]: value,
        }));
        setFormErrors([]);
    };

    return (
        <div className="form-container col-md-6 offset-md-3 col-lg-6 offset-lg-3 mt-5 pt-5">
            <h4 className="form-title display-4 text-center mb-3">- Profile -</h4>
            <div className="form-card card">
                <div className="card-body">
                    <form>
                        <div className="form-group">
                            <p id="username" className="form-control-plaintext text-center">Username: {formData.username}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input 
                                id="firstName"
                                name="firstName"
                                className="form-control"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input 
                                id="lastName"
                                name="lastName"
                                className="form-control"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                id="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password" 
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {formErrors.length
                            ? <Alert type="danger" messages={formErrors} />
                            : null}

                        {saveConfirmed
                            ? <Alert type="success" messages={["Updated successfully."]} />
                            :null}

                        <button
                            className="submit-button btn btn-primary btn-block mt-4"
                            onClick={handleSubmit}
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Profile;