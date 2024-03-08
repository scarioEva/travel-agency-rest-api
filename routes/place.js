const express = require("express");
const router = express.Router();
const image = require("../functions/images");
const weather = require("../functions/weather");
const place = require("../functions/place");
const common = require("../functions/common");

router.get("/getImage", async (req, res) => {
  let name = req?.query?.name;

  try {
    if (name && name != "") {
      let response = await image.getUnsplashImage(name);
      res.send(common?.sendData(200, response));
    } else {
      res?.send(common?.sendData(400));
    }
  } catch (err) {
    res?.send(common?.sendData(500));
    console.log(err);
  }
});

router.get("/getWeather", async (req, res) => {
  let name = req?.query?.name;

  try {
    if (name && name != "") {
      let response = await weather.getWeather(name);
      res.send(common?.sendData(200, response));
    } else {
      res?.send(common?.sendData(400));
    }
  } catch (err) {
    res?.send(common?.sendData(500));
    console.log(err);
  }
});

router.get("/getDirection", async (req, res) => {
  let from = req?.query?.from;
  let to = req?.query?.to;
  try {
    if (from && from != "" && to && to != "") {
      let response = await place.getDirection(from, to);
      res.send(common?.sendData(200, response));
    } else {
      res?.send(common?.sendData(400));
    }
  } catch (err) {
    res?.send(common?.sendData(500));
    console.log(err);
  }
});

router.get("/getNeaByCuisine", async (req, res) => {
  let location = req?.query?.location;
  let radius = req?.query?.radius || 500;
  try {
    if (location && location != "") {
      let response = await place.getNearByRestaurant(location, radius);
      res.send(common?.sendData(200, response));
    } else {
      res?.send(common?.sendData(400));
    }
  } catch (err) {
    res?.send(common?.sendData(500));
    console.log(err);
  }
});

router.get("/getNeaByAttractions", async (req, res) => {
  let location = req?.query?.location;
  try {
    if (location && location != "") {
      let response = await place.getNearByAttractions(location);
      res.send(common?.sendData(200, response));
    } else {
      res?.send(common?.sendData(400));
    }
  } catch (err) {
    res?.send(common?.sendData(500));
    console.log(err);
  }
});

module.exports = router;
