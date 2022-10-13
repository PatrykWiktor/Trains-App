import mongoose from "mongoose";
const { Schema } = mongoose;

const trainSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    cars: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Car",
        },
      ],
    },
    run:{
      type: mongoose.Schema.ObjectId,
      ref: "Run",
      required: false
    },
    assignedRoute: {
      type: mongoose.Schema.ObjectId,
      ref: "Route",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Train", trainSchema);
