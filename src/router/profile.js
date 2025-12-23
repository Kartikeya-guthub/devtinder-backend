

const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
const profilerouter = express.Router();
 
profilerouter.get('/profile/view', userAuth, (req, res) => {
// ...existing code...
try{
  const user = req.user;
  if(!user){
    throw new Error("User not found");
  }
  res.send(user);}catch(error){
    res.status(400).json({ error: error.message });
  }
});

profilerouter.patch('/profile/edit', userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid fields in request body");
        }
        const loggedinuser = req.user;
        Object.keys(req.body).forEach(field => {
            loggedinuser[field] = req.body[field];
        });
        await loggedinuser.save();

        console.log("User before update:", loggedinuser);
        res.end("Profile updated successfully" );
    }catch(error){
        return res.status(400).json({ error: error.message });
    }
})

profilerouter.patch('/profile/password', userAuth, async (req, res) => {
    try{
        const { oldPassword, newPassword } = req.body;
        const loggedinuser = req.user;
        const isMatch = await loggedinuser.validatePassword(oldPassword);
        if(!isMatch){
            throw new Error("Old password is incorrect");
        }
        loggedinuser.password = newPassword;
        await loggedinuser.save();
        res.send("Password updated successfully");
    }catch(error){
        return res.status(400).json({ error: error.message });
    }
})

module.exports = profilerouter;