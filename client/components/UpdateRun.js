import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRouteAction } from "../actions/routeActions";
import { getAllTrainControlAction } from "../actions/trainActions";
import { getOneRunAction } from "../actions/runActions";
import { ListGroup, FormControl } from "react-bootstrap";
import { parseTimePL } from "../util/timeUtil";
function UpdateRun(props) {
  const dispatch = useDispatch();

  const [departureTime, setDepartureTime] = useState(Date);
  const [currTrain, setCurrTrain] = useState(null);
  const [currRoute, setCurrRoute] = useState(null);
  const [currOnRun, setCurrOnRun] = useState(null);

  const trainsFromState = useSelector((state) => state.train.controlAll);
  const { data: allTrains, error: errorTrains } = trainsFromState;
  const routeFromState = useSelector((state) => state.route.allRoute);
  const { data: allRoutes, error: errorRoutes } = routeFromState;
  const allRunsFromState = useSelector((state) => state.run.all);
  const { data: allRuns } = allRunsFromState;

  const callback = props.callback;
  const id = props.id;
  // if no train or routes get them from db
  useEffect(() => {
    if (!allRoutes) dispatch(getAllRouteAction());
    if (!allTrains) dispatch(getAllTrainControlAction());
  }, []);

  useEffect(() => {
    // if train and route are assigned do nothing
    // if all runs are already in state grab this run from state
    if (allRuns) {
      const thisRun = allRuns.find((x) => x._id == id);
      if (thisRun) {
        setCurrRoute(thisRun.route._id);
        setCurrTrain(thisRun.assignedTrain);
        setCurrOnRun(thisRun.onRun);
        setDepartureTime(parseTimePL(thisRun.departureTime));
      }
      return;
    }
  }, [allRuns, id]);

  useEffect(() => {
    callback(currRoute, currTrain, currOnRun, departureTime);
  }, [currRoute, currTrain, currOnRun, departureTime]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <ListGroup variant="flush" as="ul">
          <ListGroup.Item>
            <strong>On Run</strong>
          </ListGroup.Item>
          <ListGroup.Item
            onClick={() => {
              setCurrOnRun(!currOnRun);
            }}
            action
            variant={currOnRun == true ? "success" : "danger"}
          >
            {currOnRun && currOnRun == true ? "True" : "False"}
          </ListGroup.Item>
        </ListGroup>
        <ListGroup variant="flush" as="ul">
          <ListGroup.Item as="li">
            <strong>Trains</strong>
          </ListGroup.Item>
          {allTrains &&
            currTrain &&
            allTrains
              .filter((x) => x.number == currTrain.number)
              .map((train) => (
                <ListGroup.Item key={train._id} disabled>
                  {train.number}
                </ListGroup.Item>
              ))}
          {allTrains &&
            currTrain &&
            allTrains.map((train) => (
              <ListGroup.Item
                as="li"
                key={train._id}
                onClick={() => setCurrTrain(train)}
                active={train.number == currTrain.number}
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
      <FormControl
        type="datetime-local"
        value={departureTime}
        onChange={(e) => setDepartureTime(e.target.value)}
      />
    </div>
  );
}

export default UpdateRun;
