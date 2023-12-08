const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const query = require('../database/connection');

router.post('/', async(req, res)=>{
  try{    
    console.log(req.body.username);
    const result1 = await query("SELECT * FROM users WHERE user_name=$1" , [req.body.username]);
    console.log("Query result:", result1.rowCount);
    if(result1.rowCount===0){
      bcrypt.hash(req.body.password, saltRounds=10, async(err, hash)=>{
        if(err){
          console.log("USER REGISTRATION FAILURE!", err);
          res.send({message: 'User registration failure!'});
        }
        const result2 = await query('INSERT INTO users (user_name, user_password) VALUES ($1, $2) RETURNING user_id, user_name, user_password', [req.body.username, hash]);
        // console.log(result2.rows[0]);
        const token = jwt.sign(
        {
          userId: result2.rows[0].user_id,
          iat: Math.round(new Date().getTime() / 1000),
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        });
        console.log('USER REGISTRATION SUCCESSFUL!');
        res
          .cookie("accessToken", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
          })
          .send({ message: "User registration successful!" });
      });
    }
    else{
      console.log("USER ALREADY EXISTS!");
      res.send({errorStatus: true, message: 'User already exists!'});
    }
  }catch(err){
    console.log('USER REGISTRATION FAILURE!', err);
    res.send({ message: "User registration failure!" });
  };
});

module.exports=router;