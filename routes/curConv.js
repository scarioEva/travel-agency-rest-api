const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();
const common = require("../functions/common");
const symbol = require("../functions/currencyConvert");
const curDb = require("../db/currency");

router.get("/getList", async (req, res) => {
  try {
    const response = await axios.get(`${process.env.CUR_CONV_URL}/curCodes`);
    if (response?.data) {
      res
        ?.status(200)
        ?.send(common.sendData(200, response?.data?.CurrConv || []));
    } else res?.status(400)?.send(common?.sendData(400));
  } catch (e) {
    res?.status(500)?.send(common?.sendData(500));
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
      res?.status(200)?.send(common?.sendData(200, response?.data));
    } else {
      res
        ?.status(400)
        ?.send(common?.sendData(400, "code and rate are required"));
    }
  } catch (e) {
    res?.status(500)?.send(common?.sendData(500));
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
      res?.status(200)?.send(common?.sendData(200, response?.data));
    } else {
      res?.status(400)?.send(common?.sendData(400));
    }
  } catch (e) {
    res?.status(500)?.send(common?.sendData(500));
    console.log(e);
  }
});

router.post("/setCurrency", async (req, res) => {
  try {
    let code = req?.body?.code;
    let rate = req?.body?.rate;

    if (code && code != "" && rate && rate != null) {
      let get_symbol = symbol?.getCurrencySymbol(code);
      let payload = {
        symbol: get_symbol,
        code: code,
        rate: rate,
      };
      // console.log(payload);
      await curDb?.updateCurrency(payload);

      res?.status(200)?.send(common?.sendData(200, "currency updated"));
    } else {
      res
        ?.status(400)
        ?.send(common?.sendData(400, "code and rate are required"));
    }
  } catch (err) {
    res?.status(500)?.send(common?.sendData(500));
    console.log(err);
  }
});

router.get("/getSelectedCurrency", async (req, res) => {
  try {
    let resp = await curDb?.getCurrency();
    res?.status(resp?.status)?.send(common?.sendData(resp?.status, resp?.data));
  } catch (err) {
    res?.status(500)?.send(common?.sendData(500));
    console.log(err);
  }
});

module.exports = router;
