const express = require("express");
const router = express.Router();
const common = require("../functions/common");

const lists = require("../db/getList");
const flight = require("../functions/flight");

router.post("/search", async (req, res) => {
  try {
    let from = req?.body?.from || "";
    let to = req?.body?.to || "";
    let connection = req?.body?.connecting_flight || ""; //"true" or "false" or empty
    let seats = req?.body?.seats || "";

    let response = await lists.getSpecificList(from, to, connection, seats);

    for (var key in response) {
      console.log(key);
      if (response.hasOwnProperty(key)) {
        response[key] = {
          ...response[key]._doc,
          logo: await flight?.getFlightImage(response[key]?.airline),
        };
      }
    }

    res.send(common?.sendData(200, response));
  } catch (err) {
    res?.send(500);
    console.log(err);
  }
});

router.get("/searchById", async (req, res) => {
  try {
    let id = req?.query?.id;
    if (id && id != "") {
      let response = await lists.getFlightById(id);
      let data = [response?.data];
      for (var key in data) {
        console.log(data[key]?.airline);
        if (data.hasOwnProperty(key)) {
          data[key] = {
            ...data[key]._doc,
            logo: await flight?.getFlightImage(data[key]?.airline),
          };
        }
      }
      res?.send(
        common?.sendData(
          response?.status,
          data?.length > 0 ? data[0] : {} || {}
        )
      );
    }
  } catch (err) {
    res?.send(common?.sendData(500));
    console.log(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    let data = req.body;
    if (
      data &&
      data?.origin_city &&
      data?.destination_city &&
      data?.airline &&
      data?.available_seats &&
      data?.number_of_connections &&
      data?.price
    ) {
      let response = await lists.addFlightData(data);
      res.send(common?.sendData(response?.status, response?.data || ""));
    } else {
      res?.send(common?.sendData(400));
    }
  } catch (err) {
    res?.send(common?.sendData(500));
    console.log(err);
  }
});

module.exports = router;
