const axios = require("axios");

const getFlightImage = async (name) => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.NINJA_URL}airlines?name=${name}`,
      headers: {
        "X-Api-Key": process.env.NINJA_KEY,
      },
    };

    let res = await axios.request(config);

    if (res?.data?.length > 0) {
      return res?.data[0]?.logo_url;
    } else return "";
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getFlightImage };
