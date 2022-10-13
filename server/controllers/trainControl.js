import Train from "../models/train";
import Car from "../models/car";
import Route from "../models/route";
import Seat from "../models/seat";
import TrainControl from "../models/trainControl";
export const create = async (req, res) => {
  try {
    const { number: number, cars: cars } = req.body;
    const trainExists = await TrainControl.findOne({ number });
    if (trainExists) {
      return res.status(400).send({
        error: `Train number ${number} already exists`,
      });
    }
    const trainControl = await new TrainControl({ number, cars }).save();

    return res.json(trainControl);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.response.data);
  }
};
export const getall = async (req, res) => {
  try {
    const trainControl = await TrainControl.find({});
    return res.json(trainControl);
  } catch (err) {
    console.log(err);
  }
};
export const update = async (req, res) => {
  try {
    const { number, cars } = req.body;
    const id = req.params.id;
    console.log({ number, cars, id });

    // get train
    let train = await TrainControl.findById(id);
    // check for duplicate number
    const numberExists = await Train.findOne({ number });
    // if number exists and is not equal to current train - number has been changed throw error
    if (numberExists && !numberExists.number == train.number) {
      console.log(numberExists);
      return res.status(400).send({
        error: `Train number ${number} already exists`,
      });
    }

    await TrainControl.updateOne(
      { number: number, cars: cars },
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

    const train = await TrainControl.findById(id)
    return res.json(train);
  } catch (err) {
    console.log(err);
  }
};
export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const train = await TrainControl.findById(id);

    await train.deleteOne();
    return res.json(train);
  } catch (err) {
    console.log(err);
  }
};
