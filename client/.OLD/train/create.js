import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCarAction } from "../../actions/carActions";
import { getAllRouteAction } from "../../actions/routeActions";
import { createTrainAction } from "../../actions/trainActions";

function create() {
  const dispatch = useDispatch();

  const routeListRef = useRef();

  const [trainNumber, setTrainNumber] = useState(0);
  const [currCars, setCurrCars] = useState([]);
  const [currRoute, setCurrRoute] = useState(null);

  const allCars = useSelector((state) => state.car.all.data);
  const allroute = useSelector((state) => state.route.allRoute.data);
  const trainState = useSelector((state) => state.train.create);
  const { data: newTrain, error: errorNewTrain } = trainState;

  useEffect(() => {
    if (!newTrain) return;
    // TODO handle new train creation
  }, [newTrain]);

  useEffect(() => {
    if (allCars) return;
    dispatch(getAllCarAction());
  }, [allCars]);

  useEffect(() => {
    if (allroute) return;
    dispatch(getAllRouteAction());
  }, [allroute]);

  const selectCar = (e, car) => {
    const element = e.target.classList;
    if (!element.contains("selected")) {
      element.add("selected");
      if (currCars) {
        setCurrCars([...currCars, car]);
      } else {
        setCurrCars([car]);
      }

      return;
    }
    if (element.contains("selected")) element.remove("selected");
    setCurrCars(currCars.filter((x) => x != car));
  };
  const selectRoute = (e, route) => {
    const element = e.target.classList;
    if (!element.contains("selected")) {
      for (let i = 0; i < routeListRef.current.children.length; i++) {
        const route = routeListRef.current.children[i].classList;
        route.remove("selected");
      }
      element.add("selected");
      setCurrRoute(route);
      return;
    }
    if (element.contains("selected")) element.remove("selected");
    setCurrRoute(null);
  };
  const makeMeTrain = () => {
    dispatch(
      createTrainAction({
        number: trainNumber,
        cars: currCars,
        assignedRoute: currRoute,
      })
    );
  };
  return (
    <div>
      <button onClick={() => makeMeTrain()}>Create Train</button>
      <input
        type="number"
        onChange={(e) => setTrainNumber(e.target.value)}
        value={trainNumber}
      ></input>
      <h5>Select Cars</h5>
      <ul>
        {allCars &&
          allCars
            .filter((x) => !x.assignedTrain)
            .map((car) => (
              <li onClick={(e) => selectCar(e, car._id)} key={car._id}>
                {car.number}
              </li>
            ))}

        <h5>Select Route </h5>

        <ul ref={routeListRef}>
          {allroute &&
            allroute.map((route) => (
              <li onClick={(e) => selectRoute(e, route)} key={route._id}>
                {route.routeName}
              </li>
            ))}
        </ul>
      </ul>
    </div>
  );
}

export default create;
