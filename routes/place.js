const express = require("express");
const router = express.Router();
const image = require("../functions/images");
const weather = require("../functions/weather");
const place = require("../functions/place");

router.get("/getImage", async (req, res) => {
  let name = req?.query?.name;
  console.log(name);
  try {
    let response = await image.getUnsplashImage(name);

    res.send(response);
  } catch (err) {
    console.log(err);
  }
});

router.get("/getWeather", async (req, res) => {
  let name = req?.query?.name;
  try {
    let response = await weather.getWeather(name);

    res.send(response);
  } catch (err) {
    console.log(err);
  }
});

router.get("/getDirection", async (req, res) => {
  let from = req?.query?.from;
  let to = req?.query?.to;
  try {
    let response = await place.getDirection(from, to);

    res.send(response);
  } catch (err) {
    console.log(err);
  }
});

router.get("/getNeaByCuisine", async (req, res) => {
  let location = req?.query?.location;
  let radius = req?.query?.radius || 500;
  try {
    let response = await place.getNearByRestaurant(location, radius);

    res.send(response);
  } catch (err) {
    console.log(err);
  }
});

router.get("/getNeaByAttractions", async (req, res) => {
  let location = req?.query?.location;
  try {
    let response = await place.getNearByAttractions(location);

    res.send(response);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
