import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  getOneTrainAction,
  updateTrainAction,
} from "../../../actions/trainActions";
import { getAllCarAction } from "../../../actions/carActions";
import { getAllRouteAction } from "../../../actions/routeActions";
import { Alert, Button } from "react-bootstrap";
import Loader from "../../../components/Loader";

function update() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const carCurrRef = useRef();
  const carAvailRef = useRef();

  const [number, setNumber] = useState();
  const [cars, setCars] = useState();
  const [assignedRoute, setAssignedRoute] = useState();
  const [currSelection, setCurrSelection] = useState();

  const [availableCars, setAvailableCars] = useState();

  const updatedTrain = useSelector((state) => state.train.update.data);
  const trainState = useSelector((state) => state.train.getOne);
  const { data: trainFromState, error: trainError } = trainState;
  const carsFromState = useSelector((state) => state.car.all.data);
  const routeFromState = useSelector((state) => state.route.allRoute.data);
  // get state
  useEffect(() => {
    if (trainError) {
      router.push('/train')
    }
  }, [trainError]);

  useEffect(() => {
    if (!id) return;
    dispatch(getOneTrainAction(id));
  }, [id, updatedTrain]);

  useEffect(() => {
    if (carsFromState) return;
    dispatch(getAllCarAction());
  }, [carsFromState]);

  useEffect(() => {
    if (routeFromState) return;
    dispatch(getAllRouteAction());
  }, [routeFromState]);

  useEffect(() => {
    if (!trainFromState) return;
    setNumber(trainFromState.number);
    setCars(trainFromState.cars);
    setAssignedRoute(trainFromState.assignedRoute);
  }, [trainFromState]);

  useEffect(() => {
    if (!carsFromState) return;
    setAvailableCars(carsFromState.filter((x) => !x.assignedTrain));
  }, [carsFromState]);

  const selectCar = (e, item) => {
    e.preventDefault();
    const classes = e.target.closest("li").classList;

    if (classes.contains("selected")) {
      classes.remove("selected");
      setCurrSelection(null);
      return;
    }

    for (let i = 0; i < carCurrRef.current.children.length; i++) {
      const element = carCurrRef.current.children[i];
      element.classList.remove("selected");
    }
    for (let i = 0; i < carAvailRef.current.children.length; i++) {
      const element = carAvailRef.current.children[i];
      element.classList.remove("selected");
    }

    classes.add("selected");
    setCurrSelection(item);
  };
  const addCar = () => {
    if (!currSelection) return;

    const car = currSelection;
    // if car is not assigned to train and is in list of availabvle cars
    if (!car.assignedTrain && availableCars.includes(car)) {
      car.assignedTrain = trainFromState._id;
      // assign to train remove from available list and add to curr list
      availableCars.splice(availableCars.indexOf(car), 1);
      setAvailableCars([...availableCars]);
      cars.push(car);
      setCars([...cars]);
      // clear selection
      setCurrSelection(null);
    }
  };
  const removeCar = () => {
    if (!currSelection) return;

    const car = currSelection;
    if (car.assignedTrain == trainFromState._id && cars.includes(car)) {
      car.assignedTrain = null;
      // remove train assigment remove from curr list and add to available
      cars.splice(cars.indexOf(car), 1);
      setCars([...cars]);
      availableCars.push(car);
      setAvailableCars([...availableCars]);
      // clear selection
      setCurrSelection(null);
    }
  };
  const handleConfirm = (e) => {
    e.preventDefault();
    dispatch(updateTrainAction({ id, number, cars, assignedRoute }));
  };
  return (
    <div>
      <form onSubmit={(e) => handleConfirm(e)}>
        <Button type="submit">Confirm</Button>
        <br />
        <label>number</label>
        <input
          type="number"
          onChange={(e) => setNumber(e.target.value)}
          defaultValue={number}
        />
        <br />
        <h5>Cars</h5>
        <Button onClick={() => removeCar()}>Remove</Button>
        <Button onClick={() => addCar()}>Add</Button>
        <div className="edit-train-cars-section">
          <ul ref={carCurrRef}>
            <h5>Curr</h5>
            {cars &&
              cars.map((car) => (
                <li key={car._id} onClick={(e) => selectCar(e, car)}>
                  <p>{car.number}</p>
                </li>
              ))}
          </ul>

          {currSelection && JSON.stringify(currSelection)}
          <ul ref={carAvailRef}>
            <h5>Available</h5>
            {availableCars &&
              availableCars.map((car) => (
                <li key={car._id} onClick={(e) => selectCar(e, car)}>
                  <p>{car.number}</p>
                </li>
              ))}
          </ul>
        </div>
        <label>assignedRoute</label>
        <br />
        {assignedRoute && <h5>{assignedRoute.routeName}</h5>}
        <label>All Routes</label>
        <ul>
          {routeFromState &&
            routeFromState.map((route) => (
              <li key={route._id} onClick={() => setAssignedRoute(route)}>
                {route.routeName}
              </li>
            ))}
        </ul>
      </form>
    </div>
  );
}

export default update;
