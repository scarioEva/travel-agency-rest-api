const express = require("express");
const app = express();
// const fs = require("fs");
require("dotenv/config");

const flightRoute = require("./routes/flights");
const bookingRoute = require("./routes/booking");
const directionRoute = require("./routes/direction");

const { error } = require("console");

app.use(express.json());

app.get("/", async (req, res) => {});

app.use("/flight", flightRoute);

app.use("/booking", bookingRoute);

app.use("/direction", directionRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`port listening on ${port}`);
});
