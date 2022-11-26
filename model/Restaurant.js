const mongoose = require("mongoose");

const Restaurant = new mongoose.Schema({
        address: {
            building: {
                type: String
            },

            coord: [
                Number
            ],

            street: {
                type: String
            },

            zipcode: {
                type: String
            }
        },

        borough: {
            type: String
        },

        cuisine: {
            type: String
        },

        grades: [
            {
                _id: false,
                date: {
                    type: Date,
                    required: true,
                    default: Date
                },
                grade: String,
                score: Number
            }
        ],

        name: {
            type: String
        },

        restaurant_id: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Restaurant", Restaurant);