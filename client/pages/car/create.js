import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrainAction } from "../../actions/trainActions";
import { createCarAction } from "../../actions/carActions";
import { Button } from "react-bootstrap";
import Loader from "../../components/Loader";
import Link from "next/link";
import { useRouter } from "next/router";

function create() {
  const dispatch = useDispatch();
  const router = useRouter()
  const trainListRef = useRef();
  const [type, setType] = useState("passengerCar");
  // ["passengerCar", "bikeCar", "engineCar"]
  const [number, setNumber] = useState(0);
  const [assignedTrain, setAssignedTrain] = useState(null);

  const trainFromState = useSelector((state) => state.train.all);
  const { data: allTrains, loading: allTrainsLoading } = trainFromState;
  const newCar = useSelector((state)=>state.car.create.data)

  useEffect(() => {
    if (allTrains) return;
    dispatch(getAllTrainAction());
  }, []);

  useEffect(()=>{
    if(!newCar) return
    router.push(`/car/`)
  },[newCar])
  const selectOne = (e, item) => {
    e.preventDefault();
    const classes = e.target.closest("li").classList;

    // handle curr selection
    // if already selected remove class and set state to empty
    if (classes.contains("selected")) {
      classes.remove("selected");
      setAssignedTrain(null);
      return;
    }
    // else remove all selected classes from this list
    for (let i = 0; i < trainListRef.current.children.length; i++) {
      const element = trainListRef.current.children[i];
      element.classList.remove("selected");
    }
    // add class to selection and set state
    classes.add("selected");
    setAssignedTrain(item);
    return;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createCarAction({ type, number, assignedTrain }));
  };
  return (
    <div>
      {type && <p>{type}</p>}
      {number && <p>{number}</p>}
      {assignedTrain && <p>{assignedTrain}</p>}

      <form style={{ display: "flex" }} onSubmit={(e) => handleSubmit(e)}>
        <div
          style={{ display: "flex", flexDirection: "column" }}
          className="left"
        >
          <div className="car-type" onChange={(e) => setType(e.target.value)}>
            <h5>Car Type</h5>
            <div>
              <input
                type="radio"
                value="passengerCar"
                style={{ marginRight: "1rem" }}
                name="type"
                defaultChecked
              />
              <label for="passengerCar">Passenger Car</label>
            </div>
            <div>
              <input
                type="radio"
                value="bikeCar"
                style={{ marginRight: "1rem" }}
                name="type"
              />
              <label for="bikeCar">Bike Car</label>
            </div>
            <div>
              <input
                type="radio"
                value="engineCar"
                style={{ marginRight: "1rem" }}
                name="type"
              />
              <label for="engineCar">Engine Car</label>
            </div>
          </div>
          <div
            className="car-number"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label>Number</label>
            <input
              onChange={(e) => setNumber(e.target.value)}
              type="number"
              value={number}
              style={{ marginRight: "1rem" }}
            />
          </div>
        </div>
        <ul ref={trainListRef}>
          {allTrainsLoading ? (
            <Loader />
          ) : (
            allTrains &&
            allTrains.map((train) => (
              <li key={train._id} onClick={(e) => selectOne(e, train._id)}>
                <p style={{ marginBottom: "0.2rem" }}>Number {train.number}</p>
                <p>Type {train.type}</p>
              </li>
            ))
          )}
        </ul>
        <Button type="submit">SUBMIT</Button>
      </form>
    </div>
  );
}

export default create;
