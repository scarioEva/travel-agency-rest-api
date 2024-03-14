const express = require("express");
const router = express.Router();
const booking = require("../db/bookFlight");
const common = require("../functions/common");

router.get("/", async (req, resp) => {
  resp?.send("calling");
});

router.get("/getAll", async (req, resp) => {
  try {
    const data = await booking.getAllBookings();
    resp
      ?.status(data?.status)
      ?.send(common?.sendData(data?.status, data?.data || []));
  } catch (err) {
    resp.status(500)?.send(common?.sendData(500));
    console.log(err);
  }
});

router.post("/getById", async (req, resp) => {
  try {
    let id = req?.body?.id;
    let flightId = req?.body?.flightId || false;
    if (id && id != "") {
      const data = await booking.getBookingById(id, flightId);
      resp
        ?.status(data?.status)
        .send(common?.sendData(data?.status, data?.data || {}));
    } else {
      resp?.status(400)?.send(common?.sendData(400));
    }
  } catch (err) {
    resp?.status(500)?.send(common?.sendData(500));
    // console.log(err);
  }
});

const passengerCheck = (array) => {
  let failed = array?.filter((itm) => !itm?.name || !itm?.age);
  return failed?.length == 0;
};

router.post("/add", async (req, resp) => {
  try {
    const data = req?.body?.payload;

    if (passengerCheck(data?.passenger_details)) {
      let response = await booking.onFlightBooking(data);
      resp
        ?.status(response?.status)
        ?.send(common?.sendData(response?.status, response?.data || ""));
    } else {
      resp
        ?.status(400)
        ?.send(common?.sendData(400, "Enter all the passenger details"));
    }
  } catch (err) {
    resp?.status(500)?.send(common?.sendData(500));
    console.log(err);
  }
});

router.put("/update", async (req, resp) => {
  try {
    const data = req?.body?.payload;
    if (passengerCheck(data?.passenger_details)) {
      const response = await booking.onUpdateFlightBooking(
        data?.id,
        data?.passenger_details
      );
      resp
        ?.status(response?.status)
        .send(common?.sendData(response?.status, response?.data || ""));
    } else {
      resp
        ?.status(400)
        ?.send(common?.sendData(400, "Enter all the passenger fields"));
    }
  } catch (err) {
    console.log("err", err);
    resp?.status(500)?.send(common?.sendData(500));
  }
});

router.delete("/delete", async (req, resp) => {
  try {
    const id = req?.query?.id;
    if (id && id != "") {
      let response = await booking.onCancelBooking(id);
      resp
        ?.status(response?.status)
        ?.send(common?.sendData(response?.status, response?.data || ""));
    } else {
      resp?.status(400)?.send(common?.sendData(400));
    }
  } catch (err) {
    console.log(err);
    resp?.status(500)?.send(common?.sendData(500));
  }
});

module.exports = router;
