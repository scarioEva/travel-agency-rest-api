const express = require("express");
const axios = require("axios");
const app = express();
const fs = require("fs");
require("dotenv/config");
const weathers = require("./functions/weather");
const image = require("./functions/images");
const directions = require("./functions/directions");
const lists = require("./db/getList");

const { error } = require("console");

app.use(express.json());

app.get("/", async (req, res) => {
  res.send(await lists.getList());

  // fs.readFile(__dirname + "/country.json", "utf8", (err, data) => {
  //   res.send(data);
  // });
});

app.get("/direction", async (req, res) => {
  let from_data = req.body.from || "Birmingham";
  let to_data = req.body.to || "London";

  let data = await getDirection(from_data, to_data);
  res.send(data);
  //   res.send(res.json(response?.data));
});

// // app.post("/postReq", (req, res) => {
// //   if (!req.body.name) {
// //     res.status(400).send("name required");
// //     return;
// //   }
// //   console.log(req.body);
// //   res.send("hi " + req.body.name);
// // });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`port listening on ${port}`);
});
