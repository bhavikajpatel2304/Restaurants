const express = require("express");
const Code = require("../utils/code");
const Response = require("../utils/response");
const Restaurant = require("../model/Restaurant");

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
        Restaurant.create(data, (err, restaurant) => {
            if(err) {
                return Response.error(res, Code.DATABASE_ERROR, err.message);
            }

            return Response.success(res, Code.SUCCESS, "Record inserted!", restaurant);
        })
    }
);

module.exports = router;