import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCarAction,removeCarAction } from "../../actions/carActions";
import { createTrainAction } from '../../actions/trainActions'
import { Button } from "react-bootstrap";
import Loader from "../../components/Loader";
import Link from "next/link";
import { useRouter } from "next/router";
import { CAR_CREATE_RESET } from "../../constants/carConstants";
function index() {
  const dispatch = useDispatch();
  const router = useRouter();
  const listRef = useRef();

  const carsFromState = useSelector((state) => state.car.all);
  const { data: allCars, loading: allCarsLoading } = carsFromState;
  const newCar = useSelector((state) => state.car.create.data);

  const [currSelection, setCurrSelection] = useState(null);

  useEffect(() => {
    if (allCars) return;
    dispatch(getAllCarAction());
  }, []);

  useEffect(() => {
    if (!newCar) return;
    dispatch({ type: CAR_CREATE_RESET });
    dispatch(getAllCarAction());
  }, [newCar]);

  const selectOne = (e, item) => {
    e.preventDefault();
    const classes = e.target.closest("li").classList;

    // handle curr selection
    // if already selected remove class and set state to empty
    if (classes.contains("selected")) {
      classes.remove("selected");
      setCurrSelection(null);
      return;
    }
    // else remove all selected classes from this list
    for (let i = 0; i < listRef.current.children.length; i++) {
      const element = listRef.current.children[i];
      element.classList.remove("selected");
    }
    // add class to selection and set state
    classes.add("selected");
    setCurrSelection(item);
    return;
  };
  const removeOne = () => {
    // TODO add Dialog confirmation
    dispatch(removeCarAction(currSelection))
  };
  return (
    <div>
      <div>
        <Button variant="success" onClick={() => router.push(`car/create/`)}>
          Create
        </Button>
        <Button
          variant="info"
          onClick={() => router.push(`car/update/${currSelection}`)}
        >
          Edit
        </Button>
        <Button variant="danger" onClick={() => removeOne()}>
          Remove
        </Button>
      </div>
      <ul ref={listRef}>
        {allCarsLoading ? (
          <Loader />
        ) : (
          allCars &&
          allCars.map((car) => (
            <li key={car._id} onClick={(e) => selectOne(e, car._id)}>
              <p>{car.number}</p>
              <p>{car.type}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default index;
