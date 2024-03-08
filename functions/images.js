const axios = require("axios");

const getUnsplashImage = async (name) => {
  try {
    const response = await axios.get(
      "https://api.unsplash.com/search/photos/",
      {
        params: {
          client_id: process.env.UNSPLASH_KEY,
          query: name,
        },
      }
    );
    let image_url = response?.data?.results[0]?.urls?.raw;

    return image_url;
  } catch (err) {
    console.log(err);
  }
};

const getFlickrImage = async (name) => {
  try {
    const response = await axios.get("https://www.flickr.com/services/rest", {
      params: {
        text: name + " location ",
        // tags: name,
        method: "flickr.photos.search",
        api_key: process.env.FLICKR_KEY,
        format: "json",
        // privacy_filter: 1,
        // accuracy: 1,
        // content_types: 0,
        // geo_context: 2,
        // content_type: 1,
        nojsoncallback: 1,
      },
    });
    let data = response?.data?.photos?.photo;

    let arr = [];
    for (let i = 0; i < 5; i++) {
      let file = data[i];
      let url = `https://live.staticflickr.com/${file?.server}/${file?.id}_${file?.secret}.jpg`;
      arr.push(url);
    }

    console.log(data);
    // let url = `https://live.staticflickr.com/{server-id}/{id}_{secret}.jpg`;
    // console.log(JSON.parse(response?.data));
    return arr;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getFlickrImage, getUnsplashImage };
