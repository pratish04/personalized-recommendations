const express = require("express");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const router = express.Router();

const authorization = require("../middlewares/authorization");
const query = require("../database/connection");

const calculateUserItemTagBasedSimilarity=async(req)=>{
  try{

    const res = await axios.get("http://127.0.0.1:5000/calculate-user-item-tag-based-similarity", {
      params: {
        userId: req.data.userId,
      }
    });
    return res.data.user_sim_item_id;
  }catch(err){
    console.error("ERROR WHILE CALCULATING USER-ITEM-TAG-SIMILARITY");
  }
};

const fetchSimilarProducts = async (itemId) => {
  const result = await query(
    "SELECT item_id, item_name, item_price, item_tags, item_image FROM items WHERE item_id = ANY($1) ORDER BY ARRAY_POSITION($1, item_id);",
    [itemId]
  );
  return result.rows;
};

router.post("/", authorization, async (req, res) => {
  try{
    console.log(req.data.userId, req.body.profileTags);
    const result1 = await query("INSERT INTO user_profiles (user_id, user_profile_tags) VALUES ($1, $2)", [req.data.userId, req.body.profileTags]);

    const itemIds = await calculateUserItemTagBasedSimilarity(req);

    const items = await fetchSimilarProducts(itemIds);

    console.log(items);
    
    res.send({message: "User profiling completed!", ui_sim_tag_items: items});
  }catch(err){
    console.error("ERROR DURING USER PROFILING!", err);
    res.send({message: "Error during user profiling!"});
  }
});

module.exports = router;
