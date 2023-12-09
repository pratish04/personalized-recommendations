const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const router = express.Router();

const authorization = require("../middlewares/authorization");
const query = require("../database/connection");

const itemItemTagSim = async (itemId) => {
  console.log("func: ", itemId);
  const response = await axios.get("http://127.0.0.1:5000/similar-tag-items", {
    params: {
      itemId: itemId,
    },
  });
  return response.data.item_sim_item_id;
};

const fetchSimilarProducts = async (itemId) => {
  const result = await query(
    "SELECT item_id, item_name, item_price, item_tags, item_image FROM items WHERE item_id = ANY($1) ORDER BY ARRAY_POSITION($1, item_id);",
    [itemId]
  );
  return result.rows;
};

router.get("/", authorization, async (req, res) => {
  try {
    console.log('hihi inside similar tag items');
    const itemSimilarItemIds = await itemItemTagSim(req.query.itemId);
    console.log("final: ", itemSimilarItemIds.length);
    const result = await fetchSimilarProducts(itemSimilarItemIds);
    res.send({
      ii_sim_tag_items: result,
    });
    
  } catch (err) {
    console.error("ERROR DURING FETCHING USER DATA");
    res.send({ message: "Error during fetching user data!" });
  }
});

module.exports = router;
