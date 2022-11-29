const express = require("express");
const Code = require("../utils/code");
const Response = require("../utils/response");
const Controller = require("./controller");
const { celebrate, Joi, Segments } = require('celebrate');

const router = express.Router();

// POST
// path - /api/restaurants/
router.post("/restaurants",

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

    async(req, res, next) => {

        res.render("Form")
    }
)

// GET
// path - /api/find-restaurants
router.get("/find-restaurants",

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
                const response = await Controller.updateRestaurant(data);
            
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

    async(req, res) => {

        const _id = req.params._id;

        if(_id) {
            let idResponse = await Controller.getRestaurantById(_id);
        
            if (idResponse) {

                //delete an existing restaurant
                const response = await Controller.deleteRestaurant(_id);

                if(response.error) return Response.error(res, Code.UNPROCESSABLE_ENTITY, response.error);
        
                else if(response.restaurant_details) return Response.success(res, Code.SUCCESS, "Record Updated!", response.restaurant_details);
        
                else return Response.error(res, Code.DATABASE_ERROR, "Something went wrong!");
            }
        }
    }
)

module.exports = router;