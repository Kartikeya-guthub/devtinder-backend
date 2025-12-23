const mongoose = require('mongoose');

const connectDB = async() =>{
        await mongoose.connect("mongodb+srv://kartik20hnhnegnr051234_db_user:eqe2CruJrhrhryjF9XrgI8vX2@cluster0.4cq7hz3.mongodb.net/devTinder")
}

module.exports = connectDB;

