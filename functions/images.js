const axios = require("axios");

const getUnsplashImage = async (name) => {
  const response = await axios.get("https://api.unsplash.com/search/photos/", {
    params: {
      client_id: process.env.UNSPLASH_KEY,
      query: name,
    },
  });
  let image_url = response?.data?.results[0]?.urls?.raw;

  return image_url;
};

const getFlickrImage = async (name) => {
  //   const response = await axios.get("https://www.flickr.com/services/rest", {
  //     params: {
  //       method: "flickr.photo.search",
  //       api_key: process.env.FLICKR_KEY,
  //       tags: "London",
  //     },
  //   });
  //   let url = `https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg`;
  // return image_url;
};

module.exports = { getFlickrImage, getUnsplashImage };
