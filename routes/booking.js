const express = require("express");
const router = express.Router();
const booking = require("../db/bookFlight");
const common = require("../functions/common");

router.get("/getAll", async (req, resp) => {
  try {
    const data = await booking.getAllBookings();
    resp?.send(common?.sendData(data?.status, data?.data || []));
  } catch (err) {
    resp?.send(common?.sendData(500));
    console.log(err);
  }
});

router.get("/getById", async (req, resp) => {
  try {
    let id = req.body?.id;
    if (id && id != "") {
      const data = await booking.getBookingById(id);
      resp.send(common?.sendData(data?.status, data?.data || {}));
    } else {
      resp?.send(common?.sendData(400));
    }
  } catch (err) {
    resp?.send(common?.sendData(500));
    console.log(err);
  }
});

router.post("/add", async (req, resp) => {
  try {
    const data = req?.body?.payload;
    if (data) {
      let response = await booking.onFlightBooking(data);
      resp?.send(common?.sendData(response?.status, response?.data || ""));
    } else {
      resp?.send(common?.sendData(400));
    }
  } catch (err) {
    resp?.send(common?.sendData(500));
    console.log(err);
  }
});

router.put("/update", async (req, resp) => {
  try {
    const data = req?.body?.payload;
    if (
      data &&
      data?.id &&
      data?.persons_details &&
      data?.id != "" &&
      data?.persons_details != ""
    ) {
      const response = await booking.onUpdateFlightBooking(
        data?.id,
        data?.persons_details
      );
      resp.send(common?.sendData(response?.status, data?.data || ""));
    } else {
      resp?.send(common?.sendData(400));
    }
  } catch (err) {
    console.log(err);
    resp?.send(common?.sendData(500));
  }
});

router.delete("/delete", async (req, resp) => {
  try {
    const id = req?.body?.id;
    if (id && id != "") {
      let response = await booking.onCancelBooking(id);
      resp.send(common?.sendData(response?.status, response?.data || ""));
    } else {
      resp?.send(common?.data(400));
    }
  } catch (err) {
    console.log(err);
    resp.send(common?.sendData(500));
  }
});

module.exports = router;
