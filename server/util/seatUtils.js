import Seat from '../models/seat'

export const lastSeatNumber = async (carID) =>{

  let LastNumber = await Seat.find({ assignedCar: carID })
  .sort([["number", -1]])
  .limit(1);

  if(LastNumber[0]) {
    LastNumber = LastNumber[0].number;
    LastNumber++;
  }else {
    LastNumber = 1;
  }
  return Number(LastNumber)
}

