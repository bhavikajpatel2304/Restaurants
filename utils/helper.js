const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const {v4: uuidv4} = require('uuid');

async function comparePassword ( user_password , hashed_password ) {
    let passwordMatch , result = {};

    passwordMatch = await bcrypt.compare( user_password , hashed_password ).catch(err => {
        result.databaseError = true;
        return result;
    })

    return passwordMatch;
}

// Function for generating jwt token for secure authentication
async function generateToken(){

    let token, result = {}, session_id;

    try {

        // Generating a unique session_id
        session_id = uuidv4();

        // Signing jwt payload along with secret key and options config
        token = jsonwebtoken.sign({session_id}, process.env.JWT_SECRET_KEY);
    }

    catch (err) {

        result.tokenNotGenerated = true;
        return result;
    }

    if (token) {
        result.token = token;
        result.session_id = session_id;
        return result;
    }
}

module.exports = {
    comparePassword,
    generateToken
}