import Route from "../models/route";
import Train from "../models/train";

export const create = async (req, res) => {
  try {
    const { routeName, startStation, endStation, stops } = req.body;

    const routeExists = await Route.findOne({ routeName }).exec();
    if (routeExists) {
      return res.status(400).send(`Route ${routeName} already exists`);
    }

    const route = new Route({
      routeName,
      startStation,
      endStation,
      stops,
    });
    await route.save();
    return res.json(route);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.response.data);
  }
};
export const getall = async (req, res) => {
  try {
    const route = await Route.find({})
    return res.json(route);
  } catch (err) {
    console.log(err);
  }
};

export const update = async (req, res) => {
  try {
    const { routeName, startStation, endStation, stops } = req.body;
    const id = req.params.id;

    let route = await Route.findOneAndUpdate(
      { _id: id },
      {
        routeName: routeName,
        startStation: startStation,
        endStation: endStation,
        stops: stops,
      },
      {
        new: true,
      }
    );

    return res.json(route);
  } catch (err) {
    console.log(err);
  }
};

export const getOneById = async (req, res) => {
  try {
    const id = req.params.id;
    const route = await Route.findById(id).populate({
      path: "stops",
      populate: {
        path: "nextStations",
        populate: {
          path: "station",
        },
      },
    });

    return res.json(route);
  } catch (err) {
    console.log(err);
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const route = await Route.findOne({ _id: id });
    await Route.deleteOne({ _id: id });
    return res.json(route);
  } catch (err) {
    console.log(err);
  }
};
