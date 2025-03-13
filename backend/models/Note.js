const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  title: { type: String, required: true },
});

module.exports = mongoose.model("Note", noteSchema);
