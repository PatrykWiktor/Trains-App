import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStationAction,
  removeStationAction,
} from "../../actions/stationActions";
import {
  STATION_CREATE_RESET,
  STATION_UPDATE_RESET,
  STATION_REMOVE_RESET,
} from "../../constants/stationConstants";
import { Alert, Button, ListGroup, Form } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
function index() {
  const dispatch = useDispatch();
  const router = useRouter();
  const allStationsListRef = useRef();

  const [currSelection, setCurrSelection] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [selectAlert, setSelectAlert] = useState(false);
  // get stations from state
  const allStations = useSelector((state) => state.station.allStations);
  const {
    data: stationList,
    loading: loadingGetAllStations,
    error: errorGetAllStation,
  } = allStations;
  // new station state
  const createStation = useSelector((state) => state.station.createStation);
  const {
    data: newStation,
    loading: loadingNewStation,
    error: errorNewStation,
  } = createStation;
  // station update state
  const updatedStation = useSelector((state) => state.station.update);
  const {
    data: updateData,
    loading: updateLoading,
    error: updateError,
  } = updatedStation;
  const removedStation = useSelector((state) => state.station.remove);
  const {
    data: removeData,
    loading: removeLoading,
    error: removeError,
  } = removedStation;
  // get all stations from db on mount and add them to state
  useEffect(() => {
    // CHECK if any station exists dont fetch data
    if (stationList) return;
    dispatch(getAllStationAction());
  }, []);
  // refresh stations on new,update or remove
  useEffect(() => {
    if (newStation) {
      dispatch(getAllStationAction());
    }
    if (updateData) {
      dispatch(getAllStationAction());
    }
    if (removeData) {
      dispatch(getAllStationAction());
    }
  }, [newStation, updateData, removeData]);
  const editStation = (e) => {
    e.preventDefault();
    // check if station is selected and display popup if not
    if (!currSelection) {
      setSelectAlert(true);
      return;
    }
    setSelectAlert(false);
    router.push(`station/update/${currSelection._id}`);
  };
  const selectStation = (e, station) => {
    e.preventDefault();
    // if delition is pending do nothing
    if (deleteAlert) return;
    const classes = e.target.classList;
    // handle curr selection
    // if already selected remove class and set state to empty
    if (classes.contains("selected")) {
      classes.remove("selected");
      setCurrSelection(null);
      return;
    }
    // else remove all selected classes from this list
    for (let i = 0; i < allStationsListRef.current.children.length; i++) {
      const element = allStationsListRef.current.children[i];
      element.classList.remove("selected");
    }
    // add class to selection and set state
    classes.add("selected");
    setCurrSelection(station);
    return;
  };
  const removeStation = (e) => {
    e.preventDefault();
    dispatch(removeStationAction(currSelection._id));
    setCurrSelection(null);
    setDeleteAlert(false);
  };
  const handleRemove = () => {
    // check if station is selected and display popup if not
    if (!currSelection) {
      setSelectAlert(true);
      return;
    }
    setSelectAlert(false);
    setDeleteAlert(true);
  };
  return (
    <div className="station-section">
      {newStation && (
        <Alert
          variant="success"
          onClose={() => dispatch({ type: STATION_CREATE_RESET })}
          dismissible
        >
          <h5>Success !</h5>
          <p>
            Station <strong>{newStation.currStation}</strong> has beed created.
          </p>
        </Alert>
      )}
      {updateData && (
        <Alert
          variant="success"
          onClose={() => dispatch({ type: STATION_UPDATE_RESET })}
          dismissible
        >
          <h5>Success !</h5>
          <p>
            Station <strong>{updateData.currStation}</strong> has beed updated.
          </p>
        </Alert>
      )}
      {removeData && (
        <Alert
          variant="success"
          onClose={() => dispatch({ type: STATION_REMOVE_RESET })}
          dismissible
        >
          <h5>Success !</h5>
          <p>
            Station <strong>{removeData.currStation}</strong> has beed removed.
          </p>
        </Alert>
      )}
      <Alert
        show={selectAlert}
        onClose={() => setSelectAlert(false)}
        dismissible
        variant="danger"
      >
        <Alert.Heading>Error</Alert.Heading>
        <p>
          Select <strong>station</strong> to proceed.
        </p>
      </Alert>
      <Alert show={deleteAlert} variant="danger">
        <Alert.Heading>Remove</Alert.Heading>
        <hr />
        <p>This action will delete selected station and all routes that include it. Are you sure ?</p>
        <div className="d-flex justify-content-end">
          <Button
            onClick={() => setDeleteAlert(false)}
            variant="outline-danger"
          >
            No
          </Button>
          <Button onClick={(e) => removeStation(e)} variant="success">
            Yes
          </Button>
        </div>
      </Alert>
      <div className="col-3 station-list ">
        <h3>All Stations</h3>
        <ul ref={allStationsListRef}>
          {loadingGetAllStations ? (
            "loading"
          ) : errorGetAllStation ? (
            <p>{errorGetAllStation}</p>
          ) : (
            stationList &&
            stationList.map((station) => (
              <li
                key={station._id}
                onClick={(e) => selectStation(e, station, "curr")}
              >
                {station.currStation}
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="col-3 stations-col">
        <div className="row-1 curr-station">
          <h5>Curr</h5>
          {currSelection && <p>{currSelection.currStation}</p>}
        </div>
        <div className="row-2 prev-next-stations">
          <div className="col-1 prev-stations">
            <h5>Prev</h5>
            {currSelection &&
              currSelection.prevStations.map((station) => (
                <p key={station.station._id}>{station.station.currStation}</p>
              ))}
          </div>
          <div className="col-1 next-stations">
            <h5>Next</h5>
            {currSelection &&
              currSelection.nextStations.map((station) => (
                <p key={station.station._id}>{station.station.currStation}</p>
              ))}
          </div>
        </div>
      </div>
      <div>
        <Link href="/station/create">
          <Button variant="success">New</Button>
        </Link>

        <Button onClick={(e) => editStation(e)}>Update</Button>

        <Button variant='danger' onClick={() => handleRemove()}>Remove</Button>
      </div>
    </div>
  );
}

export default index;
