const axios = require("axios");

const getUnsplashImage = async (name) => {
  let new_res = {};
  try {
    const response = await axios.get(
      "https://api.unsplash.com/search/photos/",
      {
        params: {
          client_id: process.env.UNSPLASH_KEY,
          query: name,
          orientation: "landscape",
        },
      }
    );
    let image_url = response?.data?.results
      ?.map((itm, idx) => idx <= 5 && itm?.urls?.raw)
      .filter((itm) => itm);

    new_res = { data: image_url, status: 200 };
  } catch (err) {
    new_res = { status: 500 };
    console.log(err);
  }
  return new_res;
};

module.exports = { getUnsplashImage };
