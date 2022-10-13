import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createStationAction,
  getAllStationAction,
} from "../../actions/stationActions";
import { STATION_CREATE_RESET } from "../../constants/stationConstants";
import { Alert, Button, ListGroup, Form } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";

function create() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [stationName, setStationName] = useState("");
  const [prevStations, setPrevStations] = useState([]);
  const [nextStations, setNextStations] = useState([]);
  // all stations
  const allStations = useSelector((state) => state.station.allStations);
  const {
    data: stationList,
    loading: loadingGetAllStations,
    error: errorGetAllStation,
  } = allStations;
  // new stations
  const createStation = useSelector((state) => state.station.createStation);
  const {
    data: newStation,
    loading: loadingNewStation,
    error: errorNewStation,
  } = createStation;

  const newStationSubmit = async (e) => {
    e.preventDefault();
    dispatch(
      createStationAction({
        currStation: stationName,
        prevStations: prevStations,
        nextStations: nextStations,
      })
    );
  };
  const handleSelection = (e, station, dir) => {
    e.preventDefault();
    if (dir == "prev") {
      // if station list includes target remove it from list else add to list
      if (prevStations.some((x) => x["station"] == station)) {
        setPrevStations(prevStations.filter((x) => x["station"] != station));
        e.target.blur();
        return;
      }
      setPrevStations([...prevStations, { station: station, travelTime: 0 }]);
      return;
    }
    // else dir == 'next' same as above
    if (nextStations.some((x) => x["station"] == station)) {
      setNextStations(nextStations.filter((x) => x["station"] != station));
      e.target.blur();
      return;
    }
    setNextStations([...nextStations, { station: station, travelTime: 0 }]);
    return;
  };
  // get all stations from db on mount and add them to state
  useEffect(() => {
    dispatch({ type: STATION_CREATE_RESET });
    if (stationList) return;
    // CHECK if any station exists dont fetch data
    dispatch(getAllStationAction());
  }, []);
  useEffect(() => {
    if (!newStation) return;
    router.push("/station");
  }, [newStation]);

  const handleTime = (e, station, dir) => {
    if (dir == "next") {
      nextStations.find((x) => x["station"] == station).travelTime =
        e.target.value;
      setNextStations([...nextStations]);
      return;
    }
    if (dir == "prev") {
      prevStations.find((x) => x["station"] == station).travelTime =
        e.target.value;
      setPrevStations([...prevStations]);
      return;
    }
  };
  return (
    <div>
      <Link href="/station">Go Back</Link>
      {newStation ? (
        "Loading"
      ) : errorNewStation ? (
        <Alert variant="danger">
          <h5>{errorNewStation}</h5>
        </Alert>
      ) : (
        ""
      )}
      <Form onSubmit={(e) => newStationSubmit(e)}>
        <input
          type="text"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
        />
        <Button type="submit">Create New</Button>
      </Form>
      <div>
      {prevStations && JSON.stringify(prevStations)}
        <h3>Selec Prev Stations</h3>
        <ListGroup>
          {loadingGetAllStations ? (
            "loading"
          ) : errorGetAllStation ? (
            <p>{errorGetAllStation}</p>
          ) : (
            stationList &&
            stationList.map((station) => (
              <div key={station._id} style={{ display: "flex" }}>
                <ListGroup.Item
                  key={station._id}
                  onClick={(e) => handleSelection(e, station._id, "prev")}
                  action
                  variant="light"
                  active={prevStations.find((x) => x["station"] == station._id)}
                >
                  {station.currStation}
                </ListGroup.Item>
                <Form.Control
                  type="number"
                  value={prevStations[station._id]}
                  onChange={(e) => handleTime(e, station._id,'prev')}
                  placeholder="Travel to prev station time in minutes"
                  disabled={
                    !prevStations.find((x) => x["station"] == station._id)
                  }
                />
              </div>
            ))
          )}
        </ListGroup>
      </div>
      <div>
        <h3>Selec Next Stations</h3>
        {nextStations && JSON.stringify(nextStations)}
        <ListGroup>
          {loadingGetAllStations ? (
            "loading"
          ) : errorGetAllStation ? (
            <p>{errorGetAllStation}</p>
          ) : (
            stationList &&
            stationList.map((station) => (
              <div key={station._id} style={{ display: "flex" }}>
                <ListGroup.Item
                  onClick={(e) => handleSelection(e, station._id, "next")}
                  action
                  variant="light"
                  active={nextStations.find((x) => x["station"] == station._id)}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <p style={{ paddingRight: "1rem" }}>{station.currStation}</p>
                </ListGroup.Item>
                <Form.Control
                  type="number"
                  value={nextStations[station._id]}
                  onChange={(e) => handleTime(e, station._id, 'next')}
                  placeholder="Travel to next station time in minutes"
                  disabled={
                    !nextStations.find((x) => x["station"] == station._id)
                  }
                />
              </div>
            ))
          )}
        </ListGroup>
      </div>
    </div>
  );
}

export default create;
