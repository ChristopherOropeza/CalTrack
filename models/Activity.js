const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  activity: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Activity", ActivitySchema);