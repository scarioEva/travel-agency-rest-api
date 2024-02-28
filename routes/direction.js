const express = require("express");
const router = express.Router();
const direction = require("../functions/directions");

router.get("/", async (req, res) => {
  let from_data = req.body.from;
  let to_data = req.body.to;

  let data = await direction.getDirection(from_data, to_data);
  res.send(data);
  //   res.send(res.json(response?.data));
});

module.exports = router;
