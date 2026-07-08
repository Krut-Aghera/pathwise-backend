import User from "../user/user.model.js";

///////////////////////////////////////////////////////////////
// create user document

const createUser = (userData) => {
    return User.create(userData);
};

///////////////////////////////////////////////////////////////
// save user document

const saveUser = (user, validateBeforeSave = false) => {
    return user.save({
        validateBeforeSave,
    });
};

///////////////////////////////////////////////////////////////
// find by email

const findByEmail = (email) => {
    return User.findOne({ email });
};

///////////////////////////////////////////////////////////////
// find by _id

const findById = (_id) => {
    return User.findById(_id);
};

///////////////////////////////////////////////////////////////
// exports

export { createUser, findByEmail, saveUser, findById };
