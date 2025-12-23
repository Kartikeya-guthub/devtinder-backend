

const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const { connection } = require('mongoose');
const requestrouter = express.Router();

requestrouter.post('/request/send/:status/:toUserId', userAuth, async (req, res, next) => {
  try{

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

     const allowedStatus = ["Ignore", "Interested"]
     if(!allowedStatus.includes(status)){
       return res.status(400).json({ error: "Invalid status value" });
     }

    const toUser = await User.findById(toUserId);
    if(!toUser){
      return res.status(404).json({ error: "Target user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or:[
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ],
    })
    if(existingRequest){
      return res.status(400).json({ error: "Connection request already exists between these users" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({ message: req.user.firstName +"is "+ status + " to connect with "+ toUser.firstName, data });

  }catch(error){
    res.status(400).json({ error: error.message });
  }
})


requestrouter.post('/request/respond/:status/:requestId', userAuth, async (req, res, next) => {
  try{
    const loggedInUser = req.user;
    const { requestId, status } = req.params;
    const allowedStatus = ["Accepted", "Rejected"] // Already uniform, no change needed
    if(!allowedStatus.includes(status)){
       return res.status(400).json({ error: "Invalid status value" });
    }

    const connectionRequest = await ConnectionRequest.findOne({_id: requestId, toUserId: loggedInUser._id, status: "Interested"}); // Already uniform, no change needed
    if(!connectionRequest){
      return res.status(404).json({ error: "Connection request not found or already responded to" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    res.json({ message: "Connection request "+ status.toLowerCase() +" successfully", data });

  }catch(error){
    res.status(400).json({ error: error.message });
  }
})

module.exports = requestrouter;