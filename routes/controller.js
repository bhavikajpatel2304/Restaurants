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
const updateRestaurant = async (data) => {

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
const deleteRestaurant = async (_id) => {

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
    addNewRestaurant,
    getRestaurantById,
    getAllRestaurants,
    updateRestaurant,
    deleteRestaurant
}