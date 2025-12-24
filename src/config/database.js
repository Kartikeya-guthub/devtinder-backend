const mongoose = require('mongoose');

const connectDB = async() =>{
        await mongoose.connect(process.env.database_connection_string)
}

module.exports = connectDB;

