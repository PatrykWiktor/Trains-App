import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getOneCarAction, updateCarAction } from "../../../actions/carActions";
import { getAllTrainAction } from "../../../actions/trainActions";
import Link from "next/link";
import { Alert, Button } from "react-bootstrap";
import Loader from "../../../components/Loader";
function update() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const trainListRef = useRef();
  const seatListRef = useRef();

  const [currSeat, setCurrSeat] = useState();

  const [type, setType] = useState();
  const [number, setNumber] = useState();
  const [assignedTrain, setAssignedTrain] = useState();
  const [seats, setSeats] = useState();
  const [tempSeats, setTempSeats] = useState(0);

  const trainFromState = useSelector((state) => state.train.all);
  const { data: allTrains, loading: allTrainsLoading } = trainFromState;
  const carFromState = useSelector((state) => state.car.getOne);
  const { data: car, loading: carLoading } = carFromState;
  const updatedCar = useSelector((state) => state.car.update.data);
  const newSeat = useSelector((state) => state.seat.create.data);

  useEffect(() => {
    if (!newSeat) return;
    console.log(newSeat);
    setSeats([...seats]);
  }, [newSeat]);

  // useEffect(() => {
  //   if (!updatedCar) return;
  //   router.push("/car/");
  // }, [updatedCar]);

  useEffect(() => {
    if (allTrains) return;
    dispatch(getAllTrainAction());
  }, []);
  useEffect(() => {
    if (!id) return;
    dispatch(getOneCarAction(id));
  }, [id]);
  useEffect(() => {
    if (!car) return;
    setType(car.type);
    setNumber(car.number);
    if (car.seats) {
      setSeats(car.seats);
    }
    if (car.assignedTrain) {
      setAssignedTrain(car.assignedTrain);
      for (let i = 0; i < trainListRef.current.children.length; i++) {
        const element = trainListRef.current.children[i];
        if (car.assignedTrain == element.getAttribute("train-id")) {
          element.classList.add("selected");
        }
      }
    }
  }, [car]);

  const selectTrain = (e, item) => {
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
  const selectSeat = (e, item) => {
    e.preventDefault();
    const classes = e.target.closest("li").classList;

    // handle curr selection
    // if already selected remove class and set state to empty
    if (classes.contains("selected")) {
      classes.remove("selected");
      setCurrSeat(null);
      return;
    }
    // else remove all selected classes from this list
    for (let i = 0; i < seatListRef.current.children.length; i++) {
      const element = seatListRef.current.children[i];
      element.classList.remove("selected");
    }
    // add class to selection and set state
    classes.add("selected");
    setCurrSeat(item);
    return;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO add dialog confirm
    dispatch(updateCarAction({ id, type, number, assignedTrain, seats }));
  };
  const handleRemove = () => {
    if (!currSeat) return;
    // if seat is temprorary
    if (currSeat[0] == "T") {
      tempSeats--;
      setTempSeats(tempSeats);
    }

    const seatRemoved = seats.filter((x) => x._id == currSeat)[0];
    seats[seats.indexOf(seatRemoved)].removed = true;
    setSeats([...seats]);

    // setSeats([...seats.filter((x) => x._id != currSeat)]);

    setCurrSeat(null);
  };
  const handleAdd = () => {
    // TODO add dialog confirm
    // dispatch(createSeatAction({ assignedCar: id }));
    tempSeats++;
    setTempSeats(tempSeats);
    let newTempSeat = {
      //prefix T for temporary seat
      _id: `TEMP${seats.length + 1}`,
      number: seats.length + 1,
    };
    setSeats([...seats, newTempSeat]);
  };
  return (
    <div>
      {tempSeats && tempSeats}
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
                checked={type == "passengerCar"}
              />
              <label>Passenger Car</label>
            </div>
            <div>
              <input
                type="radio"
                value="bikeCar"
                style={{ marginRight: "1rem" }}
                name="type"
                checked={type == "bikeCar"}
              />
              <label>Bike Car</label>
            </div>
            <div>
              <input
                type="radio"
                value="engineCar"
                style={{ marginRight: "1rem" }}
                name="type"
                checked={type == "engineCar"}
              />
              <label>Engine Car</label>
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
          <h5>Train</h5>
          {allTrainsLoading ? (
            <Loader />
          ) : (
            allTrains &&
            allTrains.map((train) => (
              <li
                key={train._id}
                train-id={train._id}
                onClick={(e) => selectTrain(e, train._id)}
              >
                <p style={{ marginBottom: "0.2rem" }}>Number {train.number}</p>
                <p>Type {train.type}</p>
              </li>
            ))
          )}
        </ul>
        <ul ref={seatListRef}>
          <h5>Seats</h5>
          {seats &&
            seats
              .filter((x) => x.removed != true)
              .map((seat) => (
                <li
                  style={{
                    padding: "0.2em",
                    marginLeft: "2em",
                    marginRight: "2em",
                    display: "flex",
                  }}
                  onClick={(e) => selectSeat(e, seat._id)}
                  key={seat._id}
                >
                  <p>{seat.number}</p>
                  {/* {seat.vacuity && seat.vacuity.map((station)=>(
                  <div>
                    <p>{station.stop.currStation}</p>
                    <p>{station.occupied ? 'True' : 'False'}</p>
                  </div>
                ))} */}
                </li>
              ))}
        </ul>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h5>Seat</h5>
          <div>
            <Button
              style={{ height: "min-content", margin: "auto" }}
              onClick={() => handleRemove()}
              variant="danger"
            >
              REMOVE
            </Button>
            <Button
              style={{ height: "min-content", margin: "auto" }}
              onClick={() => handleAdd()}
              variant="success"
            >
              ADD
            </Button>
          </div>
          <span style={{width:'100%',borderBottom:"black solid 2px",margin:'1em  0 0.25em 0'}}></span>
          <Button style={{ height: "min-content" }} type="submit">
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
}

export default update;
