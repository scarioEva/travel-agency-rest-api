const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const connect = () => {
  const db = mongoose.connection;

  db.on("error", (error) => console.log(error));
  db.once("open", () => console.log("connected to db"));

  return db;
};

module.exports = { connect };
