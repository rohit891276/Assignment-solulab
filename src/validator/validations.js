const mongoose = require('mongoose');


const isValidObjectId = (objectId) => {
    if (mongoose.Types.ObjectId.isValid(objectId)) return true;
    return false;
};

const isValid = (value) => {
    if (typeof (value) === 'undefined' || value === null) return false
    if (typeof (value) === "string" && value.trim().length === 0) return false
    return true;

}

const isValidRequest = (value) => {
    if (Object.keys(value).length === 0) return false;
    return true;
}

const nameRegex = (value) => {
    let nameRegex = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
    if (nameRegex.test(value))
        return true;
}




module.exports = { isValidObjectId, isValid, isValidRequest, nameRegex }

