const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
app.use(cookieParser());
app.use(express.json());


const authRouter = require('./router/auth');
const profileRouter = require('./router/profile');
const requestRouter = require('./router/request');
const userRouter = require('./router/user');
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(process.env.port, () => {
      console.log(`Server is running on port ${process.env.port}`);
    });
  })
  .catch((error) => {  
    console.error("Database connection failed:", error);
  });
