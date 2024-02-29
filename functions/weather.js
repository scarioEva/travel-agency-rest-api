const axios = require("axios");

const getWeather = async (location) => {
  const response = await axios.get(
    "http://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        q: location,
        units: "metric",
        appid: process.env.OPEN_WEATHER_KEY,
      },
    }
  );
  return response?.data;
};

module.exports = { getWeather };
