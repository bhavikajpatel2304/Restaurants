/*********************************************************************************
 * * ITE5315 – Project* I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * * No part of this assignment has been copied manually or electronically from any other source
 * * (including web sites) or distributed to other students.*
 * * Group member Name: Bhavika Patel Student IDs: N01432720 Date: 29-Nov-2022
 *                      Udit Pandya                N01488740
 * *********************************************************************************/

const Restaurant = require("../model/Restaurant");
const User = require("../model/User");
const Session = require("../model/Session");
const Helper = require("../utils/helper");

// function to login user
const loginUser = async (req) => {
    let user, result ={};

    try {
        user = await User.findOne({email: req.body.email});

        if(!user) {
            result.userNotFound = true;
            return result;
        }

        const isValidPassword = await Helper.comparePassword(req.body.password, user.password);

        if(!isValidPassword) {
            result.invalidPassword = true;
            return result;
        }

        const token = await Helper.generateToken();

        if(token.tokenNotGenerated) {
            result.tokenNotGenerated = true;
            return result;
        }

        await new Session({session_id: token.session_id, is_active: true}).save();

        result.token = token;
        return result;
    
    } catch (error) {
        result.error = true;
        return result;
    }
}

// logout User
const logoutUser = async (session_id) => {

    let session, result = {};

    try {
        session = await Session.findOne({session_id: session_id});

        if(!session) {
            result.sessionNotFound = true;
            return result;
        }

        session.is_active = false;
        await session.save();

        result.logoutUser = true;
        return result;
    } catch(err) {
        result.error = true;
        return result;
    }
}

// create new restaurants
const addNewRestaurant = async (data) => {

    let result = {};
    
    // create new record
    const restaurant = await Restaurant.create(data);

    return restaurant.save().then(restaurant => {
        result.restaurant_details = restaurant;
        return result;
    }).catch(err => {
        result.error = err;
        return result;
    });
}

// get restaurant by Id
const getRestaurantById = async (_id) => {

    let result = {};
    return await Restaurant.findById(_id).then(restaurant => {
        result.restaurant_details = restaurant;
        return result;
    }).catch(err => {
        result.error= err;
        return result;
    })
}

// get all restaurants
const getAllRestaurants = async (req) => {
    let {page, perPage, borough} = req.query;

    let query = {}, result = {};

    if(borough) query.borough = borough;

    return await Restaurant.find(query).lean().skip((page-1)*perPage).limit(perPage).sort({'restaurant_id' : 'asc'}).then(restaurant => {
        result.restaurant_details = restaurant;
        return result;
    })
    .catch(err => {
        result.error = err;
        return result;
    })
}

// update an existing restaurant
const updateRestaurantById = async (data) => {

    let result = {};
    
    // update an existing record
    return await Restaurant.updateOne(data).then(restaurant => {
        result.restaurant_details = restaurant;
        return result;
    }).catch(err => {
        result.error = err;
        return result;
    });
}

// delete an existing restaurant
const deleteRestaurantById = async (_id) => {

    let result = {};
    return await Restaurant.deleteOne({_id}).then(restaurant => {
        result.restaurant_details = restaurant;
        return result;
    }).catch(err => {
        result.error= err;
        return result;
    })
}

module.exports = {
    loginUser,
    logoutUser,
    addNewRestaurant,
    getRestaurantById,
    getAllRestaurants,
    updateRestaurantById,
    deleteRestaurantById
}