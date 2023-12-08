const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const authorization = require("../middlewares/authorization");
const query = require("../database/connection");

router.post("/", authorization, async (req, res) => {
  try{
    console.log(req.data.userId, req.body.profileTags);
    const result1 = await query("INSERT INTO user_profiles (user_id, user_profile_tags) VALUES ($1, $2)", [req.data.userId, req.body.profileTags]);
    res.send({message: "User profiling completed!"});
  }catch(err){
    console.error("ERROR DURING USER PROFILING!", err);
    res.send({message: "Error during user profiling!"});
  }
});

module.exports = router;
