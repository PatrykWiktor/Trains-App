import mongoose from "mongoose";

const { Schema } = mongoose;

const carSchema = new Schema(
  {
    type: {
      type: String,
      default: "passengerCar",
      enum: ["passengerCar", "bikeCar", "engineCar"],
    },
    number: {
      type: Number,
      required: true,
      unique: false,
    },
    assignedTrain: {
      type: mongoose.Schema.ObjectId,
      ref: "Train",
      required: false,
    },
    seats: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: "Seat",
          required: false,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
