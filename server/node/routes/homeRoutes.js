const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const authorization = require("../middlewares/authorization");
const query = require("../database/connection");

router.get("/", authorization, async (req, res) => {
  try {
    const result1 = await query("SELECT * FROM users WHERE user_id=$1", [
      req.data.userId,
    ]);
    const result2 = await query(
      "SELECT * FROM user_profiles WHERE user_id=$1",
      [req.data.userId]
    );
    console.log("user profiles: ", result2.rows.length);
    if (result2.rows.length > 0) {
      res.send({ alreadyExists: true, username: result1.rows[0].user_name });
    } else {
      res.send({ username: result1.rows[0].user_name, validToken: true });
    }
  } catch (err) {
    console.error("ERROR DURING FETCHING USER DATA");
    res.send({ message: "Error during fetching user data!" });
  }
});

module.exports = router;
