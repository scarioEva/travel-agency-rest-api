const mongoose = require("mongoose");
const db = require("./connection");
const flight = require("./getList");
db.connect();

const bookSchema = new mongoose.Schema({
  flightId: String,
  persons_details: Array,
});

const BookModel = mongoose.model("flight_booked", bookSchema);

const getBookingById = async (id) => {
  try {
    let res = await BookModel.find({ flightId: id });
    return res?.length > 0 ? res[0] : {};
  } catch (err) {
    console.log(err);
  }
};

const onCancelBooking = async (flightId) => {
  try {
    let result = await getBookingById(flightId);
    let seats_booked = result?.persons_details?.length;
    await flight.addSeats(flightId, seats_booked);

    await BookModel.deleteOne({ flightId: flightId });
  } catch (err) {}
};

const onUpdateFlightBooking = async (id, data) => {
  try {
    console.log(id, data);
    const result = await getBookingById(id);

    let result_count =
      result?.persons_details && result?.persons_details?.length;
    let incoming_count = data?.length;

    console.log(result_count, incoming_count);

    if (result_count > incoming_count) {
      let count = result_count - incoming_count;
      await flight.addSeats(id, count);
    } else {
      let count = incoming_count - result_count;
      await flight.reduceSeats(id, count);
    }

    await BookModel.updateOne({ flightId: id }, { persons_details: data });
  } catch (err) {
    console.log(err);
  }
};

const onFlightBooking = async (data) => {
  try {
    console.log("call");
    await BookModel.insertMany([data]);
    await flight.reduceSeats(data?.flightId, data?.persons_details?.length);
  } catch {}
};

module.exports = {
  onFlightBooking,
  onUpdateFlightBooking,
  onCancelBooking,
  getBookingById,
};
