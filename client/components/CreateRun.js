import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRouteAction } from "../actions/routeActions";
import {
  getAllTrainAction,
  getAllTrainControlAction,
} from "../actions/trainActions";
import { ListGroup, FormControl } from "react-bootstrap";
import { getTimePL } from "../util/timeUtil";

function CreateRun(props) {
  const dispatch = useDispatch();

  const [currTrain, setCurrTrain] = useState(null);
  const [currRoute, setCurrRoute] = useState(null);
  const [departureTime, setDepartureTime] = useState(getTimePL());

  // const trainsFromState = useSelector((state) => state.train.all);
  // const { data: allTrains, error: errorTrains } = trainsFromState;
  const trainsFromState = useSelector((state) => state.train.controlAll);
  const { data: allTrains, error: errorTrains } = trainsFromState;
  const routeFromState = useSelector((state) => state.route.allRoute);
  const { data: allRoutes, error: errorRoutes } = routeFromState;

  const callback = props.callback;

  useEffect(() => {
    if (!allRoutes) dispatch(getAllRouteAction());
    if (!allTrains) dispatch(getAllTrainAction());

    dispatch(getAllTrainControlAction());
  }, []);

  useEffect(() => {
    callback(currRoute, currTrain, departureTime);
  }, [currRoute, currTrain, departureTime]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <ListGroup variant="flush" as="ul">
          <ListGroup.Item as="li">
            <strong>Trains</strong>
          </ListGroup.Item>
          {allTrains &&
            allTrains
              .filter((x) => x._id == currTrain)
              .map((train) => (
                <ListGroup.Item key={train._id} disabled>
                  {train.number}
                </ListGroup.Item>
              ))}
          {allTrains &&
            allTrains.map((train) => (
              <ListGroup.Item
                as="li"
                key={train._id}
                onClick={() => setCurrTrain(train._id)}
                active={train._id == currTrain}
                action
                variant="light"
              >
                {train.number}
              </ListGroup.Item>
            ))}
        </ListGroup>
        <ListGroup as="ul" variant="flush">
          <ListGroup.Item as="li">
            <strong>Routes</strong>
          </ListGroup.Item>
          {allRoutes &&
            allRoutes
              .filter((x) => x._id == currRoute)
              .map((route) => (
                <ListGroup.Item disabled key={route._id}>
                  {route.routeName}
                </ListGroup.Item>
              ))}
          {allRoutes &&
            allRoutes.map((route) => (
              <ListGroup.Item
                as="li"
                key={route._id}
                onClick={() => setCurrRoute(route._id)}
                active={route._id == currRoute}
                action
                variant="light"
              >
                {route.routeName}
              </ListGroup.Item>
            ))}
        </ListGroup>
      </div>
      <input
        value={departureTime}
        type="datetime-local"
        onChange={(e) => setDepartureTime(e.target.value)}
      />
    </div>
  );
}

export default CreateRun;
