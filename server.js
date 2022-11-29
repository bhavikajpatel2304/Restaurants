/*********************************************************************************
 * * ITE5315 – Project* I declare that this assignment is my own work in accordance with Humber Academic Policy.
 * * No part of this assignment has been copied manually or electronically from any other source
 * * (including web sites) or distributed to other students.*
 * * Group member Name: Bhavika Patel Student IDs: N01432720 Date: 29-Nov-2022
 *                      Udit Pandya                N01488740
 * *********************************************************************************/

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const CONFIG = require("./utils/db");
const {errors} = require("celebrate");
const exphbs = require('express-handlebars');

const restaurants = require("./routes/restaurants");
const app = express();

// config
const URL = CONFIG.MONGO_URL;
const PORT = CONFIG.PORT;

const helpers = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
})

app.use(express.static(path.join(__dirname, 'public')));

app.engine('.hbs', helpers.engine);
app.set('view engine', '.hbs');


app.use(cors());
// accept web form data
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Config options to pass in mongoose.connect() method
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Routes
// uncomment if needed
//app.use("/images" , express.static(path.join(__dirname, "images")));
app.use("/api" , restaurants);

// celebrate error handler
app.use(errors());

// Error handling route
app.all("*", (req, res) => {
    res.status(404).json({code: 404, message: 'Error 404! Route not found!'});
})

// mongodb connection
mongoose.connect(URL, options).then((result) => {
    app.listen(PORT , (req , res) => {
        console.log(`Server has started successfully on port: ${PORT}`);
    });
})
.catch((err) => {
    console.log(`Server error -> ${err}`);
});