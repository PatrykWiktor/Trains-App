import mongoose from "mongoose";
const { Schema } = mongoose;

const routeSchema = new Schema(
  {
    routeName: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    startStation: {
      type: mongoose.Schema.ObjectId,
      ref: "Station",
      required: false,
    },
    endStation: {
      type: mongoose.Schema.ObjectId,
      ref: "Station",
      required: false,
    },
    stops: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Station",
          required: false,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Route", routeSchema);
