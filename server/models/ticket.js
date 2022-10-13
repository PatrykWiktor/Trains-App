import mongoose from "mongoose";
const { Schema } = mongoose;

const ticketSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
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
    seats: {
      type: [{ type: mongoose.Schema.ObjectId, ref: "Seat", required: false }],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
