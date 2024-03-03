import React from "react";
import UserContext from "./auth/UserContext";

const demoUser = {
  username: "testuser",
  first_name: "testfirst",
  last_name: "testlast",
  email: "test@test.net",
};

const UserProvider =
    ({ children, currentUser = demoUser, hasFavoritedRecipe = () => false }) => (
    <UserContext.Provider value={{ currentUser, hasFavoritedRecipe }}>
      {children}
    </UserContext.Provider>
);

export { UserProvider };