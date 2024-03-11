const axios = require("axios");
const weathers = require("./weather");
const image = require("./images");

const getDirection = async (from, to) => {
  let new_res = {};
  try {
    const response = await axios.get(
      "https://www.mapquestapi.com/directions/v2/route",
      {
        params: {
          key: process.env.MAPQUEST_KEY,
          from: from,
          to: to,
          prefers: "highway",
        },
      }
    );

    let data = response?.data?.route;
    let new_data = {};
    new_data["distance"] = data?.distance + " miles";
    new_data["time_taken"] = data?.formattedTime;
    if (data?.legs?.length > 0) {
      new_data["directions"] = data?.legs[0]?.maneuvers?.map((itm) => ({
        distance: itm?.distance + " miles",
        time_takes: itm?.formattedTime,
        details: itm?.narrative,
        direction_at: itm?.directionName,
        coordinates: itm?.startPoint,
        street: itm?.streets?.toString().replaceAll(",", ", "),
        map: itm?.mapUrl,
      }));
    }

    new_res = { data: new_data, status: 200 };
  } catch (err) {
    new_res = { data: {}, status: 500 };
    console.log(err);
  }
  return new_res;
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
  // console.log(response?.data);
  return response?.data || {};
};

const getNearByRestaurant = async (location, radius) => {
  let new_res = {};
  try {
    let coordinates = await getCoordinates(location);

    // console.log(coordinates);
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
    // console.log("data:", data);
    let new_data = data?.map(
      (itm) =>
        itm?.name &&
        itm?.display_name && {
          name: itm?.name,
          address: itm?.display_name,
          distance: itm?.distance,
        }
    );

    new_res = { data: new_data?.filter((itm) => itm != null), status: 200 };
  } catch (err) {
    new_res = { data: [], status: 500 };
    console.log(err);
  }
  return new_res;
};

// const getAttractionDetails = async (pageId) => {
//   const apiUrl = `https://www.wikidata.org/w/api.php?action=parse&pageid=${pageId}&format=json&prop=wikitext`;
//   const imageApiUrl = `https://www.wikidata.org/w/api.php?action=parse&pageid=${pageId}&format=json&prop=images`;

//   try {
//     const response = await axios.get(apiUrl);
//     const imageResponse = await axios.get(imageApiUrl);
//     const data = await response?.data;
//     const imageData = await imageResponse?.data;
//     console.log(imageData);

//     if (data.parse && data.parse.wikitext) {
//       const wikitext = data.parse.wikitext["*"];
//       const wiki_data = JSON.parse(wikitext);
//       let desc = wiki_data?.descriptions?.en?.value;
//       let title = wiki_data?.sitelinks?.enwiki?.title;

//       let image = null;
//       if (imageData.parse.images && imageData.parse.images.length > 0) {
//         const imageTitle = imageData.parse.images[0];
//         image = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
//           imageTitle
//         )}`;
//       }
//       let obj = { title: title, desc: desc, image: image };
//       return obj;
//     } else {
//       return { description: null, image: null };
//     }
//   } catch (error) {
//     console.error("Error fetching attraction details:", error);
//     return { description: null, image: null };
//   }
// };

const getNearByAttractions = async (location) => {
  // let coordinates = await getCoordinates(location);
  // let isoCoordinates = coordinates?.lat + "|" + coordinates?.lon;
  // const apiUrl = `https://www.wikidata.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${isoCoordinates}&format=json`;
  // try {
  //   // Fetch data from the Wikidata API
  //   const response = await axios.get(apiUrl);
  //   const data = await response?.data;
  //   // console.log(data);
  //   // Check if there are any results
  //   if (data.query && data.query.geosearch && data.query.geosearch.length > 0) {
  //     // Extract relevant information about nearby attractions
  //     const attractions = await Promise.all(
  //       data.query.geosearch.map(async (attraction) => {
  //         // console.log(attraction);
  //         const details = await getAttractionDetails(attraction.pageid);
  //         return {
  //           title: attraction.title,
  //           lat: attraction.lat,
  //           lon: attraction.lon,
  //           distance: attraction.dist,
  //           data: details,
  //         };
  //       })
  //     );
  //     // console.log(attractions);
  //     let new_data = attractions?.filter((itm) => itm?.data);
  //     return { data: attractions, status: 200 };
  //     // return { data: new_data?.map((itm) => itm?.data), status: 200 };
  //   } else {
  //     return { data: "No nearby attractions found.", status: 400 };
  //   }
  // } catch (error) {
  //   console.error("Error fetching data:", error);
  //   return { data: "An error occurred while fetching data.", status: 500 };
  // }

  let new_res = {};
  try {
    let coordinates = await getCoordinates(location);
    console.log(coordinates);
    let isoCoordinates =
      coordinates?.lat +
      (coordinates?.lon?.toString()?.slice(0, 1) != "-" ? "+" : "") +
      coordinates?.lon;
    console.log(isoCoordinates);
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
    let new_data = res?.data?.data;
    let final_data = [];
    new_data?.map(async (itm) => {
      let details = await getNearByAttractions(itm?.wikiDataId);
      final_data.push({ ...{ name: itm?.name }, ...details });
    });
    new_res = { data: final_data, status: 200 };
  } catch (err) {
    new_res = { data: [], status: 500 };
    console.log(err);
  }
  return new_res;
};

module.exports = {
  getDirection,
  getNearByRestaurant,
  getCoordinates,
  getNearByAttractions,
};
