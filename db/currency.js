const mongoose = require("mongoose");
const db = require("./connection");
var ObjectID = require("mongodb").ObjectID;

db.connect();

const currencySchema = new mongoose.Schema({
  c_symbol: String,
  c_rate: String,
  c_code: String,
});

const CurrencyModel = mongoose.model("c_currencies", currencySchema);
const common_id = "65ecd02972e9dabbc7282396";

const updateCurrency = async (data) => {
  try {
    let res = await CurrencyModel.updateOne(
      { _id: common_id },
      { c_code: data?.code, c_rate: data?.rate, c_symbol: data?.symbol }
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};

const getCurrency = async () => {
  let new_res = {};
  try {
    let res = await CurrencyModel.find({ _id: common_id });
    new_res = { data: res?.length > 0 ? res[0] : {}, status: 200 };
  } catch (err) {
    new_res = { data: {}, status: 500 };
    console.log(err);
  }

  return new_res;
};

module.exports = { updateCurrency, getCurrency };
