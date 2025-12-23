const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
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
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error) => {  
    console.error("Database connection failed:", error);
  });
