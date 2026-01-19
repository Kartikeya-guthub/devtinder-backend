const express = require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const USER_SAFE_DATA = " firstName lastName photoUrl gender skills bio"

userRouter.get('/user/requests/received', userAuth, async (req, res, next) => {
    try{
        const loggedInUserId = req.user._id;
        const connectionRequests = await ConnectionRequest.find({ toUserId: loggedInUserId, status: "Interested" }).populate('fromUserId', ['firstName', 'lastName']);

        res.json({message: "Connection requests fetched successfully", connectionRequests});
    }catch(error){
        res.status(400).json({ error: error.message });
    }
})

userRouter.get('/user/connections', userAuth, async (req, res, next) => {
    try{

        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({ 
            $or: [
                { fromUserId: loggedInUser._id, status: "Accepted" },
                { toUserId: loggedInUser._id, status: "Accepted" }
            ]
        }).populate('fromUserId',USER_SAFE_DATA).populate('toUserId',USER_SAFE_DATA);
        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()    ){
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.json({ message: "Connections fetched successfully", data});


    }catch(error){
        res.status(400).json({ error: error.message });
    }
})


userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((row) => {
      hideUsersFromFeed.add(row.fromUserId.toString());
      hideUsersFromFeed.add(row.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;