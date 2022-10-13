import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { Alert, Button, ListGroup, Form, ListGroupItem } from "react-bootstrap";
import {
  getAllStationAction,
  getOneStationAction,
  updateStationAction,
} from "../../../actions/stationActions";
import Loader from "../../../components/Loader";
function update() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const allStations = useSelector((state) => state.station.allStations);
  const {
    data: stationList,
    loading: loadingGetAllStations,
    error: errorGetAllStation,
  } = allStations;
  const updated = useSelector((state) => state.station.update);
  const {
    data: updateData,
    loading: updateLoading,
    error: updateError,
  } = updated;

  const stationData = useSelector((state) => state.station.getOne);
  const { data, loading, error } = stationData;

  const [currSelection, setCurrSelection] = useState([]);
  const [prevSelection, setPrevSelection] = useState([]);
  const [nextSelection, setNextSelection] = useState([]);

  const [stationName, setStationName] = useState("");
  const [prevStations, setPrevStations] = useState([]);
  const [nextStations, setNextStations] = useState([]);
  // get all stations from db on mount and add them to state
  useEffect(() => {
    // CHECK if any station exists dont fetch data
    if (stationList) return;
    dispatch(getAllStationAction());
  }, []);
  // get station data
  useEffect(() => {
    if (!id) return;
    dispatch(getOneStationAction(id));
  }, [id]);
  //
  useEffect(() => {
    if (!data) return;
    setStationName(data.currStation);
    setPrevStations(data.prevStations);
    setNextStations(data.nextStations);
  }, [data]);
  useEffect(() => {
    if (!updateData) return;
    router.push("/station");
  }, [updateData]);
  //{ station: station, travelTime: null }
  const addStation = (dir) => {
    if (!currSelection.length) return;

    if (dir == "prev") {
      const prevStationsList = currSelection.map((c) => {
        // check if station thats being added as next station
        // has connection to CURRENTLY edited station as prev to CURRENT
        // return list of stations that pass check
        const stationIsReferenced = c.nextStations.filter((nxt) => {
          return nxt.station._id == id;
        });
        return {
          station: c,
          // if CURRENT station is connected to one being added
          // and declered time is diffrent then 0
          travelTime:
            stationIsReferenced[0] != undefined
              ? stationIsReferenced[0].travelTime
              : 0,
        };
      });

      setPrevStations([...prevStations, ...prevStationsList]);
      setCurrSelection([]);
      return;
    }
    if (dir == "next") {
      const nextStationsList = currSelection.map((c) => {
        // check if station thats being added as next station
        // has connection to CURRENTLY edited station as prev to CURRENT
        // return list of stations that pass check
        const stationIsReferenced = c.prevStations.filter((prev) => {
          return prev.station._id == id;
        });
        return {
          station: c,
          // if CURRENT station is connected to one being added
          // and declered time is diffrent then 0
          travelTime:
            stationIsReferenced[0] != undefined
              ? stationIsReferenced[0].travelTime
              : 0,
        };
      });
      setNextStations([...nextStations, ...nextStationsList]);
      setCurrSelection([]);
      return;
    }
  };
  const removeStation = (e, station, dir) => {
    if (dir == "prev") {
      setPrevStations([...prevStations.filter((x) => x != station)]);
      return;
    }
    if (dir == "next") {
      setNextStations([...nextStations.filter((x) => x != station)]);
      return;
    }
  };
  const removeManyStations = (dir) => {
    if (nextSelection.length > 0 && dir == "next") {
      setNextStations([
        ...nextStations.filter((x) => !nextSelection.includes(x)),
      ]);
      setNextSelection([]);
      return;
    }
    if (prevSelection.length > 0 && dir == "prev") {
      setPrevStations([
        ...prevStations.filter((x) => !prevSelection.includes(x)),
      ]);
      setPrevSelection([]);
      return;
    }
  };
  const updateStation = async (e) => {
    e.preventDefault();
    let prevStationsOBJs = [];
    let nextStationsOBJs = [];

    for (let i = 0; i < prevStations.length; i++) {
      const stationOBJ = prevStations[i];
      prevStationsOBJs.push(stationOBJ);
    }
    for (let i = 0; i < nextStations.length; i++) {
      const stationOBJ = nextStations[i];
      nextStationsOBJs.push(stationOBJ);
    }

    dispatch(
      updateStationAction({
        id: id,
        currStation: stationName,
        prevStations: prevStationsOBJs,
        nextStations: nextStationsOBJs,
      })
    );
  };
  const handleSelection = (e, station, dir) => {
    e.preventDefault();
    if (dir == "curr") {
      // if station list includes target remove it from list else add to list
      if (currSelection.includes(station)) {
        setCurrSelection(currSelection.filter((x) => x != station));
        e.target.blur();
        return;
      }
      setCurrSelection([...currSelection, station]);
      return;
    }
    if (dir == "prev") {
      if (prevSelection.includes(station)) {
        setPrevSelection(prevSelection.filter((x) => x != station));
        e.target.blur();
        return;
      }
      setPrevSelection([...prevSelection, station]);
      return;
    }
    if (dir == "next") {
      if (nextSelection.includes(station)) {
        setNextSelection(nextSelection.filter((x) => x != station));
        e.target.blur();
        return;
      }
      setNextSelection([...nextSelection, station]);
      return;
    }
  };
  return (
    <div className="station-update-section">
      <Link href="/station">Go Back</Link>
      <div>
        <div style={{ display: "flex" }}>
          <h3>All Stations</h3>
          <Button onClick={(e) => updateStation(e)}>UPDATE</Button>
          <Button onClick={() => addStation("prev")}>Add to prev</Button>
          <Button onClick={() => addStation("next")}>Add to next</Button>
        </div>
        <ListGroup>
          {loadingGetAllStations ? (
            <Loader />
          ) : errorGetAllStation ? (
            <Alert variant="danger">{errorGetAllStation}</Alert>
          ) : (
            stationList &&
            stationList.map((station) => (
              <ListGroup.Item
                key={station._id}
                onClick={(e) => handleSelection(e, station, "curr")}
                action
                variant="light"
                active={currSelection.includes(station)}
              >
                {station.currStation}
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </div>
      <Form>
        <h3>UPDATE</h3>
        <p>Name</p>
        <Form.Control
          type="text"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
        ></Form.Control>
        <ListGroup>
          <div style={{ display: "flex" }}>
            <ListGroup.Item>Previous Stations</ListGroup.Item>
            <Button onClick={() => removeManyStations("prev")}>
              Remove Selected
            </Button>
          </div>
          {prevStations &&
            prevStations.map((stationOBJ) => (
              <div key={stationOBJ.station._id} style={{ display: "flex" }}>
                <ListGroup.Item
                  onClick={(e) =>
                    handleSelection(e, stationOBJ.station, "prev")
                  }
                  action
                  variant="light"
                  active={prevSelection.includes(stationOBJ.station)}
                >
                  {stationOBJ.station.currStation}
                </ListGroup.Item>
                <Form.Control
                  type="number"
                  value={stationOBJ.travelTime}
                  onChange={(e) => {
                    const stat = prevStations.find((x) => x == stationOBJ);
                    stat.travelTime = parseInt(e.target.value);
                    setPrevStations([...prevStations]);
                  }}
                  placeholder="Travel time in minutes"
                />
                <ListGroup.Item>
                  <Button onClick={(e) => removeStation(e, stationOBJ, "prev")}>
                    Remove
                  </Button>
                </ListGroup.Item>
              </div>
            ))}
        </ListGroup>
        <ListGroup>
          <div style={{ display: "flex" }}>
            <ListGroup.Item>Next Stations</ListGroup.Item>
            <Button onClick={() => removeManyStations("next")}>
              Remove Selected
            </Button>
          </div>
          {nextStations &&
            nextStations.map((stationOBJ) => (
              <div key={stationOBJ.station._id} style={{ display: "flex" }}>
                <ListGroup.Item
                  onClick={(e) =>
                    handleSelection(e, stationOBJ.station, "next")
                  }
                  action
                  variant="light"
                  active={nextSelection.includes(stationOBJ.station)}
                >
                  <p>{stationOBJ.station.currStation}</p>
                </ListGroup.Item>
                <Form.Control
                  type="number"
                  value={stationOBJ.travelTime}
                  onChange={(e) => {
                    const stat = nextStations.find((x) => x == stationOBJ);
                    stat.travelTime = parseInt(e.target.value);
                    setNextStations([...nextStations]);
                  }}
                  placeholder="Travel time in minutes"
                />
                <ListGroup.Item>
                  <Button onClick={(e) => removeStation(e, stationOBJ, "next")}>
                    Remove
                  </Button>
                </ListGroup.Item>
              </div>
            ))}
        </ListGroup>
      </Form>
    </div>
  );
}

export default update;
