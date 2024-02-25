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

const getSpecificList = async (origin, destination, connection) => {
  let resp;
  let payload = {};
  if (origin) {
    payload = { ...payload, ...{ origin_city: origin } };
  }

  if (destination) {
    payload = { ...payload, ...{ destination_city: destination } };
  }

  if (connection) {
    if (connection == "true") {
      payload = { ...payload, ...{ number_of_connections: { $gt: 0 } } };
    } else {
      payload = { ...payload, ...{ number_of_connections: 0 } };
    }
  }

  try {
    resp = await ListModel.find(payload);
  } catch (err) {
    console.log(err);
  }
  return resp;
};

const getList = async () => {
  let resp;
  try {
    resp = await ListModel.find({ origin_city: "" });
  } catch (err) {
    console.log(err);
  }
  return resp;
};

const getFlightById = async (id) => {
  try {
    let res = await ListModel.find({ _id: id });
    return res?.length > 0 ? res[0] : {};
  } catch (err) {
    console.log(err);
  }
};

const addSeats = async (id, count) => {
  console.log(id, count);
  try {
    let res = await ListModel.findById(id);
    await ListModel.updateOne(
      { _id: id },
      { available_seats: res?.available_seats + count }
    );
  } catch (err) {
    console.log(err);
  }
};

const reduceSeats = async (id, count) => {
  console.log(id, count);
  try {
    let res = await ListModel.findById(id);
    await ListModel.updateOne(
      { _id: id },
      { available_seats: res?.available_seats - count }
    );
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getList,
  getSpecificList,
  reduceSeats,
  addSeats,
  getFlightById,
};
