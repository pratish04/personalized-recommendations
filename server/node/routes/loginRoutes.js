const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const query = require("../database/connection");

const authorization = require("../middlewares/authorization");

router.get("/", authorization, (req, res) => {
    console.log("inside route!");
  res.send({ validToken: true });
});
router.post('/', async(req, res)=>{
    try{
        console.log("hihi");
        const result1 = await query("SELECT * FROM users WHERE user_name=$1", [req.body.username]);
        console.log(result1.rows);
        if(result1.rowCount===0){
            console.log("USER DOESN'T EXIST!");
            res.send({doesNotExist: true, message: "User doesn't exist!"});
        }
        else{
            bcrypt.compare(req.body.password, result1.rows[0].user_password, async (err, result) => {
                // console.log(result);
                if(err){
                    console.error("USER LOGIN FAILURE!", err);
                    res.send({message: "User login failure!"});
                }
                else if(result){
                    const token = jwt.sign(
                      {
                        userId: result1.rows[0].user_id,
                        iat: Math.round(new Date().getTime() / 1000),
                      },
                      process.env.ACCESS_TOKEN_SECRET,
                      {
                        expiresIn: "1h",
                      }
                    );
                    console.log("LOGGED IN SUCCESSFULLY!");
                    res
                      .cookie("accessToken", token, {
                        httpOnly: true,
                        // sameSite: "none",
                        // secure: true,
                      })
                      .send({ message: "Logged in successfully!" });
                }
                else{
                    console.log("WRONG USERNAME/PASSWORD COMBINATION!");
                    res.send({
                      wrongCombination: true,
                      message: "Wrong username/password combination!",
                    });
                }
            //   const result = await query("SELECT * FROM users WHERE user_name=$1", [req.body.username]);
            //   console.log(result.rows);

            });
        }

    }catch(err){
        console.error('USER LOGIN FAILURE!', err);
        res.send({message: "User login failure!"});
    }
});

module.exports = router;