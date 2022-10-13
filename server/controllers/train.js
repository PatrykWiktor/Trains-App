import Train from "../models/train";
import Car from "../models/car";
import Route from "../models/route";
import Seat from "../models/seat";
export const create = async (req, res) => {
  try {
    const {
      number: number,
      cars: cars,
      assignedRoute: assignedRoute,
    } = req.body;

    const trainExists = await Train.findOne({ number });
    if (trainExists) {
      console.log(trainExists)
      return res
        .status(400)
        .send({ error: `Train number ${number} already exists.` });
    }

    const route = await Route.findById(assignedRoute);

    let vacuity = [];
    if (route) {
      const stops = route.stops;
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        vacuity.push({ stop: stop, occupied: false });
      }
    }

    const train = new Train({ number, cars, assignedRoute });
    await train.save();

    for (let i = 0; i < cars.length; i++) {
      // get car and assign train to it
      const car = await Car.findById(cars[i]);
      car.assignedTrain = train._id;

      // handle seats
      for (let x = 0; x < car.seats.length; x++) {
        const seatID = car.seats[x];
        const seat = await Seat.findById(seatID);
        seat.vacuity = vacuity;

        await seat.save();
      }
      await car.save();
    }

    return res.json(train);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.response.data);
  }
};
export const getall = async (req, res) => {
  try {
    const train = await Train.find({}).populate('assignedRoute')
    return res.json(train);
  } catch (err) {
    console.log(err);
  }
};
export const update = async (req, res) => {
  try {
    const { number, cars, assignedRoute } = req.body;
    const id = req.params.id;

    // get train
    let train = await Train.findOne({ _id: id });
    // check for duplicate number
    const numberExists = await Train.findOne({number})
    // if number exists and is not equal to current train - number has been changed throw error
    if(numberExists && !numberExists.number == train.number){
      console.log(numberExists)
      return res.status(400).send({
        error: `Train number ${number} already exists`,
      })
    }
    // get ids of cars and reassigned their train
    const carsIDs = []
    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      console.log('CAR ID : ',car._id)
      carsIDs.push(car._id)
      const carFromDB = await Car.findById(car._id)
      carFromDB.assignedTrain = id
      await carFromDB.save()
    }

    await train.updateOne(
      { number: number, cars: carsIDs, assignedRoute: assignedRoute._id },
      {
        new: true,
      }
    );

    return res.json(train);
  } catch (err) {
    console.log(err);
  }
};
export const getOneById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id)
    const train = await Train.findById(id).populate('cars').populate('assignedRoute')
    return res.json(train);
  } catch (err) {
    console.log(err);
  }
};
export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const train = await Train.findById(id);

    await train.deleteOne();
    return res.json(train);
  } catch (err) {
    console.log(err);
  }
};
