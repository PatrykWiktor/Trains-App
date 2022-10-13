import Seat from "../models/seat";
import Car from "../models/car";
import Train from "../models/train";
export const create = async (req, res) => {
  try {
    const { assignedCar } = req.body;
    //get last number of seat in given car and add one to it
    let LastNumber = await Seat.find({ assignedCar })
      .sort([["number", -1]])
      .limit(1);
    if (LastNumber[0]) {
      LastNumber = LastNumber[0].number;
      LastNumber++;
    } else {
      LastNumber = 1;
    }
    // 30 is max number of seats for a car if exeeded err 400
    if (LastNumber > 30) {
      return res
        .status(400)
        .send(`There cannot be more then 30 seats in a car.`);
    }
    //even numbers get position aisle, odd get window
    let position;
    if (LastNumber % 2 == 0) position = "aisle";
    else position = "window";

    // find car
    const car = await Car.findById(assignedCar).populate({
      path: "assignedTrain",
      populate: {
        path: "assignedRoute",
      },
    });
    // get list of stops from route and add them to list as an object {station,bool}
    let vacuity = [];
    const stops = car.assignedTrain.assignedRoute.stops;
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      vacuity.push({ stop: stop, occupied: false });
    }
    // new seat
    const seat = new Seat({
      number: LastNumber,
      position,
      assignedCar,
      vacuity,
    });
    await seat.save();
    //update car seats
    car.seats = [...car.seats, seat._id];
    await car.save();
    //
    return res.json(seat);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.response.data);
  }
};
export const getall = async (req, res) => {
  try {
    const seat = await Seat.find({});
    return res.json(seat);
  } catch (err) {
    console.log(err);
  }
};
export const update = async (req, res) => {
  try {
    const { assignedCar, number, position, occupied } = req.body;
    const id = req.params.id;

    let seat = await Seat.findOne({ _id: id });
    const numberExists = await Station.findOne({
      number: number,
      assignedCar: assignedCar,
    }).exec();
    // if number exists and provided Seatnumber is not current Seatnumber
    if (numberExists && seat.number != number) {
      return res
        .status(400)
        .send(`Seat number ${seat.number} already exists in that car.`);
    }

    await seat.updateOne(
      {
        assignedCar: assignedCar,
        number: number,
        position: position,
        occupied: occupied,
      },
      {
        new: true,
      }
    );

    return res.json(seat);
  } catch (err) {
    console.log(err);
  }
};
export const getOneById = async (req, res) => {
  try {
    const id = req.params.id;
    const seat = await Seat.findById(id);
    return res.json(seat);
  } catch (err) {
    console.log(err);
  }
};
export const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const seat = await Seat.findById(id);
    await seat.deleteOne();

    return res.json(seat);
  } catch (err) {
    console.log(err);
  }
};
export const getSeatsTaken = async (req, res) => {
  try {
    const allSeats = await Seat.find({});
    let seatsOccupied = 0;
    let seatsFree = 0;
    allSeats.forEach((seat) => {
      const seatsTaken = seat.getTaken();
      seatsOccupied += seatsTaken;
      const seatsNotTaken = seat.getFree();
      seatsFree += seatsNotTaken;
    });
    return res.json({ occupied: seatsOccupied, free: seatsFree });
  } catch (err) {
    console.log(err);
  }
};
