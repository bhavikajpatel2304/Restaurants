const express = require("express");
const Code = require("../utils/code");
const Response = require("../utils/response");
const Restaurant = require("../model/Restaurant");
const Controller = require("./controller");

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
router.get("/restaurants/:_id",
    async(req, res) => {

        const _id = req.params._id;

        const response = await Controller.getRestaurantById(_id);

        if(response.error)return Response.error(res, Code.UNPROCESSABLE_ENTITY, response.error);

        else if(response.restaurant_details) Response.success(res, Code.SUCCESS, "Record found!", response.restaurant_details);

        else return Response.error(res, Code.DATABASE_ERROR, "Something went wrong!");
    }
)

module.exports = router;