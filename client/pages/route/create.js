import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStationAction } from "../../actions/stationActions";
import { createRouteAction } from "../../actions/routeActions";
import Loader from "../../components/Loader";
import { useRouter } from "next/router";
import { Button, ListGroup, Form } from "react-bootstrap";
import Link from "next/link";
import {
  ROUTE_CREATE_RESET,
  ROUTE_REMOVE_RESET,
  ROUTE_UPDATE_RESET,
} from "../../constants/routeConstants";
function create() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [routeName, setRouteName] = useState("");
  const [routeStations, setRouteStations] = useState([]);

  const allStations = useSelector((state) => state.station.allStations);
  const {
    data: stationList,
    loading: loadingGetAllStations,
    error: errorGetAllStation,
  } = allStations;
  const newRoute = useSelector((state) => state.route.createRoute.data);
  // get all stations on mount
  useEffect(() => {
    dispatch({ type: ROUTE_CREATE_RESET });
    dispatch({ type: ROUTE_REMOVE_RESET });
    dispatch({ type: ROUTE_UPDATE_RESET });
    // CHECK if any station exists dont fetch data
    if (!stationList) dispatch(getAllStationAction());
  }, []);

  useEffect(() => {
    if (!newRoute) return;
    router.push("/route");
  }, [newRoute]);

  const handleSelection = (e, station) => {
    e.preventDefault();
    // if not already selected
    if (!routeStations.includes(station)) {
      setRouteStations([...routeStations, station]);
    } else {
      setRouteStations(routeStations.filter((x) => x != station));
      e.target.blur();
    }
  };
  const handleRemove = (e, station) => {
    e.preventDefault();
    const stationIndex = routeStations.indexOf(station);
    const itemsToRemove = routeStations.length - stationIndex;
    routeStations.splice(stationIndex, itemsToRemove);

    setRouteStations([...routeStations]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createRouteAction({
        routeName,
        startStation: routeStations[0],
        endStation: routeStations[routeStations.length - 1],
        stops: routeStations,
      })
    );
  };
  return (
    <div>
      <Link href="/route">Go Back</Link>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Form.Control
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            placeholder="Route Name"
            style={{ maxWidth: "50%" }}
          />
          <Button type="submit">Confirm</Button>
        </div>
        <div style={{ display: "flex", justifyContent: "center",margin:'1em 0' }}>
          {routeStations &&
            routeStations.map((station) => (
              <div style={{ display: "flex", flexDirection: "row" }}>
                <h4>{station.currStation}</h4>
                {station != routeStations[routeStations.length -1] && <h4>{"->"}</h4>}
              </div>
            ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {stationList && routeStations.length <= 0 && (
            <ListGroup>
              <ListGroup.Item>Station List</ListGroup.Item>
              {stationList.map((station) => (
                <ListGroup.Item
                  key={station._id}
                  action
                  variant="light"
                  onClick={(e) => handleSelection(e, station)}
                >
                  {station.currStation}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          {routeStations.length > 0 && (
            <ListGroup>
              <ListGroup.Item>Current List</ListGroup.Item>
              {routeStations.map((station) => (
                <ListGroup.Item
                  key={station._id}
                  action
                  variant="light"
                  onClick={(e) => handleRemove(e, station)}
                >
                  {station.currStation}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          {stationList && routeStations.length > 0 && (
            <ListGroup>
              <ListGroup.Item>Next Stations</ListGroup.Item>
              {routeStations[routeStations.length - 1].nextStations.map(
                (nxt) => (
                  <ListGroup.Item
                    key={nxt.station}
                    action
                    variant="light"
                    onClick={(e) =>
                      handleSelection(
                        e,
                        stationList.find((x) => {
                          // find station by id in station list state
                          return x._id == nxt.station._id;
                        })
                      )
                    }
                  >
                    {nxt.station.currStation}
                  </ListGroup.Item>
                )
              )}
            </ListGroup>
          )}
        </div>
      </Form>
    </div>
  );
}

export default create;
