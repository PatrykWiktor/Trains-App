import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRouteAction,
  removeRouteAction,
} from "../../actions/routeActions";
import { getAllStationAction } from "../../actions/stationActions";
import Loader from "../../components/Loader";
import { useRouter } from "next/router";
import { Alert, Button } from "react-bootstrap";
import Link from "next/link";
import {
  ROUTE_CREATE_RESET,
  ROUTE_REMOVE_RESET,
  ROUTE_UPDATE_RESET,
} from "../../constants/routeConstants";
function index() {
  const dispatch = useDispatch();
  const router = useRouter();
  // ref
  const routeListRef= useRef()

  const [currSelection, setCurrSelection] = useState(null);
  const [selectAlert, setSelectAlert] = useState(false);

  const allRoute = useSelector((state) => state.route.allRoute);
  const {
    data: routeList,
    loading: loadingGetAllRoute,
    error: errorGetAllRoute,
  } = allRoute;
  const allStations = useSelector((state) => state.station.allStations);
  const {
    data: stationList,
    loading: loadingGetAllStations,
    error: errorGetAllStation,
  } = allStations;
  const removedRoute = useSelector((state) => state.route.remove.data);
  const createdRoute = useSelector((state) => state.route.createRoute.data);
  // get all route on mount
  useEffect(() => {
    // CHECK if any route exists dont fetch data
    if (routeList) return;
    dispatch(getAllRouteAction());
    if (!stationList) {
      dispatch(getAllStationAction());
    }
  }, []);
  useEffect(() => {
    if (removedRoute) {
      dispatch(getAllRouteAction());
    }
    if (createdRoute) {
      dispatch(getAllRouteAction());
    }
  }, [removedRoute]);
  const removeRoute = (e) => {
    e.preventDefault();
    if (!currSelection) {
      setSelectAlert(true);
      return;
    }
    setSelectAlert(false);
    dispatch(removeRouteAction(currSelection._id));
  };
  const editRoute = () => {
    if (!currSelection) {
      setSelectAlert(true);
      return;
    }
    router.push(`/route/update/${currSelection._id}`);
  };
  const findInStationList = (id, many) => {
    if (!stationList) return;
    if (many == true) {
      const list = [];
      for (let i = 0; i < id.length; i++) {
        let stationID = id[i];
        let station = stationList.filter((x) => x._id == stationID);
        list.push(station[0]);
      }
      return list;
    }
    const station = stationList.filter((x) => x._id == id);
    return station[0];
  };
  const selectRoute = (e, route) => {
    const classes = e.target.classList;

    if (classes.contains("selected")) {
      classes.remove("selected");
      setCurrSelection(null)
      clearSelection(routeListRef);
      return;
    }
    clearSelection(routeListRef);
    setCurrSelection(route)
    classes.add("selected");
  };
  const clearSelection = (list) => {
    for (let i = 0; i < list.current.children.length; i++) {
      const element = list.current.children[i];
      element.classList.remove("selected");
    }
  };
  return (
    <div>
      <Alert
        show={selectAlert}
        onClose={() => setSelectAlert(false)}
        dismissible
        variant="danger"
      >
        <Alert.Heading>Error</Alert.Heading>
        <p>
          Select <strong>route</strong> to proceed.
        </p>
      </Alert>
      {removedRoute && (
        <Alert
          variant="success"
          onClose={() => dispatch({ type: ROUTE_REMOVE_RESET })}
          dismissible
        >
          <h5>Success !</h5>
          <p>
            <strong>{removedRoute.routeName}</strong> has beed removed.
          </p>
        </Alert>
      )}
      {createdRoute && (
        <Alert
          variant="success"
          onClose={() => dispatch({ type: ROUTE_CREATE_RESET })}
          dismissible
        >
          <h5>Success !</h5>
          <p>
            Route <strong>{createdRoute.routeName}</strong> has beed created.
          </p>
        </Alert>
      )}
      <Button variant="danger" onClick={(e) => removeRoute(e)}>
        Remove
      </Button>
      <Button
        variant="success"
        onClick={() => {
          router.push("/route/create");
        }}
      >
        Create
      </Button>
      <Button variatn="info" onClick={() => editRoute()}>
        Update
      </Button>
      <ul ref={routeListRef}>
        <h4>All routes</h4>
        {loadingGetAllRoute ? (
          <Loader />
        ) : errorGetAllRoute ? (
          { errorGetAllRoute }
        ) : (
          routeList &&
          routeList.map((route) => (
            <li key={route._id} onClick={(e) => selectRoute(e,route)}>
              {route.routeName}
            </li>
          ))
        )}
      </ul>
      <h4>Stops</h4>
      <ul>
        {currSelection &&
          findInStationList(currSelection.stops, true).map((station) => (
            <li key={station._id}>{station.currStation}</li>
          ))}
      </ul>
    </div>
  );
}

export default index;
