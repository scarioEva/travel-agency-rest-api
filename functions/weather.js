const axios = require("axios");

const getWeather = async (location) => {
  let new_res = {};
  try {
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
    let data = response?.data;
    let new_data = {};
    new_data["unit"] = "celsius";
    new_data["coord"] = data?.coord;
    new_data["weather"] = data?.weather?.map((itm) => ({
      main: itm?.main,
      desc: itm?.description,
      logo: `https://openweathermap.org/img/wn/${itm?.icon}@2x.png`,
    }));
    new_data["main"] = data?.main;
    new_data["main"]["pressure"] = data?.main?.pressure + " hPa";
    new_data["main"]["humidity"] = data?.main?.humidity + " %";
    new_data["visibility"] = data?.visibility + " m";
    new_data["wind"] = data?.wind;
    new_data["wind"]["speed"] = data?.wind?.speed + " meter/sec";
    new_data["clouds"] = data?.clouds;

    new_data["clouds"]["all"] = data?.clouds?.all + " %";
    new_data["sys"] = data?.sys;
    new_data["dt"] = data?.dt;

    new_res = { data: new_data, status: 200 };
  } catch (err) {
    console.log(err);
    new_res = { data: {}, status: 500 };
  }
  return new_res;
};

module.exports = { getWeather };
