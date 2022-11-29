const Restaurant = require("../model/Restaurant");

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

module.exports = {
    addNewRestaurant,
    getRestaurantById
}