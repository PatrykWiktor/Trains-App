import Station from "../models/station";
import Route from "../models/route";
import { log, Log } from "../util/log";
export const create = async (req, res) => {
  try {
    const { currStation, prevStations, nextStations } = req.body;

    const stationExists = await Station.findOne({ currStation });
    if (stationExists) {
      return res.status(400).send(`Station ${currStation} already exists`);
    }

    const station = await new Station({
      currStation,
      prevStations,
      nextStations,
    });

    await station.save();
    //connect stations // TODO handle time
    // UPDATE PREVIOUS for each prev station
    for (let i = 0; i < prevStations.length; i++) {
      // find station
      const prevStatID = prevStations[i].station;
      const prevStatTime = prevStations[i].travelTime;

      const stat = await Station.findById(prevStatID);
      // add new station to nextStations list of prev station
      stat.nextStations = [
        ...stat.nextStations,
        {
          station: station._id,
          // if travel time is defined use it, else pass 0
          travelTime: prevStatTime != undefined ? prevStatTime : 0,
        },
      ];
      await stat.save();
    }

    // UPDATE NEXT for each next station
    for (let i = 0; i < nextStations.length; i++) {
      // find station
      const nextStatID = nextStations[i].station;
      const nextStatTime = nextStations[i].travelTime;
      const stat = await Station.findById(nextStatID);
      // add new station to prevStations list of next station
      stat.prevStations = [
        ...stat.prevStations,
        {
          station: station._id,
          // if travel time is defined use it, else pass 0
          travelTime: nextStatTime != undefined ? nextStatTime : 0,
        },
      ];
      await stat.save();
    }

    return res.json(station);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.response.data);
  }
};
export const getall = async (req, res) => {
  try {
    const stations = await Station.find({})
      .populate({
        path: "nextStations",
        populate: {
          path: "station",
        },
      })
      .populate({
        path: "prevStations",
        populate: {
          path: "station",
        },
      });

    return res.json(stations);
  } catch (err) {
    console.log(err);
  }
};
// gets all possible connections beetween stations, all stations needs to be connected for this to work
// OBSOLETE
export const getPossibleConnections = async (req, res) => {
  try {
    const stations = await Station.find({});

    const listOfIds = stations.map((x) => String(x._id)); // create list of station ids
    const connectionsList = []; // list of all possible connections
    let currChain = []; // current connection chain
    const savedConn = []; // cached connections to be revisted later
    let savedConnNum = 0;
    // recursive function that saves list of possible connections to connectionsList
    // all stations need to be connected.
    const createConnMap = (conn) => {
      
      // create list of next stations ids
      let next = [];
      if (conn.nextStations) {
        next = conn.nextStations.map((x) => String(x.station));
      }
      // base case
      // if there are no next stations and current is last station of chain
      if (next.length == 0) {
        currChain.push(conn); // add curr station to list
        connectionsList.push(currChain); // add station chain to conn List
        currChain = []; // reset chain

        // check for savedConn
        if (savedConn.length > 0) {
          // select connection to revisit
          let selectedChain = savedConn[0];
          // if saved connection. next stations have deplted remove it and check for next
          while (selectedChain.nextStations.length == 0) {
            savedConn.shift(); // remove depleted conn
            selectedChain = savedConn[0]; // set revisitedConn to new
            if (selectedChain == undefined) return; // if last one is empty finish // END // if all conn are assigned and savedChains are depleted
          }
          if (selectedChain.nextStations.length > 0) {
            // set currChain to chain from saved connection
            currChain = selectedChain.currChain;
            // select next station to continue with
            const nextStation =
              stations[listOfIds.indexOf(selectedChain.nextStations[0])]; // find next station OBJECT in station list using its id from IDList
            // remove nextStation from chain
            selectedChain.nextStations.shift();
            // and continue
            createConnMap(nextStation);
          }
        }
      }
      if (next.length == 1) {
        // if there is only one next station
        const nextStation = stations[listOfIds.indexOf(next[0])]; // find next station OBJECT in station list using its id from IDList
        currChain.push(conn); // add station to list
        createConnMap(nextStation); // follow up with next station
      }
      if (next.length >= 2) {
        // multiple next stations
        savedConnNum++; // add number for debug
        // add curr conn to chain list
        currChain.push(conn);
        // select station to continue with
        const nextStation = stations[listOfIds.indexOf(next[0])]; // find next station OBJECT in station list using its id from IDList
        next.shift(); // remove index 0 / nextStation from list
        // create return point
        savedConn.push({
          id: savedConnNum, // id for debug
          nextStations: [...next], // clone next stations
          currChain: [...currChain], // current station chain
        });
        //
        createConnMap(nextStation); // follow up with next station
      }
    };
    //TODO 
    createConnMap(stations[0]);

    //sort connections based on lenght
    const sortedConnectionsList = connectionsList.sort(
      (a, b) => b.length - a.length
    );
    console.log(sortedConnectionsList);
    return res.json(sortedConnectionsList);
  } catch (err) {
    console.log(err);
  }
};

export const update = async (req, res) => {
  try {
    const { currStation, prevStations, nextStations } = req.body;
    const id = req.params.id;

    const station = await Station.findById(id);
    // HANDLE REMOVED STATIONS ** START
    // create list of stations that been removed fromm CURRENT stations
    // prevStation's list to update these later
    const currPrevIDs = station.prevStations.map((prev) => {
      return String(prev.station._id);
    });
    const newPrevIDs = prevStations.map((prev) => {
      return String(prev.station._id);
    });
    const prevDiff = currPrevIDs.filter((x) => !newPrevIDs.includes(x));
    // update prev connections
    for (let i = 0; i < prevDiff.length; i++) {
      const stat = await Station.findById(prevDiff[i]);

      const nxtStationsList = stat.nextStations.map((nxt) => {
        return String(nxt.station);
      });

      if (nxtStationsList.includes(String(id))) {
        await stat.updateOne(
          {
            nextStations: stat.nextStations.filter(
              (x) => String(x.station) != String(id)
            ),
          },
          { new: true }
        );
      }
    }
    // update next connections
    const currNextIDs = station.nextStations.map((next) => {
      return String(next.station._id);
    });
    const newNextIDs = nextStations.map((next) => {
      return String(next.station._id);
    });
    const nextDiff = currNextIDs.filter((x) => !newNextIDs.includes(x));

    for (let i = 0; i < nextDiff.length; i++) {
      const stat = await Station.findById(nextDiff[i]);

      const prevStationsList = stat.prevStations.map((prev) => {
        return String(prev.station);
      });

      if (prevStationsList.includes(String(id))) {
        await stat.updateOne(
          {
            prevStations: stat.prevStations.filter(
              (x) => String(x.station) != String(id)
            ),
          },
          { new: true }
        );
      }
    }
    // HANDLE REMOVED STATIONS ** END
    // update CURRENT station
    await station.updateOne(
      {
        currStation: currStation,
        prevStations: prevStations,
        nextStations: nextStations,
      },
      {
        new: true,
      }
    );
    // HANDLE NEW STATIONS ** START
    // add new station to prevStation as nextStation
    for (let i = 0; i < prevStations.length; i++) {
      const prevStatOBJ = prevStations[i];
      const prevStation = await Station.findById(prevStatOBJ.station._id);
      // create list of nextStations ids
      const prevStationListOfNextStationsIDs = prevStation.nextStations.map(
        (x) => {
          return String(x.station._id);
        }
      );
      if (!prevStationListOfNextStationsIDs.includes(String(station._id))) {
        prevStation.nextStations = [
          ...prevStation.nextStations,
          {
            station: station._id,
            travelTime: prevStatOBJ.travelTime ? prevStatOBJ.travelTime : 0,
          },
        ];
        await prevStation.save();
      }
    }
    // add new station to  nextStation as prevStation
    for (let i = 0; i < nextStations.length; i++) {
      const nextStatOBJ = nextStations[i];
      const nxtStation = await Station.findById(nextStatOBJ.station._id);
      // create list of prevStations ids
      const nextStationListOfPrevtStationsIDs = nxtStation.prevStations.map(
        (x) => {
          return String(x.station._id);
        }
      );
      if (!nextStationListOfPrevtStationsIDs.includes(String(station._id))) {
        nxtStation.prevStations = [
          ...nxtStation.prevStations,
          {
            station: station._id,
            travelTime: nextStatOBJ.travelTime ? nextStatOBJ.travelTime : 0,
          },
        ];
        await nxtStation.save();
      }
    }
    // HANDLE NEW STATIONS ** END
    return res.json(station);
  } catch (err) {
    console.log(err);
  }
};

export const getOneById = async (req, res) => {
  try {
    const id = req.params.id;
    const station = await Station.findById(id)
      .populate({
        path: "nextStations",
        populate: {
          path: "station",
        },
      })
      .populate({
        path: "prevStations",
        populate: {
          path: "station",
        },
      });
    return res.json(station);
  } catch (err) {
    console.log(err);
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const station = await Station.findById(id);
    // REMOVE ALL CONNECTIONS TO CURR STATION
    // create list of previous stations ids
    const prevStationsIDS = station.prevStations.map((prev) => {
      return String(prev.station._id);
    });
    //loop through that list
    for (let i = 0; i < prevStationsIDS.length; i++) {
      const prevStationID = prevStationsIDS[i];
      //find station in db
      const prevStation = await Station.findById(prevStationID);
      // in .nextStations of prevStation, filter out station thats being deleted
      prevStation.nextStations = prevStation.nextStations.filter((x) => {
        return String(x.station) != String(id);
      });
      await prevStation.save();
    }

    const nextStationsIDS = station.nextStations.map((next) => {
      return String(next.station._id);
    });
    //loop through that list
    for (let i = 0; i < nextStationsIDS.length; i++) {
      const nextStationID = nextStationsIDS[i];
      //find station in db
      const nextStation = await Station.findById(nextStationID);
      // in .nextStations of nextStation, filter out station thats being deleted
      nextStation.prevStations = nextStation.prevStations.filter((x) => {
        return String(x.station) != String(id);
      });
      await nextStation.save();
    }
    //remove all routes that had this staiton referenced
    // TODO mby check for connections beetween prev to removed and next to removed and connect those ??
    await Route.deleteMany({ stops: id });
    // and remove station itself
    await station.deleteOne();
    return res.json(station);
  } catch (err) {
    console.log(err);
  }
};
