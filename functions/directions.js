const axios = require("axios");
const weathers = require("./weather");
const image = require("./images");

const getDirection = async (from, to) => {
  const response = await axios.get(
    "https://www.mapquestapi.com/directions/v2/route",
    {
      params: {
        key: process.env.MAPQUEST_KEY,
        from: from,
        to: to,
      },
    }
  );

  let lat = response?.data?.route?.locations[1]?.latLng?.lat;
  let lng = response?.data?.route?.locations[1]?.latLng?.lng;
  let location = response?.data?.route?.locations[1]?.adminArea5;
  let weather = await weathers.getWeather(lat, lng);
  let image_url = await image.getImage(location);
  let data = response?.data;
  data["weather"] = weather;
  data["image_url"] = image_url;

  return data;
};

module.exports = { getDirection };
