const express = require("express");
const jwt = require("jsonwebtoken");

// const redisClient = require("../database/redisClient");

require("dotenv").config();

const authorization = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      res.send({
        noToken: true,
        message: "USER UNAUTHENTICATED!",
      });
    } else {
    //   const blacklistedToken = await redisClient.get(token);
    //   if (blacklistedToken !== null) {
    //     res.send({
    //       tokenInvalid: true,
    //       message: "INVALID TOKEN! KINDLY REAUTHENTICATE!",
    //     });
    //     return;
    //   }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          console.log("ERROR WHILE VERIFYING TOKEN!", err);
          res.send({
            tokenInvalid: true,
            message: "INVALID TOKEN! KINDLY REAUTHENTICATE!",
          });
        } else {
          req.data = {
            userId: decoded.userId,
            // iat: decoded.iat,
          };
          next();
        }
      });
    }
  } catch (err) {
    console.log("CAUGHT DURING TOKEN VERIFICATION! ", err);
  }
};

module.exports = authorization;
