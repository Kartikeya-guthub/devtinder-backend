const validator = require('validator');

const validateSignupData = (req) => {
    const{ firstName, emailId, password,lastName, age} = req.body;
    if(!firstName || !lastName){
        throw new Error("First name and Last name are required");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Invalid email address");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough");
    }

}

const validateEditProfileData = (req) => {
    const allowedFields = ['firstName', 'lastName', 'age', 'gender', 'skills', 'photoUrl','about','emailId'];
    const isEditAlloweed = Object.keys(req.body).every(field => allowedFields.includes(field));
    return isEditAlloweed;
}

module.exports = { validateSignupData, validateEditProfileData };