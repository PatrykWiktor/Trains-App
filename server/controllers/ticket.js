import Ticket from "../models/ticket";
import Car from "../models/car";
import Seat from "../models/seat";
import { log, Log } from "../util/log";

export const create = async (req, res) => {
  try {
    const { user, seats, stops } = req.body;

    const assignedSeats = [];
    // const passengerCount = Object.keys(seats).length
    // const stopsCount = stops.length
    // for each passenger
    for (let i = 0; i < Object.keys(seats).length; i++) {
      const seatID = seats[Object.keys(seats)[i]][0];
      const seat = await Seat.findById(seatID);
      for (let y = 0; y < stops.length; y++) {
        const stop = stops[y];

        const seatVac = seat.vacuity.filter((x) => x.stop == stop)[0];
        seat.vacuity[seat.vacuity.indexOf(seatVac)].occupied = true;
      }
      await seat.save()
      assignedSeats.push(seat._id);
    }
    const ticket = await new Ticket({
      user,
      startStation: stops[0],
      endStation: stops[stops.length - 1],
      stops,
      seats: assignedSeats,
    });

    await ticket.save();
    return res.json(ticket);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.response.data);
  }
};

export const validate = async (req, res) => {
  try {
    const { user, startStation, endStation, passengerCount, conn } = req.body;
    const train = conn.assignedTrain;
    // get all ids of stops
    const routeStops = conn.route.stops.map((x)=>{return x._id})
    // const routeStops = train.assignedRoute.stops;
    //get requested stops from route
    let reqStops;
    // console.log("routeStops : ", routeStops);
    // console.log("startStation : ", startStation._id);
    // console.log("endStation : ", endStation._id);
    // if (routeStops[routeStops.length - 1] == endStation._id)
    //   console.log("end station is last station in route");
    // if (routeStops[0] == startStation._id)
    //   console.log("start station is first station in route");

    // if start and end are first and last in route set reqStops to existing stops from route
    if (
      routeStops[routeStops.length - 1] == endStation._id &&
      routeStops[0] == startStation._id
    ) {
      reqStops = routeStops;
    } else {
      const firstIndx = routeStops.indexOf(startStation._id);
      const lastIndx = routeStops.length - routeStops.indexOf(endStation._id);
      reqStops = routeStops.splice(firstIndx, lastIndx);
    }

    //find if duplicate
    let tickectExists = await Ticket.findOne({
      user,
      startStation: reqStops[0],
      endStation: reqStops[reqStops.length - 1],
      stops: reqStops,
    });

    //create emptySeats object { stopName : [ list of empty seats]}
    const eSeats = {};
    // fill with requested stops
    for (let i = 0; i < reqStops.length; i++) {
      eSeats[reqStops[i]] = [];
    }
    // eSeat:
    // {
    //   '62501b9f6d36fec869d3ac38': [],
    //   '62502413b48f8ec966ce6abb': []
    // }

    // get all empty seats for req stations
    // loop through all cars in train
    for (let i = 0; i < train.cars.length; i++) {
      //get one and populate seats
      const car = await Car.findById(train.cars[i]).populate("seats");
      // loop through all seats in car
      for (let x = 0; x < car.seats.length; x++) {
        const seatID = car.seats[x]._id;
        // get list of availbilty for seat on all stops
        const vacuity = car.seats[x].vacuity;
        // loop through each seat on vacuity list
        // [{stopId:bool},...]
        for (let y = 0; y < vacuity.length; y++) {
          const seatStop = String(vacuity[y].stop);
          const seatOccupied = vacuity[y].occupied;
          // if stop is on the list and is not occupied at that stop add seats ID to emptySeats object at coresponding station
          if (Object.keys(eSeats).includes(seatStop) && !seatOccupied) {
            eSeats[seatStop].push(seatID);
            // {
            //   '62501b9f6d36fec869d3ac38': [
            //     new ObjectId("6266731dc09a73297148cdfb"),
            //   ],
            //   '62502413b48f8ec966ce6abb': [
            //     new ObjectId("6266731dc09a73297148cdfb"),
            //   ]
            // }
          }
        }
      }
    }
    console.log(eSeats);
    // {
    //   '62501b9f6d36fec869d3ac38': [
    //     new ObjectId("62667321c09a73297148ce10"),
    //     new ObjectId("62667322c09a73297148ce17")
    //   ],
    //   '62502413b48f8ec966ce6abb': [
    //     new ObjectId("62667320c09a73297148ce09"),
    //     new ObjectId("62667321c09a73297148ce10"),
    //     new ObjectId("62667322c09a73297148ce17")
    //   ]
    // }

    // create list of assigned seats to return
    const allAssignedSeats = {};
    //for each passenger
    for (let z = 0; z < passengerCount; z++) {
      log(Log.fg.red, `Z: ${z}`);
      console.log(eSeats);
      let assignedSeats = [];
      // assign empty seats to passenger
      let lastValid = 0;
      for (let i = 0; i < Object.keys(eSeats).length; i++) {
        const stop = Object.keys(eSeats)[i];

        console.log("lastValid", lastValid);
        // for each stop check if it also contains same empty seat if not change seat to next one and repeat untill seat thats free for entire ride is found
        for (let y = 0; y < eSeats[stop].length; y++) {
          //if complete set of free seats was not found at first stop, increase starting point by one
          if (i == 0) {
            y = y + lastValid;
          }
          // if number of left seats is 1 set index to 0
          if (eSeats[stop].length == 1) {
            y = 0;
          }
          const eSeatAtStop = eSeats[stop][y];
          if (eSeatAtStop == undefined) {
            console.log("stop out of range");
            return;
          }
          // if assignedseats does not inlcuede curr empty seat, prev seat is diffrent to curr
          // and assignedseats has any item in list
          // make sure to not check if seat is valid if its diffrent from previous
          log(Log.fg.blue, `i: ${i}`);
          log(Log.fg.blue, `current stop is: ${stop}`);
          log(Log.fg.blue, `y: ${y}`);
          log(Log.fg.blue, `curr seat testedL${eSeatAtStop}`);

          if (!assignedSeats.includes(eSeatAtStop) && assignedSeats.length) {
            console.log(
              "curr seat is diffrent to previous",
              !assignedSeats.includes(eSeatAtStop)
            );
            console.log(assignedSeats, "does not include", eSeatAtStop);

            if (
              (y == eSeats[stop].length - 1 &&
                lastValid < eSeats[stop].length) ||
              (y == eSeats[stop].length && lastValid != eSeats[stop].length)
            ) {
              lastValid++;
              i = -1;
              assignedSeats = [];
              break;
            }
            continue;
          }

          log(Log.fg.yellow, `this list, ${eSeats[stop]}`);
          log(Log.fg.yellow, "includes");
          log(Log.fg.yellow, eSeatAtStop);
          log(Log.fg.yellow, eSeats[stop].includes(eSeatAtStop));

          if (eSeats[stop].includes(eSeatAtStop)) {
            console.log(eSeatAtStop, "is free at", stop);
            assignedSeats.push(eSeatAtStop);
            eSeats[stop].splice(eSeats[stop].indexOf(eSeatAtStop), 1);
            console.log(eSeats[stop]);
            break;
          } else {
            console.log(eSeatAtStop, "is taken at", stop);
          }
        }
        // stop loop end here
      }
      // for each assigned seat remove it from empty seats list
      // loop through eseats keys, lenght should be the same as assigned seats
      // if not for whatever reason return error
      if (assignedSeats.length != Object.keys(eSeats).length) {
        console.log("ERROR : assignedSeats length not equal to eSeats length");
        console.log("assignedSeat:", assignedSeats);
        //TODO throw error
        return res.status(400).send({
          error: "Not enough empty seats for requested route.",
          detail: "assignedSeats length not equal to eSeats length",
        });
      }
      // for (let i = 0; i < Object.keys(eSeats).length; i++) {
      //   const stop = Object.keys(eSeats)[i];
      //   eSeats[stop].splice(eSeats[stop].indexOf(assignedSeats[i]), 1);
      // }

      allAssignedSeats[z] = assignedSeats;
      console.log("assignedSeat:", assignedSeats);
    }
    console.log(allAssignedSeats);
    console.log(reqStops)
    return res.json({
      seats: allAssignedSeats,
      stops: reqStops,
      tickectExists: tickectExists ? true : false,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.response.data);
  }
};
export const getall = async (req, res) => {
  try {
    const ticket = await Ticket.find({});
    return res.json(ticket);
  } catch (err) {
    console.log(err);
  }
};
export const update = async (req, res) => {
  try {
    const { user, startStation, endStation, seat } = req.body;
    const id = req.params.id;

    let ticket = await Ticket.findOne({ _id: id });

    await ticket.updateOne(
      {
        user: user,
        startStation: startStation,
        endStation: endStation,
        seat: seat,
      },
      {
        new: true,
      }
    );

    return res.json(ticket);
  } catch (err) {
    console.log(err);
  }
};
export const getOneById = async (req, res) => {
  try {
    const id = req.params.id;
    const ticket = await Ticket.findById(id);
    return res.json(ticket);
  } catch (err) {
    console.log(err);
  }
};
export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const ticket = await Ticket.findById(id);

    await ticket.deleteOne();
    return res.json(ticket);
  } catch (err) {
    console.log(err);
  }
};

//  // // find seats TODO
//   // const ticket = new Ticket({ user, startStation, endStation, seat });
//   // await ticket.save();
//   // return res.json(ticket);
//   // all stops on route
//   const routeStops = conn.assignedRoute.stops;
//   //get requested stops from route
//   const reqStops = routeStops.splice(
//     routeStops.indexOf(startStation._id),
//     routeStops.length - routeStops.indexOf(endStation._id)
//   );

//   //chceck for available seats
//   let emptySeats = [];
//   // for each car in train
//   for (let i = 0; i < conn.cars.length; i++) {
//     // get car
//     const car = await Car.findById(conn.cars[i]).populate("seats");
//     // loop through all seats of car
//     for (let x = 0; x < car.seats.length; x++) {
//       const carSeat = car.seats[x];
//       // list of occupancy status objects
//       const carSeatStatus = car.seats[x].occupied;
//       // for each status occupancy object {station, bool}
//       for (let y = 0; y < carSeatStatus.length; y++) {
//         const seat = carSeatStatus[y];
//         // is seat available at stop
//         const seatAvailable = reqStops.includes(String(seat.stop));
//         // console.log(seat.stop,seatAvailable)
//         // if not available skip this iteration
//         if (!seatAvailable) continue;
//         // is seat not occupied, is free
//         const seatNotOccupied = !seat.occupied;
//         // console.log(seatNotOccupied)
//         // seat has stop assigned to it & seat is empty at that station & is not already in list - add it to empty seats list
//         if (
//           seatAvailable &&
//           seatNotOccupied &&

//           !emptySeats.includes(carSeat._id)
//         ) {
//           emptySeats.push(carSeat._id);
//         }
//         //set seat occupied at stations from start to end on route list ???
//       }
//     }
//   }
//   console.log(emptySeats)
//   // console.log(startStation._id, endStation._id, passengerCount)
//   // console.log(routeStops)
//   // TODO select seats and set them to occupied at station, mby in the previous loop ?

//   // // change occupation for seats to true
//   // const seats = emptySeats.splice(0,passengerCount)
//   // for (let i = 0; i < seats.length; i++) {
//   //   const seat = await Seat.findById(seats[i]._id)
//   //   seat.occupied = [...seat.occupied,]
//   //   await seat.save()
//   //   console.log(seat)
//   // }

// / count how often each seat is assigned to determine if seatss can be assigned
//     const result = assignedSeats.reduce(
//       (acc, curr) => ((acc[curr] = (acc[curr] || 0) + 1), acc),
//       {}
//     );
//     console.log(result);
//     //if each seat is not avaiable for entire ride
//     for (let i = 0; i < Object.keys(result).length; i++) {
//       // each seat doesnt occur equal amount of times for same route
//       // {
//       //   '62667321c09a73297148ce10': 2,
//       //   '62667320c09a73297148ce09': 1,
//       //   '62667322c09a73297148ce17': 1
//       // }
//       if (result[Object.keys(result)[i]] != reqStops.length) {
//         console.log(result[Object.keys(result)[i]] != reqStops.length);
//         return res.status(400).send({ error: "No seats available" });
//       }
//       const seat = await Seat.findById(Object.keys(result)[i]);
//       console.log(seat)
//     }
