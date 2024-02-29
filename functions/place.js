const axios = require("axios");
const weathers = require("./weather");
const image = require("./images");

const getDirection = async (from, to) => {
  try {
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

    let data = response?.data?.route;
    let new_data = {};
    new_data["distance"] = data?.distance;
    new_data["time_taken"] = data?.formattedTime;
    if (data?.legs?.length > 0) {
      new_data["directions"] = data?.legs[0]?.maneuvers?.map((itm) => ({
        distance: itm?.distance,
        time_takes: itm?.formattedTime,
        details: itm?.narrative,
        direction_at: itm?.directionName,
        coordinates: itm?.startPoint,
        street: itm?.streets?.toString().replaceAll(",", ", "),
        map: itm?.mapUrl,
      }));
    }

    // let lat = response?.data?.route?.locations[1]?.latLng?.lat;
    // let lng = response?.data?.route?.locations[1]?.latLng?.lng;
    // let location = response?.data?.route?.locations[1]?.adminArea5;
    // let weather = await weathers.getWeather(to);
    // let image_url = await image.getUnsplashImage(location);
    // let data = response?.data;
    // data["weather"] = weather;
    // data["image_url"] = image_url;
    // console.log(response);
    // return new_data;
    return data?.locations;
  } catch (err) {
    console.log(err);
  }
};

const getCoordinates = async (location) => {
  const response = await axios.get(
    "https://opentripmap-places-v1.p.rapidapi.com/en/places/geoname",
    {
      params: {
        name: location,
        lang: "en",
      },
      headers: {
        "X-RapidAPI-Key": process?.env?.RAPID_API_KEY,
        "X-RapidAPI-Host": "opentripmap-places-v1.p.rapidapi.com",
      },
    }
  );
  return response?.data || {};
};

const getNearByRestaurant = async (location, radius) => {
  try {
    let coordinates = await getCoordinates(location);

    let res = await axios.get("https://eu1.locationiq.com/v1/nearby", {
      params: {
        key: process?.env?.LOCATION_IQ_KEY,
        lat: coordinates?.lat,
        lon: coordinates?.lon,
        tag: "restaurant",
        radius: radius,
        format: "json",
      },
    });

    let data = res?.data;
    let new_data = data?.map(
      (itm) =>
        itm?.name &&
        itm?.display_name && {
          name: itm?.name,
          address: itm?.display_name,
        }
    );

    return new_data?.filter((itm) => itm != null);
  } catch (err) {
    console.log(err);
  }
};

const getNearByAttractions = async (location) => {
  try {
    let coordinates = await getCoordinates(location);

    let isoCoordinates =
      coordinates?.lat +
      (coordinates?.lon?.toString()?.slice(0, 1) != "-" ? "+" : "") +
      coordinates?.lon;
    const res = await axios?.get(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${isoCoordinates}/nearbyPlaces`,
      {
        params: {
          radius: 100,
        },
        headers: {
          "X-RapidAPI-Key": process?.env?.RAPID_API_KEY,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      }
    );

    return res?.data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getDirection,
  getNearByRestaurant,
  getCoordinates,
  getNearByAttractions,
};
