import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTrainControlAction,
  updateTrainControlAction,
  getAllTrainControlAction,
} from "../../../actions/trainActions";
import { CAR_ALLOWED_TYPES } from "../../../constants/carConstants";
import {
  ListGroup,
  FormControl,
  Dropdown,
  ButtonGroup,
  Button,
  DropdownButton,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import { useRouter } from "next/router";
function update() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const [err, setErr] = useState({});
  const [currTrain, setCurrTrain] = useState(null);
  const [trainNumber, setTrainNumber] = useState(Number);
  const [carsList, setCarsList] = useState([]);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);

  const trainControlList = useSelector((state) => state.train.controlAll.data);

  // fill form with nfo from state
  useEffect(() => {
    if (!trainControlList) dispatch(getAllTrainControlAction());
    else if (!currTrain) {
      if (!id) return;
      const trainFromState = trainControlList.find((x) => {
        return (x._id = id);
      });
      setCurrTrain(trainFromState);
      setTrainNumber(trainFromState.number);
      setCarsList(trainFromState.cars);
    }
  }, [trainControlList, id]);

  const submitTrainForm = (e) => {
    e.preventDefault();
    // check if value is NaN
    if (Number.isNaN(trainNumber)) {
      //throw error
      err.numberNaN = "Train number is not a number";
    } else {
      delete err.numberNaN;
    }
    // check if there are any cars
    if (carsList.length == 0) {
      // ifnot throw error
      err.noCars = "Train needs at least one car";
    } else {
      delete err.noCars;
    }
    // crate list of types of cars
    const typesList = carsList.map((x) => {
      return x.type;
    });
    // if there is no engine
    if (!typesList.includes("engineCar")) {
      // return error
      err.noEngine = "Train needs at least one Engine Car";
    } else {
      delete err.noEngine;
    }
    const existingTrainNumbers = trainControlList.map((x) => {
      return x.number;
    });
    // cheack if number exists
    if (existingTrainNumbers.includes(trainNumber) && currTrain.number != trainNumber ){
      err.numberExists = `Train number ${trainNumber} already exists`;
    } else {
      delete err.numberExists;
    }
    // set State
    setErr({ ...err });
    // if no errors / err len == 0
    if (Object.keys(err).length == 0) {
      setShowCreateConfirm(true);
    }
  };
  const updateTrainController = (e) => {
    e.preventDefault();
    dispatch(
      updateTrainControlAction({ id: id, number: trainNumber, cars: carsList })
    );
    // setShowCreateConfirm(false);
    //TODO redirect to prev page or smh
  };
  const maxNumber = () => {
    // if no cars max number is zero
    if (carsList[carsList.length - 1] == undefined) return 0;
    // else get max number from cars list and return maxNumber + 1
    const carsNumbers = carsList.map((x) => {
      return parseInt(x.number);
    });
    const result = Math.max(...carsNumbers);
    return result + 1;
  };
  const handleRemove = (e, car) => {
    carsList.splice(carsList.indexOf(car), 1);
    setCarsList([...carsList]);
  };
  return (
    <div>
      <Modal
        show={showCreateConfirm}
        fullscreen={true}
        onHide={() => setShowCreateConfirm(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm new train model</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <p>Train Details</p>
            <ListGroup horizontal>
              <ListGroup.Item style={{ minWidth: "10em" }}>
                Train Number
              </ListGroup.Item>
              <ListGroup.Item>{trainNumber}</ListGroup.Item>
            </ListGroup>
          </div>
          <div>
            <p>Cars Details</p>
            <ListGroup>
              <ListGroup horizontal>
                <ListGroup.Item disabled style={{ minWidth: "10em" }}>
                  Car Type
                </ListGroup.Item>
                <ListGroup.Item disabled> Car Number</ListGroup.Item>
              </ListGroup>
              {carsList &&
                carsList.map((car) => (
                  <ListGroup horizontal key={carsList.indexOf(car)}>
                    <ListGroup.Item style={{ minWidth: "10em" }}>
                      {car.type}
                    </ListGroup.Item>
                    <ListGroup.Item>{car.number}</ListGroup.Item>
                  </ListGroup>
                ))}
            </ListGroup>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowCreateConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={(e) => updateTrainController(e)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {Object.keys(err).length > 0 && (
        <Alert variant="danger">
          <Alert.Heading>
            {Object.keys(err).length}{" "}
            {Object.keys(err).length > 1 ? "errors" : "error"} occured !
          </Alert.Heading>
          <hr />
          {Object.values(err).map((x) => (
            <p key={x}>{x}</p>
          ))}
        </Alert>
      )}
      <h2>Update Train Model</h2>
      <Form onSubmit={(e) => submitTrainForm(e)}>
        <Button type="submit">Submit</Button>
        <Button
          onClick={() => {
            setCarsList([
              ...carsList,
              {
                type: "passengerCar",
                number: maxNumber(),
              },
            ]);
          }}
        >
          New
        </Button>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FormControl
            type="number"
            style={{ width: "8ch" }}
            value={trainNumber}
            onChange={(e) => {
              setTrainNumber(parseInt(e.target.value));
            }}
          />
          <p>Train Number</p>
        </div>
        <ListGroup>
          {carsList &&
            carsList.map((car) => (
              <ListGroup.Item
                key={carsList.indexOf(car)}
                style={{ display: "flex" }}
              >
                <FormControl
                  type="number"
                  style={{ width: "8ch" }}
                  value={car.number}
                  onChange={(e) => {
                    carsList[carsList.indexOf(car)].number = parseInt(
                      e.target.value
                    );
                    setCarsList([...carsList]);
                  }}
                />
                <DropdownButton
                  as={ButtonGroup}
                  title={car.type}
                  variant="light"
                  style={{
                    width: "10em",
                    marginRight: "1em",
                    marginLeft: "1em",
                  }}
                >
                  {CAR_ALLOWED_TYPES.map((carType) => (
                    <Dropdown.Item
                      onClick={() => {
                        carsList[carsList.indexOf(car)].type = carType;
                        setCarsList([...carsList]);
                      }}
                      key={carType}
                    >
                      {carType}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <Button variant="danger" onClick={(e) => handleRemove(e, car)}>
                  Remove
                </Button>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Form>
    </div>
  );
}

export default update;
