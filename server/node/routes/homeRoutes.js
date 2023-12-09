const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const router = express.Router();

const authorization = require("../middlewares/authorization");
const query = require("../database/connection");

 const userItemTagSim= async(userId)=>{
  console.log("func: ", userId)
  const response = await axios.get("http://127.0.0.1:5000/home", {
    params: {
      userId: userId,
    },
  });

  return (response.data.user_sim_item_id);
}

const fetchSimilarProducts=async(itemId)=>{
  const result = await query(
    "SELECT item_id, item_name, item_price, item_tags, item_image FROM items WHERE item_id = ANY($1) ORDER BY ARRAY_POSITION($1, item_id);",
    [itemId]
  );
  return result.rows;
}

router.get("/", authorization, async (req, res) => {
  try {
    const result1 = await query("SELECT * FROM users WHERE user_id=$1", [
      req.data.userId,
    ]);
    const result2 = await query(
      "SELECT * FROM user_profiles WHERE user_id=$1",
      [req.data.userId]
    );

    if (result2.rows.length > 0) {
      const user_sim_item_id = await userItemTagSim(req.data.userId);
      const result3 = await fetchSimilarProducts(user_sim_item_id);
      res.send({ alreadyExists: true, username: result1.rows[0].user_name, ui_sim_tag_items: result3});
    } else {
      res.send({ username: result1.rows[0].user_name });
    }
  } catch (err) {
    console.error("ERROR DURING FETCHING USER DATA");
    res.send({ message: "Error during fetching user data!" });
  }
});

module.exports = router;
