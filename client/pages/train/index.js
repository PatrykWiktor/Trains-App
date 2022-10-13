import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  getAllTrainControlAction,
  removeTrainControlAction,
} from "../../actions/trainActions";
import { getAllRunAction } from "../../actions/runActions";
import { useRouter } from "next/router";
import {
  ListGroup,
  FormControl,
  Dropdown,
  ButtonGroup,
  Button,
  CloseButton,
  DropdownButton,
  Form,
  Alert,
  Modal,
  ListGroupItem,
} from "react-bootstrap";
function index() {
  const router = useRouter();
  const dispatch = useDispatch();

  const trainControlList = useSelector((state) => state.train.controlAll.data);
  const runList = useSelector((state) => state.run.all.data);

  useEffect(() => {
    if (!trainControlList) dispatch(getAllTrainControlAction());
  }, [trainControlList]);
  useEffect(() => {
    if (!runList) dispatch(getAllRunAction());
  }, [runList]);
  const toggleDisplay = (e) => {
    // quick toggle of element style display attribute

    const elementToToggle = e.currentTarget.children[1];
    if (elementToToggle.style.display == "none") {
      elementToToggle.style.display = "flex";
    } else {
      elementToToggle.style.display = "none";
      e.currentTarget.blur();
    }
  };
  return (
    <div>
      <Button onClick={() => router.push("/train/create")}>Create New</Button>

      <ListGroup style={{ maxWidth: "85%", margin: "auto" }}>
        {trainControlList &&
          trainControlList.map((train) => (
            <ListGroup.Item
              onClick={(e) => toggleDisplay(e)}
              action
              variant="light"
              key={train._id}
              as='div'
            >
              <ListGroup style={{ marginBottom: "1em" }} horizontal>
                <ListGroup.Item>Train Number</ListGroup.Item>
                <ListGroup.Item>{train.number}</ListGroup.Item>
                <Button
                  onClick={() => router.push(`/train/update/${train._id}`)}
                  style={{ marginLeft: "auto" }}
                  size="sm"
                >
                  Edit
                </Button>
                <Button
                  style={{ marginLeft: "1em" }}
                  variant="danger"
                  size="sm"
                  onClick={() => dispatch(removeTrainControlAction(train._id))}
                >
                  Remove
                </Button>
              </ListGroup>

              <ListGroup horizontal style={{ display: "none" }}>
                <ListGroup style={{ width: "35%" }}>
                  <ListGroup.Item>Cars</ListGroup.Item>

                  <ListGroup.Item  style={{ height: "100%" }}>
                    <ListGroup horizontal>
                      <ListGroup.Item disabled style={{ width: "50%" }}>
                        Number
                      </ListGroup.Item>
                      <ListGroup.Item disabled style={{ width: "50%" }}>
                        Type
                      </ListGroup.Item>
                    </ListGroup>
                    {train.cars.map((car) => (
                      <ListGroup horizontal key={car.number}>
                        <ListGroup.Item style={{ width: "50%" }}>
                          {car.number}
                        </ListGroup.Item>
                        <ListGroup.Item style={{ width: "50%" }}>
                          {car.type}
                        </ListGroup.Item>
                      </ListGroup>
                    ))}
                  </ListGroup.Item>
                </ListGroup>
                <ListGroup style={{ width: "65%" }}>
                  <ListGroupItem>Runs</ListGroupItem>

                  <ListGroupItem style={{ height: "100%" }}>
                    <ListGroup horizontal>
                      <ListGroup.Item disabled style={{ width: "35%" }}>
                        Route
                      </ListGroup.Item>
                      <ListGroup.Item disabled style={{ width: "20%" }}>
                        On Run
                      </ListGroup.Item>
                      <ListGroup.Item disabled style={{ width: "45%" }}>
                        Departure Time
                      </ListGroup.Item>
                    </ListGroup>
                    <ListGroup>
                      {runList &&
                        runList
                          .filter((run) => {
                            return run.assignedTrain.number == train.number;
                          })
                          .map((filteredRun) => (
                            <ListGroup key={filteredRun._id} horizontal>
                              <ListGroup.Item style={{ width: "35%" }}>
                                {filteredRun.route.routeName}
                              </ListGroup.Item>
                              <ListGroup.Item style={{ width: "20%" }}>
                                {JSON.stringify(filteredRun.onRun)}
                              </ListGroup.Item>
                              <ListGroup.Item style={{ width: "45%" }}>
                                {new Date(
                                  filteredRun.departureTime
                                ).toLocaleDateString()}
                                {"   "}
                                {new Date(
                                  filteredRun.departureTime
                                ).toLocaleTimeString()}
                              </ListGroup.Item>
                            </ListGroup>
                          ))}
                    </ListGroup>
                  </ListGroupItem>
                </ListGroup>
              </ListGroup>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
}

export default index;
