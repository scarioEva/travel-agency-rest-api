const mongoose = require("mongoose");
const db = require("./connection");

db.connect();
const flight = require("../functions/flight");

const listSchema = new mongoose.Schema({
  origin_city: String,
  destination_city: String,
  airline: String,
  available_seats: Number,
  number_of_connections: Number,
  price: Number,
  total_travel_time: String,
  from_time: String,
  to_time: String,
  logo: String,
});
const ListModel = mongoose.model("available_flights", listSchema);

const getSpecificList = async (origin, destination, connection, seats) => {
  let resp;
  let payload = {};
  if (origin) {
    payload = { ...payload, ...{ origin_city: origin } };
  }
  if (seats) {
    payload = { ...payload, ...{ available_seats: { $gte: seats } } };
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
  payload = { ...payload, ...{ available_seats: { $gt: 0 } } };

  // let new_res = {};
  try {
    resp = await ListModel.find(payload).collation({
      locale: "en",
      strength: 2,
    });
    // new_res["data"] = resp;
  } catch (err) {
    console.log(err);
  }
  return resp;
};

//note:not called anywhere
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
    return { data: res?.length > 0 ? res[0] : {}, status: 200 };
  } catch (err) {
    console.log(err);
    return { status: 500 };
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

const addFlightData = async (data) => {
  try {
    console.log(data);
    let payload = data;
    payload["number_of_connections"] = data?.number_of_connections || 0;
    payload["logo"] = await flight?.getFlightImage(data?.airline);

    await ListModel.insertMany([payload]);
    return { data: "Flight added Successfully!", status: 201 };
  } catch (err) {
    console.log(err);
    return { data: "", status: 500 };
  }
};

module.exports = {
  getList,
  getSpecificList,
  reduceSeats,
  addSeats,
  getFlightById,
  addFlightData,
};
