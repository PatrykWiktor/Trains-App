import Car from "../models/car";
import Seat from "../models/seat";
import Train from "../models/train";
import { lastSeatNumber } from "../util/seatUtils";

export const create = async (req, res) => {
  try {
    const { type, number, assignedTrain } = req.body;

    // check number
    const carExists = await Car.findOne({ number });
    if (number < 0) {
      return res.status(400).send({
        error: `Car number cannot be lower then 0. Provided number : ${number}`,
      });
    }
    if (carExists) {
      return res.status(400).send({
        error: `Car number ${number} already exists.`,
      });
    }
    // check if type is valid
    const validCarTypes = ["passengerCar", "bikeCar", "engineCar"];
    if (!validCarTypes.includes(type)) {
      return res.status(400).send({
        error: `Invalid car type. Provided: ${type}. Expected ${validCarTypes}`,
      });
    }
    // init seats and set acording to type
    let seatNumber = 0;
    let bikeNumber = 0;

    type == "passengerCar" ? (seatNumber = 2) : seatNumber;
    type == "bikeCar" ? (bikeNumber = 2) : bikeNumber;

    //TODO handle bikes

    const assignedCar = await new Car({
      type,
      number,
      assignedTrain,
    });
    // **********  CREATE SEATS  **********

    // populate car
    await assignedCar.populate({
      path: "assignedTrain",
      populate: {
        path: "assignedRoute",
      },
    });
    //get last number of seat in given car and add one to it
    let LastNumber = await lastSeatNumber(assignedCar._id);
    // let LastNumber = await Seat.find({ assignedCar: assignedCar._id })
    //   .sort([["number", -1]])
    //   .limit(1);
    // if (LastNumber[0]) {
    //   LastNumber = LastNumber[0].number;
    //   LastNumber++;
    // } else {
    //   LastNumber = 1;
    // }

    // get list of stops from route and add them to list as an object {station,bool}
    let vacuity = [];
    if (assignedCar.assignedTrain) {
      if (assignedCar.assignedTrain.assignedRoute) {
        const stops = assignedCar.assignedTrain.assignedRoute.stops;
        for (let i = 0; i < stops.length; i++) {
          const stop = stops[i];
          vacuity.push({ stop: stop, occupied: false });
        }
      }
    }

    for (let i = 0; i < seatNumber; i++) {
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

      // new seat
      const seat = await new Seat({
        number: LastNumber,
        position,
        assignedCar: assignedCar._id,
        vacuity,
      });

      await seat.save();
      //update car seats
      assignedCar.seats = [...assignedCar.seats, seat._id];
      LastNumber++;
    }
    // save car
    await assignedCar.save();
    if (assignedTrain != undefined) {
      //update Train
      const train = await Train.findById(assignedTrain);
      train.cars = [...train.cars, assignedCar._id];
      await train.save();
    }
    return res.json(assignedCar);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.response.data);
  }
};
export const getall = async (req, res) => {
  try {
    const car = await Car.find({});
    return res.json(car);
  } catch (err) {
    console.log(err);
  }
};
export const update = async (req, res) => {
  try {
    const { type, number, assignedTrain, seats } = req.body;
    const id = req.params.id;

    let car = await Car.findById(id);

    //update train
    if (car.assignedTrain != assignedTrain) {
      // update train
      if (!car.assignedTrain && assignedTrain) {
        // if train was null and we want to assign new train
        const train = await Train.findById(assignedTrain);
        train.cars = [...train.cars, car._id];
        // save
      }
      if (car.assignedTrain && !assignedTrain) {
        // if train was assigned and we want to remove it
        const train = await Train.findById(car.assignedTrain);
        train.cars = [...train.cars.filter((x) => x != car._id)];
        // save
      }
      if (car.assignedTrain && assignedTrain) {
        // if train was assigned and we want to assign new one
        const oldTrain = await Train.findById(car.assignedTrain);
        oldTrain.cars = [...oldTrain.cars.filter((x) => x != car._id)];
        // save
        const newTrain = await Train.findById(assignedTrain);
        newTrain.cars = [...newTrain.cars, car._id];
        // save
      }
    }
    // update car.train
    car.assignedTrain = assignedTrain;
    // populate car.assignedTrain.assignedRoute
    await car.populate({
      path: "assignedTrain",
      populate: {
        path: "assignedRoute",
      },
    });
    // handle vacuity
    let vacuity = [];
    if (car.assignedTrain) {
      if (car.assignedTrain.assignedRoute) {
        const stops = car.assignedTrain.assignedRoute.stops;
        for (let i = 0; i < stops.length; i++) {
          const stop = stops[i];
          vacuity.push({ stop: stop, occupied: false });
        }
      }
    }else{
      console.log('NO TRAIN ASSIGNED')
    }

    // handle seats
    let newSeatsList = [];
    let seatNum = 1;
    // reassign seat numbers and fill for temporary seats
    for (let i = 0; i < Object.keys(seats).length; i++) {
      const seat = seats[i];
      // if seat has removed attribute. delete it
      if (seat.removed) {
        await Seat.findByIdAndDelete(seat._id);
        continue;
      }
      // if seat is temporary create new seat and add to list
      if (seat._id.slice(0, 4) == "TEMP") {
        // seats.splice(seats.indexOf(seat));

        const newSeat = await new Seat({
          number: seatNum,
          position: seatNum % 2 == 0 ? "aisle" : "window",
          vacuity,
          assignedCar: id,
        });

        await newSeat.save();
        // new list of seats ids
        newSeatsList.push(newSeat._id);
      } else {
        // find seat, assingn number, save and push ID to new list
        const existSeat = await Seat.findById(seat._id);
        existSeat.number = seatNum;
        existSeat.vacuity = vacuity;
        existSeat.save();
        // hande vacuity
        newSeatsList.push(existSeat._id);
      }
      seatNum++;
    }

    car.seats = newSeatsList;

    await car.updateOne(
      {
        type: type,
        number: number,
        assignedTrain: assignedTrain,
        seats: newSeatsList,
      },
      {
        new: true,
      }
    );

    return res.json(car);
  } catch (err) {
    console.log(err);
  }
};
export const getOneById = async (req, res) => {
  try {
    const id = req.params.id;
    const car = await Car.findById(id).populate({
      path: "seats",
      populate: {
        path: "vacuity",
        populate: {
          path: "stop",
        },
      },
    });

    return res.json(car);
  } catch (err) {
    console.log(err);
  }
};
export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const car = await Car.findById(id);
    const train = await Train.findById(car.assignedTrain);
    if (train) {
      train.cars = train.cars.filter((x) => x != car.id);
      await train.save();
    }

    for (let i = 0; i < car.seats.length; i++) {
      const seatID = car.seats[i];
      const seat = await Seat.findById(seatID);
      await seat.deleteOne();
    }

    await car.deleteOne();
    return res.json({ car, train });
  } catch (err) {
    console.log(err);
  }
};
