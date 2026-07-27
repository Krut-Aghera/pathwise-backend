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
// find user by email change token

const findUserByEmailChangeToken = (hashedToken) => {
    return User.findOne({
        emailChangeToken: hashedToken,
        emailChangeTokenExpiry: {
            $gt: new Date(),
        },
    });
};

///////////////////////////////////////////////////////////////
// find user by instructor access  token

const findUserByInstructorAccessToken = (hashedToken) => {
    return User.findOne({
        instructorAccessToken: hashedToken,
        instructorAccessTokenExpiry: {
            $gt: Date.now(),
        },
    });
};

///////////////////////////////////////////////////////////////
// find user by email verification token

const findUserByEmailVerificationToken = (hashedToken) => {
    return User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpiry: {
            $gt: Date.now(),
        },
    });
};

///////////////////////////////////////////////////////////////
// find user by reset password token

const findUserByPasswordResetToken = (hashedToken) => {
    return User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: {
            $gt: new Date(),
        },
    });
};

///////////////////////////////////////////////////////////////
// export

export {
    createUser,
    saveUser,
    findUserById,
    findUserByEmail,
    findUserByEmailChangeToken,
    findUserByPasswordResetToken,
    findUserByInstructorAccessToken,
    findUserByEmailVerificationToken,
};
