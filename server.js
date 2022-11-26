require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const CONFIG = require("./utils/db");

const restaurants = require("./routes/restaurants");
const app = express();

// config
const URL = CONFIG.MONGO_URL;
const PORT = CONFIG.PORT;


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
app.use("/restaurants" , restaurants);

// Error handling route
app.all("*", (req, res) => {
    res.status(404).json({code: 404, message: 'Error 404! Route not found!'});
})

// mongodb connection
mongoose.connect(URL, options).then((result) => {
    app.listen(PORT , (req , res) => {
        console.log(`Server has started successfully on port: ${PORT}`);
    })
})
.catch((err) => {
    console.log(`Server error -> ${err}`);
});