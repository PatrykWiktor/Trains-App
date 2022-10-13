import mongoose from "mongoose";

const { Schema } = mongoose;

const stationSchema = new Schema(
  {
    currStation: {
      type: String,
      required: true,
    },
    prevStations: {
      type: [
        {
          station: {
            type: mongoose.Schema.ObjectId,
            ref: "Station",
            required: false,
          },
          travelTime: {
            type: Number,
            required: false,
          },
        },
      ],
      _id: false,
    },
    nextStations: {
      type: [
        {
          station: {
            type: mongoose.Schema.ObjectId,
            ref: "Station",
            required: false,
          },
          travelTime: {
            type: Number,
            required: false,
          },
        },
      ],
      _id: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Station", stationSchema);
