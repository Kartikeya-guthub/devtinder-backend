const mongoose = require('mongoose');

const connectDB = async() =>{
        await mongoose.connect("mongodb+srv://kartik20051234_db_user:eqe2CruJF9XI8vX2@cluster0.4cq7hz3.mongodb.net/devTinder")
}

module.exports = connectDB;

