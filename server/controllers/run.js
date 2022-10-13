import Run from "../models/run";
import Route from "../models/route";
import Station from "../models/station";
import Train from "../models/train";
import TrainControl from "../models/trainControl";
import Car from "../models/car";
import Seat from "../models/seat";
import { lastSeatNumber } from "../util/seatUtils";

const MAX_SEAT_NUMBER = 30;
export const create = async (req, res) => {
  try {
    const {
      route: routeID,
      assignedTrain: trainId,
      onRun,
      departureTime,
    } = req.body;

    const { number, cars } = await TrainControl.findById(trainId);

    // number
    // cars .lenght == 2
    // [
    //   { number: 1, type: 'passengerCar' },
    //   { number: 2, type: 'engineCar' }
    // ]
    const route = await Route.findById(routeID);

    let vacuity = [];
    let stops = [];
    if (route) stops = route.stops;

    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      vacuity.push({ stop: stop, occupied: false });
    }

    const train = new Train({ number, cars });
    // train == { number: 1, cars: [], _id: new ObjectId("628bd43ca48f34b7054df3ce") }

    // CAR
    // variables
    const validCarTypes = ["passengerCar", "bikeCar", "engineCar"];
    let seatNumber = 0;
    let bikeNumber = 0;

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      // car == { number: 1, type: 'passengerCar' }
      // type check
      if (!validCarTypes.includes(car.type)) {
        return res.status(400).send({
          error: `Invalid car type. Provided: ${type}. Expected ${validCarTypes}`,
        });
      }
      // assign seats based on car type
      car.type == "passengerCar" ? (seatNumber = 2) : seatNumber;
      car.type == "bikeCar" ? (bikeNumber = 2) : bikeNumber;
      // newCar ==
      // {
      //   type: 'passengerCar',
      //   number: 1,
      //   assignedTrain: new ObjectId("628bb5f5fb66d866ad04651e"),
      //   seats: [],
      //   _id: new ObjectId("628bd3fcb7d3a21a46a4cd98")
      // }
      const newCar = await new Car({
        type: car.type,
        number: car.number,
        assignedTrain: trainId,
      });
      //Create Seats
      let LastNumber = await lastSeatNumber(newCar._id);
      for (let i = 0; i < seatNumber; i++) {
        // 30 is max number of seats for a car if exeeded err 400
        if (LastNumber > MAX_SEAT_NUMBER) {
          return res
            .status(400)
            .send(
              `There cannot be more then ${MAX_SEAT_NUMBER} seats in a car.`
            );
        }
        //even numbers get position aisle, odd get window
        let position;
        if (LastNumber % 2 == 0) position = "aisle";
        else position = "window";

        // new seat
        // {
        //   number: 1,
        //   position: 'window',
        //   vacuity: [
        //     { stop: new ObjectId("62501b9f6d36fec869d3ac38"), occupied: false },
        //     { stop: new ObjectId("62502413b48f8ec966ce6abb"), occupied: false },
        //     { stop: new ObjectId("6250241bb48f8ec966ce6ac9"), occupied: false }
        //   ],
        //   assignedCar: new ObjectId("628bda522765cef51bdb3275"),
        //   _id: new ObjectId("628bda522765cef51bdb3277")
        // }
        const seat = await new Seat({
          number: LastNumber,
          position,
          assignedCar: newCar._id,
          vacuity,
        });

        await seat.save();
        //update car seats
        newCar.seats = [...newCar.seats, seat._id];
        LastNumber++;
      }
      // save car
      await newCar.save();
      //  update Train
      train.cars = [...train.cars, newCar._id];
    }
    // save train
    await train.save();

    const run = await new Run({
      route: routeID,
      assignedTrain: train,
      onRun,
      departureTime,
    });
    await run.save();
    return res.json(run);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.response.data);
  }
};
export const getall = async (req, res) => {
  try {
    const allRuns = await Run.find({})
      .populate({
        path: "route",
        populate: {
          path: "stops",
        },
      })
      .populate("assignedTrain");
    return res.json(allRuns);
  } catch (err) {
    console.log(err);
  }
};
export const update = async (req, res) => {
  try {
    const { route, assignedTrain, onRun, departureTime } = req.body;
    const id = req.params.id;

    let run = await Run.findById(id);

    await run.updateOne(
      { route, assignedTrain, onRun, departureTime },
      {
        new: true,
      }
    );

    return res.json(run);
  } catch (err) {
    console.log(err);
  }
};
export const getOneById = async (req, res) => {
  try {
    const id = req.params.id;
    const run = await Run.findById(id)
      .populate("route")
      .populate("assignedTrain");
    return res.json(run);
  } catch (err) {
    console.log(err);
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedResult = {
      run: null,
      train: null,
      cars: [],
      seats: [],
    };

    const run = await Run.findById(id);

    const train = await Train.findById(run.assignedTrain._id);

    const cars = train.cars;
    //for each car in train
    for (let i = 0; i < cars.length; i++) {
      const carID = cars[i];
      const car = await Car.findById(carID);
      // find car and loop through seats
      const carSeats = car.seats;
      for (let i = 0; i < carSeats.length; i++) {
        // find and delete seat, push to deletedresult
        const seatID = carSeats[i];
        await Seat.findByIdAndDelete(seatID);
        deletedResult.seats.push(seatID);
      }
      //delete car and push to deletedresult
      deletedResult.cars.push(carID);
      car.remove();
    }
    //remove train and push to deletedresult
    deletedResult.train = run.assignedTrain._id;
    train.remove();
    // remove run and pus hto deletedresult
    deletedResult.run = id;
    run.remove();
    return res.json(deletedResult);
  } catch (err) {
    console.log(err);
  }
};

export const getConnection = async (req, res) => {
  try {
    const startStationName = req.params.strt;
    const startStation = await Station.findOne({
      currStation: startStationName,
    });
    
    const endStationName = req.params.end;
    if (endStationName == "None") {
      return res.json(null);
    }
    const endStation = await Station.findOne({ currStation: endStationName });

    const reqRoutes = await Route.find({
      $and: [{ stops: startStation._id }, { stops: endStation._id }],
    });
    // const reqRoutes = await Route.find({ stops: [ startStation._id, endStation._id ] } )
    // const reqRoutes = await Route.find({ stops: { $all: [startStation._id,endStation._id] } })

    //list of valid runs for each valid route [routeXY[runs...], routeXYZ[...runs]]
    const validRuns = [];
    for (let i = 0; i < reqRoutes.length; i++) {
      const route = reqRoutes[i];
      const run = await Run.find({ route: route, onRun: true })
        .populate("assignedTrain")
        .populate({
          path: "route",
          populate: {
            path: "stops",
          },
        });
      validRuns.push(run);
    }

    return res.json(validRuns);
  } catch (err) {
    console.log(err);
  }
};
