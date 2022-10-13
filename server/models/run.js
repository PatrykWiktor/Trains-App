import mongoose from "mongoose";
const { Schema } = mongoose;
const moment = require('moment-timezone');


const runSchema = new Schema(
  {
    route: {
      type: mongoose.Schema.ObjectId,
      ref: "Route",
      required: false,
    },
    assignedTrain: {
      type: mongoose.Schema.ObjectId,
      ref: "Train",
      required: false,
    },
    onRun: {
      type: Boolean,
      required: false,
    },
    departureTime:{
      type: Date,
      required: false,
      
    }
  },
  { timestamps: true }
);

export default mongoose.model("Run", runSchema);
