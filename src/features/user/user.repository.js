import User from "./user.model.js";

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
// find user by id

const findUserById = (userId) => {
    return User.findById(userId);
};

///////////////////////////////////////////////////////////////
// find user by email

const findUserByEmail = (email) => {
    return User.findOne({ email });
};

///////////////////////////////////////////////////////////////
// find user by token

const findUserByToken = ({ tokenField, expiryField, hashedToken }) => {
    return User.findOne({
        [tokenField]: hashedToken,
        [expiryField]: {
            $gt: new Date(),
        },
    });
};

///////////////////////////////////////////////////////////////
// export

export { createUser, saveUser, findUserById, findUserByEmail, findUserByToken };
