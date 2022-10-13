import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  Alert,
  Button,
  ListGroup,
  InputGroup,
  FormControl,
  Form,
} from "react-bootstrap";
import {
  createRunAction,
  getAllRunAction,
  updateRunAction,
  removeRunAction,
} from "../../actions/runActions";
import { getAllRouteAction } from "../../actions/routeActions";
import { getAllTrainAction } from "../../actions/trainActions";
import Loader from "../../components/Loader";
import Dialog from "../../components/Dialog";
import CreateRun from "../../components/CreateRun";
import UpdateRun from "../../components/UpdateRun";
import {
  RUN_CREATE_RESET,
  RUN_REMOVE_RESET,
} from "../../constants/runConstants";
function index() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [currOnRun, setCurrOnRun] = useState(null);
  const [departureTime, setDepartureTime] = useState(null);
  const [currTrain, setCurrTrain] = useState(null);
  const [currRoute, setCurrRoute] = useState(null);
  const [currRun, setCurrRun] = useState(null);
  const [err, setErr] = useState(null);

  const runFromState = useSelector((state) => state.run.all);
  const { data: allRuns, error: errorRuns } = runFromState;
  const newRunFromState = useSelector((state) => state.run.create);
  const { data: newRun, error: errorNewRun } = newRunFromState;
  const removedRunFromState = useSelector((state) => state.run.remove);
  const { data: removedRun, error: errorRemoved } = removedRunFromState;
  useEffect(() => {
    if (!allRuns) dispatch(getAllRunAction());
  }, []);

  useEffect(() => {
    if (newRun) {
      dispatch({ type: RUN_CREATE_RESET });
      dispatch(getAllRunAction());
    }
  }, [newRun]);
  useEffect(() => {
    if (!removedRun) return;
    dispatch(getAllRunAction());
    dispatch({ type: RUN_REMOVE_RESET });
    resetState();
  }, [removedRun]);
  const newRunCallback = (currRoute, currTrain, departureTime) => {
    if (currRoute) setCurrRoute(currRoute);
    if (currTrain) setCurrTrain(currTrain);
    if (departureTime) setDepartureTime(departureTime);
  };
  const submitNewRun = () => {
    if (!currTrain || !currRoute) return;

    dispatch(
      createRunAction({
        route: currRoute,
        assignedTrain: currTrain,
        onRun: false,
        departureTime: departureTime,
      })
    );
    setCurrRoute(null);
    setCurrTrain(null);
  };
  const editRunCallback = (currRoute, currTrain, currOnRun, departureTime) => {
    if (currRoute) setCurrRoute(currRoute);
    if (currTrain) setCurrTrain(currTrain);
    if (currOnRun) setCurrOnRun(currOnRun);
    if (departureTime) setDepartureTime(departureTime);
  };
  const submitEditRun = () => {
    if (!currTrain || !currRoute) return;
    dispatch(
      updateRunAction({
        id: currRun,
        route: currRoute,
        assignedTrain: currTrain,
        onRun: currOnRun,
        departureTime: departureTime,
      })
    );
    resetState();
  };
  const cantShowCallback = () => {
    setErr("Run not selected");
  };
  const resetState = () => {
    setCurrRun(null);
    setCurrRoute(null);
    setCurrTrain(null);
  };
  const handleRemove = () => {
    if (!currRun) {
      setErr("Run not selected");
      return;
    }
    dispatch(removeRunAction(currRun));
  };
  return (
    <div>
      {err && err}
      <div className="main" style={{ display: "flex" }}>
        <div className="list">
          <ListGroup>
            {allRuns &&
              allRuns.map((run) => (
                <ListGroup.Item
                  onClick={() => {
                    setCurrRun(run._id);
                    if (err) setErr(null);
                  }}
                  style={{ display: "flex", justifyContent: "space-between" }}
                  key={run._id}
                  action
                  variant="light"
                  active={run._id == currRun}
                >
                  <p style={{ paddingRight: "1rem", width: "4ch" }}>
                    {run.assignedTrain.number}
                  </p>
                  <p style={{ paddingRight: "1rem", width: "10ch" }}>
                    {run.route.routeName}
                  </p>
                  <p style={{ paddingRight: "1rem", width: "5ch" }}>
                    {run.onRun == true ? "True" : "False"}
                  </p>

                  <p style={{ paddingRight: "1rem" }}>
                    {new Date(run.departureTime).getFullYear()}-
                    {new Date(run.departureTime).getMonth() + 1}-
                    {new Date(run.departureTime).getDate()}
                  </p>
                  <p style={{ paddingRight: "1rem" }}>
                    {new Date(run.departureTime).getHours()}:
                    {new Date(run.departureTime).getMinutes()}
                  </p>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="options"
        >
          <Dialog
            btn={true}
            btnText="NEW"
            btnVariant="success"
            dialogHeading="Create new Run"
            dialogBody={<CreateRun callback={newRunCallback} />}
            onConfirm={() => submitNewRun()}
            onCancelVar="secondary"
            onConfirmVar="success"
          />
          <Dialog
            btn={true}
            btnText="EDIT"
            btnVariant="info"
            dialogHeading="Edit Run"
            dialogBody={<UpdateRun id={currRun} callback={editRunCallback} />}
            onConfirm={() => submitEditRun()}
            canShow={currRun != undefined}
            cantShow={cantShowCallback}
            onCancelVar="secondary"
            onConfirmVar="success"
            onCancel={() => resetState()}
          />
          <Button variant="danger" onClick={() => handleRemove()}>
            REMOVE
          </Button>
        </div>
      </div>
    </div>
  );
}

export default index;
