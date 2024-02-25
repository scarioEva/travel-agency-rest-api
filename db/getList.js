const mongoose = require("mongoose");
const db = require("./connection");

db.connect();

const listSchema = new mongoose.Schema({
  origin_city: String,
  destination_city: String,
  airline: String,
  available_seats: Number,
  number_of_connections: Number,
});
const ListModel = mongoose.model("available_flights", listSchema);

const getList = async () => {
  let resp;
  try {
    resp = await ListModel.find();
  } catch {}
  console.log(resp);
  return resp;
};

module.exports = { getList };
