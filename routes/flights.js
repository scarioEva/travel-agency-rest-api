const express = require("express");
const router = express.Router();

const lists = require("../db/getList");
const flight = require("../functions/flight");

router.get("/search", async (req, res) => {
  try {
    let from = req?.body?.from || "";
    let to = req?.body?.to || "";
    let connection = req?.body?.connecting_flight || ""; //"true" or "false" or empty
    let seats = req?.body?.seats || "";

    let response = await lists.getSpecificList(from, to, connection, seats);

    for (var key in response) {
      if (response.hasOwnProperty(key)) {
        response[key] = {
          ...response[key]._doc,
          logo: await flight?.getFlightImage(response[key]?.airline),
        };
      }
    }

    res.send(response);
  } catch (err) {
    console.log(err);
  }
});

router.get("/searchById", async (req, res) => {
  let id = req.body?.id;
  let response = await lists.getFlightById(id);
  res.send(response);
});

router.get("/add", async (req, res) => {
  let data = req.body;
  let response = await lists.addFlightData(data);
  res.send(response);
});

module.exports = router;
