const express = require("express");
const router = express.Router();
const booking = require("../db/bookFlight");

router.get("/getAll", async (req, resp) => {
  const data = await booking.getAllBookings();
  resp.send(data);
});

router.get("/getById", async (req, resp) => {
  let id = req.body?.id;
  const data = await booking.getBookingById(id);

  resp.send(data);
});

router.post("/add", async (req, resp) => {
  const data = req?.body?.payload;
  let response = await booking.onFlightBooking(data);
  resp.send(response);
});

router.put("/update", async (req, resp) => {
  const data = req?.body?.payload;
  const response = await booking.onUpdateFlightBooking(
    data?.id,
    data?.persons_details
  );
  resp.send(response);
});

router.delete("/delete", async (req, resp) => {
  const id = req?.body?.id;
  await booking.onCancelBooking(id);
  resp.send("deleted");
});

module.exports = router;
