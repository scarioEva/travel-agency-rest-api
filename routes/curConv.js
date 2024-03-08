const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const common = require("../functions/common");

router.get("/getList", async (req, res) => {
  try {
    const response = await axios.get(`${process.env.CUR_CONV_URL}/curCodes`);
    if (response?.data) {
      res?.send(common.sendData(200, response?.data?.CurrConv || []));
    } else res?.send(common?.sendData(400));
  } catch (e) {
    res?.send(common?.sendData(500));
    console.log(e);
  }
});

router.post("/chgRate", async (req, res) => {
  try {
    let payload = req?.body?.payload;
    if (
      payload?.rate &&
      payload?.code &&
      payload?.code !== "" &&
      payload?.rate !== ""
    ) {
      const response = await axios.get(
        `${process.env.CUR_CONV_URL}/chgrate?code=${payload?.code}&rate=${payload?.rate}`
      );
      res.send(common?.sendData(200, response?.data));
    } else {
      res?.send(common?.sendData(400));
    }
  } catch (e) {
    res?.send(common?.sendData(500));
    console.log(e);
  }
});

router.post("/exchangeRate", async (req, res) => {
  try {
    let payload = req?.body?.payload;
    if (
      payload?.fromCur &&
      payload?.toCur &&
      payload?.fromCur !== "" &&
      payload?.toCur !== ""
    ) {
      const response = await axios.get(
        `${process.env.CUR_CONV_URL}/exchangeRate?fromCur=${payload?.fromCur}&toCur=${payload?.toCur}`
      );
      res?.send(common?.sendData(200, response?.data));
    } else {
      res?.send(common?.sendData(400));
    }
  } catch (e) {
    res?.send(common?.sendData(500));
    console.log(e);
  }
});

module.exports = router;
