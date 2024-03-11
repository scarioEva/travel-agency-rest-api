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

    res?.status(200).send(common?.sendData(200, response));
  } catch (err) {
    res?.status(500)?.send(500);
    console.log(err);
  }
});

router.get("/searchById", async (req, res) => {
  try {
    let id = req?.query?.id;
    if (id && id != "") {
      let response = await lists.getFlightById(id);
      let data = [response?.data];

      res
        ?.status(response?.status)
        ?.send(
          common?.sendData(
            response?.status,
            data?.length > 0 ? data[0] : {} || {}
          )
        );
    } else {
      res?.status(400).send(common?.sendData(400, "id is required"));
    }
  } catch (err) {
    res?.status(500)?.send(common?.sendData(500));
    console.log(err);
  }
});

router.post("/add", async (req, res) => {
  try {
    let data = req.body?.data;

    // console.log(data);
    if (
      data?.origin_city &&
      data?.destination_city &&
      data?.airline &&
      data?.available_seats &&
      data?.price &&
      data?.total_travel_time &&
      data?.from_time &&
      data?.to_time
    ) {
      let response = await lists.addFlightData(data);
      // console.log(response);
      res
        ?.status(response?.status)
        ?.send(common?.sendData(response?.status, response?.data || ""));
    } else {
      res
        ?.status(400)
        ?.send(common?.sendData(400, "Enter all the required fields"));
    }
  } catch (err) {
    res?.status(500)?.send(common?.sendData(500));
    console.log(err);
  }
});

module.exports = router;
