/*********************************************************************************
 * * ITE5315 – Project* I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * * No part of this assignment has been copied manually or electronically from any other source
 * * (including web sites) or distributed to other students.*
 * * Group member Name: Bhavika Patel Student IDs: N01432720 Date: 29-Nov-2022
 *                      Udit Pandya                N01488740
 * *********************************************************************************/

const express = require("express");
const Code = require("../utils/code");
const Response = require("../utils/response");
const Controller = require("./controller");
const { celebrate, Joi, Segments } = require('celebrate');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

// POST
// path - /api/login
router.post("/login", 

    // middleware to handle errors
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }),

    async (req, res, next) => {
        
        const response = await Controller.loginUser(req);

        if(response.error) return Response.error(res, Code.DATABASE_ERROR, "Something went wrong!");

        else if(response.userNotFound) return Response.error(res, Code.BAD_REQUEST, "User not found with given email");

        else if(response.invalidPassword) return Response.error(res, Code.INVALID_CREDENTIALS, "Password is incorrect!")

        else if(response.tokenNotGenerated) return Response.error(res, Code.DATABASE_ERROR, "Token not generated!")

        else if(response.token) return Response.success(res, Code.SUCCESS, "User found!", response);
    }
)

// POST
// path - /api/logout
router.post("/logout",

    // middleware to check user session
    checkAuth,

    // middleware to handle errors
    celebrate({
        [Segments.BODY]: Joi.object().keys({
            session_id: Joi.string().required(),
        })
    }),

    async (req, res, next) => {

        const response = await Controller.logoutUser(req.body.session_id);

        if(response.error) return Response.error(res, Code.DATABASE_ERROR, "Something went wrong!");

        else if(response.sessionNotFound) return Response.error(res, Code.BAD_REQUEST, "Session not found with given Id");

        else if(response.logoutUser) return Response.success(res, Code.SUCCESS, "User has been logged out succesfully!")
    }
)

// POST
// path - /api/restaurants/
router.post("/restaurants",

    // middleware to check user session
    checkAuth,

    async (req, res) => {
        // collect data
        let data = {
            address: {
                building: req.body.building,
                coord: req.body.coord,
                street: req.body.street,
                zipcode: req.body.zipcode
            },
            borough: req.body.borough,
            cuisine: req.body.cuisine,
            grades: req.body.grades,
            name: req.body.name,
            restaurant_id: req.body.restaurant_id
        }

        // create new record
        const response = await Controller.addNewRestaurant(data);

        if(response.error) return Response.error(res, Code.UNPROCESSABLE_ENTITY, response.error);

        else if(response.restaurant_details) return Response.success(res, Code.SUCCESS, "Record inserted!", response.restaurant_details);

        else return Response.error(res, Code.DATABASE_ERROR, "Something went wrong!");
    }
);


// GET
// path - /api/restaurants/
router.get("/restaurants/:_id?",

    // middleware to check user session
    checkAuth,

    // middleware to handle errors
    celebrate({
        [Segments.QUERY]: Joi.object().keys({
            page: Joi.number().integer().required(),
            perPage: Joi.number().integer().required(),
            borough: Joi.string().optional()
        })
    }),

    async(req, res) => {

        const _id = req.params._id;

        let response;

        if(_id) response = await Controller.getRestaurantById(_id);

        else response = await Controller.getAllRestaurants(req);

        if(response.error)return Response.error(res, Code.UNPROCESSABLE_ENTITY, response.error);

        else if(response.restaurant_details) Response.success(res, Code.SUCCESS, "Record(s) found!", response.restaurant_details);

        else return Response.error(res, Code.DATABASE_ERROR, "Something went wrong!");
    }
)

// Handlebars
// GET
// path - /api/find
router.get("/find", 

    // middleware to check user session
    checkAuth,

    async(req, res, next) => {

        res.render("Form")
    }
)

// GET
// path - /api/find-restaurants
router.get("/find-restaurants",

    // middleware to check user session
    checkAuth,

    // middleware to handle errors
    celebrate({
        [Segments.QUERY]: Joi.object().keys({
            page: Joi.number().integer().required(),
            perPage: Joi.number().integer().required(),
            borough: Joi.string().optional()
        })
    }),

    async(req, res) => {

        let response = await Controller.getAllRestaurants(req);

        if(response.error)return Response.error(res, Code.UNPROCESSABLE_ENTITY, response.error);
        
        else if(response.restaurant_details) res.render("Restaurants", {restaurants: response.restaurant_details});

        else return Response.error(res, Code.DATABASE_ERROR, "Something went wrong!");
    }
)

// PUT
// path - /api/restaurants
router.put("/restaurants/:_id?",

    // middleware to check user session
    checkAuth,

    async(req, res) => {

        const _id = req.params._id;

        // collect data
        let data = {
            address: {
                building: req.body.building,
                coord: req.body.coord,
                street: req.body.street,
                zipcode: req.body.zipcode
            },
            borough: req.body.borough,
            cuisine: req.body.cuisine,
            grades: req.body.grades,
            name: req.body.name,
            restaurant_id: req.body.restaurant_id
        }

        //let response;

        if(_id) {
            let idResponse = await Controller.getRestaurantById(_id);
        
            if (idResponse) {
                //update an existing restaurant
                const response = await Controller.updateRestaurantById(data);
            
            if(response.error) return Response.error(res, Code.UNPROCESSABLE_ENTITY, response.error);
    
            else if(response.restaurant_details) return Response.success(res, Code.SUCCESS, "Record Updated!", response.restaurant_details);
    
            else return Response.error(res, Code.DATABASE_ERROR, "Something went wrong!");
            }
        }
    }
)

// DELETE
// path - /api/restaurants
router.delete("/restaurants/:_id?",

    // middleware to check user session
    checkAuth,

    async(req, res) => {

        const _id = req.params._id;

        if(_id) {
            let idResponse = await Controller.getRestaurantById(_id);
        
            if (idResponse) {

                //delete an existing restaurant
                const response = await Controller.deleteRestaurantById(_id);

                if(response.error) return Response.error(res, Code.UNPROCESSABLE_ENTITY, response.error);
        
                else if(response.restaurant_details) return Response.success(res, Code.SUCCESS, "Record Deleted!", response.restaurant_details);
        
                else return Response.error(res, Code.DATABASE_ERROR, "Something went wrong!");
            }
        }
    }
)

module.exports = router;