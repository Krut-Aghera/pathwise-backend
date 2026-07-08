import User from "../user/user.model.js";

///////////////////////////////////////////////////////////////
// create user document

const createUser = (userData) => {
    return User.create(userData);
};

///////////////////////////////////////////////////////////////
// save user document

const saveUser = (user) => {
    return user.save({
        validateBeforeSave: false,
    });
};

///////////////////////////////////////////////////////////////
// find by email

const findByEmail = (email) => {
    return User.findOne({ email });
};

///////////////////////////////////////////////////////////////
// exports

export { createUser, findByEmail, saveUser };
