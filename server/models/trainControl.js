import mongoose from "mongoose";
const { Schema } = mongoose;

const trainControl = new Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    cars: {
      type: [
        {
          number: { type: Number },
          type: {
            type: String,

            default: "passengerCar",
            enum: ["passengerCar", "bikeCar", "engineCar"],
          },
          _id: false,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("TrainControl", trainControl);
