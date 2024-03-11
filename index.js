const express = require("express");
const app = express();
const cors = require("cors");
// const fs = require("fs");
require("dotenv/config");

const flightRoute = require("./routes/flights");
const bookingRoute = require("./routes/booking");
const placeRoute = require("./routes/place");
const curConvRoute = require("./routes/curConv");

const { error } = require("console");

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res?.send("N1202438_Akhil_Ashokan");
});

app.use("/flight", flightRoute);

app.use("/booking", bookingRoute);

app.use("/place", placeRoute);

app.use("/curConv", curConvRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`port listening on ${port}`);
});
