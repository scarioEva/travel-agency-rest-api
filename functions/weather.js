const axios = require("axios");

const getWeather = async (lat, long) => {
  const response = await axios.get(
    "https://api.tomorrow.io/v4/weather/forecast",
    {
      params: {
        location: lat + "," + long,
        apikey: process.env.TOMORROW_WEATHER_KEY,
      },
    }
  );
  return response?.data;
};
module.exports = { getWeather };
