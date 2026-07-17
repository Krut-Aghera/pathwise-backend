import User from "./user.model.js";

///////////////////////////////////////////////////////////////
// find by _id

const findById = (_id) => {
    return User.findById(_id);
};

///////////////////////////////////////////////////////////////
// find by email

const findByEmail = (email) => {
    return User.findOne({ email });
};

///////////////////////////////////////////////////////////////
// find user by email change token

const findByEmailChangeToken = (hashedToken) => {
    return User.findOne({
        emailChangeToken: hashedToken,
        emailChangeTokenExpiry: {
            $gt: new Date(),
        },
    });
};

///////////////////////////////////////////////////////////////
// find user by instructor access  token

const findByInstructorAccessToken = (hashedToken) => {
    return User.findOne({
        instructorAccessToken: hashedToken,
        instructorAccessTokenExpiry: {
            $gt: Date.now(),
        },
    });
};

///////////////////////////////////////////////////////////////
// save user document

const saveUser = (user, validateBeforeSave = false) => {
    return user.save({
        validateBeforeSave,
    });
};

///////////////////////////////////////////////////////////////
// export

export {
    findById,
    findByEmail,
    findByEmailChangeToken,
    findByInstructorAccessToken,
    saveUser,
};
