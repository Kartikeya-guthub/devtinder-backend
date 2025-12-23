const mongoose = require('mongoose');

const connectDB = async() =>{
        await mongoose.connect("mongodb+srv://_db_user:.4cq7hz3.mongodb.net/devTinder")
}

module.exports = connectDB;

