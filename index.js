const express = require("express");
const axios = require("axios");
const app = express();
const fs = require("fs");
require("dotenv/config");

const lists = require("./db/getList");
const booking = require("./db/bookFlight");
const flight = require("./functions/flight");

const { error } = require("console");

app.use(express.json());

app.get("/", async (req, res) => {});

app.get("/availableFlight", async (req, res) => {
  try {
    let from = req?.body?.from || "";
    let to = req?.body?.to || "";
    let connection = req?.body?.connecting_flight || "";

    let response = await lists.getSpecificList(from, to, connection);

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

app.get("/flightById", async (req, res) => {
  let id = req.body?.id;
  console.log(req.body?.params);
  let response = await lists.getFlightById(id);
  res.send(response);
});

app.get("/flightBook", async (req, resp) => {
  let id = req.body?.id;
  const data = await booking.getBookingById(id);

  resp.send(data);
});
app.post("/flightBook", async (req, resp) => {
  const data = req?.body?.payload;
  await booking.onFlightBooking(data);
  resp.send("success");
});

app.put("/flightBook", async (req, resp) => {
  const data = req?.body?.payload;

  await booking.onUpdateFlightBooking(data?.id, data?.persons_details);
  resp.send("success");
});

app.delete("/flightBook", async (req, resp) => {
  const id = req?.body?.id;

  await booking.onCancelBooking(id);
  resp.send("deleted");
});

app.get("/direction", async (req, res) => {
  let from_data = req.body.from || "Birmingham";
  let to_data = req.body.to || "London";

  let data = await getDirection(from_data, to_data);
  res.send(data);
  //   res.send(res.json(response?.data));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`port listening on ${port}`);
});
