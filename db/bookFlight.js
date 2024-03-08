const mongoose = require("mongoose");
const db = require("./connection");
const flight = require("./getList");
db.connect();

const bookSchema = new mongoose.Schema({
  flightId: String,
  persons_details: Array,
  actual_price: Number,
  total_price: Number,
});

const BookModel = mongoose.model("flight_booked", bookSchema);

const getAllBookings = async () => {
  let resp = {};
  try {
    resp["data"] = await BookModel.find();
    resp["status"] = 200;
  } catch (err) {
    console.log(err);
    new_res["data"] = "";
    resp["status"] = 500;
  }
  return resp;
};

const onFlightBooking = async (data) => {
  let new_res = {};
  try {
    let no_of_passengers = data?.persons_details?.length || 0;
    const flight_data = await flight.getFlightById(data?.flightId);
    let price = flight_data?.price;

    let new_data = data;

    new_data.actual_price = price;
    new_data.total_price = price * no_of_passengers;
    if (flight_data?.available_seats >= no_of_passengers) {
      try {
        await BookModel.insertMany([new_data]);
        await flight.reduceSeats(data?.flightId, data?.persons_details?.length);

        new_res["data"] = "Flight booked successfully";
        new_res["status"] = 201;
      } catch (err) {
        new_res["status"] = 500;
        new_res["data"] = "";
        console.log(err);
        return new_res;
      }
    } else {
      new_res[
        "data"
      ] = `Only ${flight_data?.available_seats} seats are available`;
      new_res["status"] = 500;
    }
  } catch (err) {
    new_res["data"] = "";
    new_res["status"] = 500;
    console.log(err);
  }
  return new_res;
};

const getBookingById = async (id) => {
  let new_res = {};
  try {
    let res = await BookModel.find({ _id: id });
    new_res["data"] = res?.length > 0 ? res[0] : {};
    new_res["status"] = 200;
  } catch (err) {
    console.log(err);
    new_res["data"] = "";
    new_res[" status"] = 500;
  }
  return new_res;
};

const onCancelBooking = async (id) => {
  let new_res = {};
  try {
    let result = await getBookingById(id);
    let seats_booked = result?.persons_details?.length;

    await flight.addSeats(result?.flightId, seats_booked);
    await BookModel.deleteOne({ _id: id });

    new_res["data"] = "Booking deleted successfully";
    new_res["status"] = 200;
  } catch (err) {
    new_res["data"] = "";
    new_res["status"] = 500;
  }
};

const onUpdateFlightBooking = async (id, data) => {
  //test thoroughly
  let new_res = {};
  try {
    console.log(id, data);
    const result = await getBookingById(id);

    const flight_data = await flight.getFlightById(result?.flightId);

    let result_count =
      result?.persons_details && result?.persons_details?.length;
    let incoming_count = data?.length;

    //specially over here
    if (
      incoming_count > result_count &&
      incoming_count > flight_data?.available_seats
    ) {
      new_res[
        "data"
      ] = `Only ${flight_data?.available_seats} seats are available`;
      new_res["status"] = 500;
    } else {
      if (result_count != incoming_count) {
        if (result_count > incoming_count) {
          let count = result_count - incoming_count;
          await flight.addSeats(flight_data?._id, count);
        } else {
          let count = incoming_count - result_count;
          await flight.reduceSeats(flight_data?._id, count);
        }
      }

      let total_price = result?.actual_price * data?.length;

      await BookModel.updateOne(
        { _id: id },
        { persons_details: data, total_price: total_price }
      );
      new_res["data"] = `Flight booking updated successfully`;
      new_res["status"] = 200;
    }
  } catch (err) {
    new_res["status"] = 500;
    console.log(err);
  }
};

module.exports = {
  onFlightBooking,
  onUpdateFlightBooking,
  onCancelBooking,
  getBookingById,
  getAllBookings,
};
