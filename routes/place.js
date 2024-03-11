const express = require("express");
const router = express.Router();
const image = require("../functions/images");
const weather = require("../functions/weather");
const place = require("../functions/place");
const common = require("../functions/common");

router.get("/", async (req, res) => {
  let location = req?.query?.location;
  try {
    if (location && location != "") {
      let resp = await place.getCoordinates(location);
      res?.status(200)?.send(common?.sendData(200, resp));
    } else {
      res?.status(400)?.send(common?.sendData(400, "location is required"));
    }
  } catch (err) {
    res?.status(500)?.send(common?.sendData(500));
  }
});

router.get("/getImage", async (req, res) => {
  let name = req?.query?.name;

  try {
    if (name && name != "") {
      let response = await image.getUnsplashImage(name);
      res
        ?.status(response?.status)
        .send(common?.sendData(response?.status, response?.data || []));
    } else {
      res?.status(400)?.send(common?.sendData(400, "name is required"));
    }
  } catch (err) {
    res?.status(500)?.send(common?.sendData(500));
    console.log(err);
  }
});

router.get("/getWeather", async (req, res) => {
  let name = req?.query?.location;

  try {
    if (name && name != "") {
      let response = await weather.getWeather(name);
      res
        ?.status(response?.status)
        .send(common?.sendData(response?.status, response?.data));
    } else {
      res?.status(400)?.send(common?.sendData(400, "location is required"));
    }
  } catch (err) {
    res?.status(500)?.send(common?.sendData(500));
    console.log(err);
  }
});

router.get("/getDirection", async (req, res) => {
  let from = req?.query?.from;
  let to = req?.query?.to;
  try {
    if (from && from != "" && to && to != "") {
      let response = await place.getDirection(from, to);
      res
        .status(response?.status)
        .send(common?.sendData(response?.status, response?.data));
    } else {
      res
        ?.status(400)
        ?.send(common?.sendData(400, "from and to are required fields"));
    }
  } catch (err) {
    res?.status(500)?.send(common?.sendData(500));
    console.log(err);
  }
});

router.get("/getNearByCuisine", async (req, res) => {
  let location = req?.query?.location;
  let radius = req?.query?.radius || 500;
  try {
    if (location && location != "") {
      let response = await place.getNearByRestaurant(location, radius);
      res
        ?.status(response?.status)
        .send(common?.sendData(response?.status, response?.data));
    } else {
      res?.status(400)?.send(common?.sendData(400, "location is required"));
    }
  } catch (err) {
    res?.status(500)?.send(common?.sendData(500));
    console.log(err);
  }
});

router.get("/getNearByAttractions", async (req, res) => {
  let location = req?.query?.location;
  try {
    if (location && location != "") {
      let response = await place.getNearByAttractions(location);
      res
        ?.status(response?.status)
        ?.send(common?.sendData(response?.status, response?.data));
    } else {
      res?.status(400)?.send(common?.sendData(400, "location is required"));
    }
  } catch (err) {
    res?.status(500)?.send(common?.sendData(500));
    console.log(err);
  }
});

module.exports = router;
