import mongoose from "mongoose";
const { Schema } = mongoose;

const seatSchema = new Schema(
  {
    number: {
      type: Number,
    },
    position: {
      type: String,
      default: "aisle",
      enum: ["window", "aisle"],
    },
    vacuity: [
      {
        _id: false,
        stop: {
          type: mongoose.Schema.ObjectId,
          ref: "Station",
        },
        occupied: {
          type: Boolean,
          default: false,
          required: false,
        },
      },
    ],
    assignedCar: {
      type: mongoose.Schema.ObjectId,
      ref: "Car",
      required: false,
    },
  },
  { timestamps: true }
);
//method
seatSchema.methods.getTaken = function(){
  let seatsOccupied = 0
  this.vacuity.map((x)=>{
    if(x.occupied == true) seatsOccupied++
  })
  //.filter((x)=> x === true)
  return seatsOccupied
}
seatSchema.methods.getFree = function(){
  let seatsFree= 0
  this.vacuity.map((x)=>{
    if(x.occupied == false) seatsFree++
  })
  //.filter((x)=> x === true)
  return seatsFree
}

export default mongoose.model("Seat", seatSchema);
