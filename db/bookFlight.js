const mongoose = require("mongoose");
const db = require("./connection");
const flight = require("./getList");
const flightImage = require("../functions/flight");
db.connect();

const bookSchema = new mongoose.Schema({
  flightId: String,
  passenger_details: Array,
  actual_price: Number,
  total_price: Number,
});

const BookModel = mongoose.model("flight_booked", bookSchema);

const getAllBookings = async () => {
  let resp = {};
  try {
    let response = await BookModel.find();
    for (var key in response) {
      if (response.hasOwnProperty(key)) {
        let flight_data = await flight?.getFlightById(response[key]?.flightId);
        let data = [flight_data?.data];

        response[key] = {
          ...response[key]._doc,
          flight_details: {
            origin_city: data[0]?.origin_city,
            destination_city: data[0].destination_city,
            airline: data[0]?.airline,
            number_of_connection: data[0]?.number_of_connection,
            total_travel_time: data[0]?.total_travel_time,
            from_time: data[0]?.from_time,
            to_time: data[0]?.to_time,
            logo: data[0]?.logo,
          },
        };
      }
    }
    resp["data"] = response;
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
    let no_of_passengers = data?.passenger_details?.length || 0;
    const flight_data = await flight.getFlightById(data?.flightId);
    let price = flight_data?.data?.price;

    let new_data = data;
    new_data.actual_price = price;
    new_data.total_price = price * no_of_passengers;
    if (flight_data?.data?.available_seats >= no_of_passengers) {
      try {
        console.log("calling");
        await BookModel.insertMany([new_data]);
        await flight.reduceSeats(
          data?.flightId,
          data?.passenger_details?.length
        );

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
      ] = `Only ${flight_data?.data?.available_seats} seats are available`;
      new_res["status"] = 500;
    }
  } catch (err) {
    new_res["data"] = "";
    new_res["status"] = 500;
    console.log(err);
  }
  return new_res;
};

const getBookingById = async (id, flightId) => {
  console.log(id, flightId);
  let new_res = {};
  try {
    let res;
    if (flightId) {
      res = await BookModel.find({ flightId: id });
      if (res) {
        new_res["data"] = res?.length > 0 ? res[0] : {};
        new_res["status"] = 200;
      } else {
        new_res["data"] = "data not found";
        new_res["status"] = 404;
      }
    } else {
      res = await BookModel.findOne({ _id: id });
      console.log(res);
      if (res) {
        new_res["data"] = res || {};
        new_res["status"] = 200;
      } else {
        new_res["data"] = "data not found";
        new_res["status"] = 404;
      }
    }
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
    let seats_booked = result?.data?.passenger_details?.length;

    await flight.addSeats(result?.data?.flightId, seats_booked);
    await BookModel.deleteOne({ _id: id });

    new_res["data"] = "Booking deleted successfully";
    new_res["status"] = 200;
  } catch (err) {
    new_res["data"] = "";
    new_res["status"] = 500;
  }
  return new_res;
};

const onUpdateFlightBooking = async (id, data) => {
  let new_res = {};
  try {
    const result = await getBookingById(id);

    const flight_data = await flight.getFlightById(result?.data?.flightId);

    let result_count =
      result?.data?.passenger_details &&
      result?.data?.passenger_details?.length;
    let incoming_count = data?.length;
    console.log("incoming", incoming_count);
    console.log("result", result_count);
    console.log("avaial", flight_data?.data?.available_seats);

    // if(result_count>incoming_count && incoming_count)

    if (
      incoming_count > result_count &&
      incoming_count - result_count > flight_data?.data?.available_seats
    ) {
      new_res[
        "data"
      ] = `Only ${flight_data?.data?.available_seats} seats are available`;
      new_res["status"] = 500;
    } else {
      if (result_count != incoming_count) {
        if (result_count > incoming_count) {
          let count = result_count - incoming_count;
          await flight.addSeats(flight_data?.data?._id, count);
        } else {
          let count = incoming_count - result_count;
          await flight.reduceSeats(flight_data?.data?._id, count);
        }
      }

      let total_price = result?.data?.actual_price * data?.length;
      await BookModel.updateOne(
        { _id: id },
        { passenger_details: data, total_price: total_price }
      );
      new_res["data"] = `Flight booking updated successfully`;
      new_res["status"] = 200;
    }
  } catch (err) {
    new_res["status"] = 500;
    console.log(err);
  }
  return new_res;
};

module.exports = {
  onFlightBooking,
  onUpdateFlightBooking,
  onCancelBooking,
  getBookingById,
  getAllBookings,
};
