import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStationAction } from "../../actions/stationActions";
import {
  createTicketAction,
  validateTicketAction,
} from "../../actions/ticketActions";
import { getAllRouteAction } from "../../actions/routeActions";
import { getAllTrainAction } from "../../actions/trainActions";
import {
  getAllRunAction,
  getConnectionRunAction,
} from "../../actions/runActions";
import { RUN_GET_CONNECTION_RESET } from "../../constants/runConstants";
import Dialog from "../../components/Dialog";
import {
  Alert,
  Dropdown,
  ButtonGroup,
  Button,
  Form,
  FormGroup,
  Card,
  ListGroup,
} from "react-bootstrap";
function create() {
  const dispatch = useDispatch();

  const [startStation, setStartStation] = useState(null);
  const [endStation, setEndStation] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [bikeCount, setBikeCount] = useState(0);

  const [currRun, setCurrRun] = useState(null);

  // const [myTicket, setMyTicket] = useState({
  //   conn: null,
  //   startStation: null,
  //   endStation: null,
  //   passengerCount: null,
  // });

  // get stations from state
  const allStations = useSelector((state) => state.station.allStations);
  const {
    data: stationList,
    loading: loadingGetAllStations,
    error: errorGetAllStation,
  } = allStations;
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const connections = useSelector((state) => state.run.getConnection.data);
  const ticketValid = useSelector((state) => state.ticket.valid.data);
  const newTicket = useSelector((state) => state.ticket.create.data);
  const allRoute = useSelector((state) => state.route.allRoute.data);
  const allTrain = useSelector((state) => state.train.all.data);
  const allRun = useSelector((state) => state.run.all.data);

  //Validate available seats for selected route
  useEffect(() => {
    if (!currRun || !passengerCount) return;
    dispatch(
      validateTicketAction({
        user: userInfo._id,
        // station id, find in Station list as startStation is just Stationname
        startStation: stationList.find((x) => x.currStation == startStation),
        // station id, same as above
        endStation: stationList.find((x) => x.currStation == endStation),
        // int
        passengerCount: passengerCount,
        // train object
        conn: currRun,
      })
    );
  }, [currRun, passengerCount]);

  //get all data from db
  useEffect(() => {
    if (!stationList) dispatch(getAllStationAction());

    if (!allRoute) dispatch(getAllRouteAction());

    if (!allTrain) dispatch(getAllTrainAction());

    if (!allRun) dispatch(getAllRunAction());
  }, []);

  // set default station
  useEffect(() => {
    if (!stationList) return;
    if (stationList.length > 1) {
      setStartStation(stationList[0].currStation);
    }
  }, [stationList]);

  const handleSubmit = () => {
    if(!ticketValid) return
    dispatch(
      createTicketAction({
        user: userInfo._id,
        seats: ticketValid.seats,
        stops:ticketValid.stops,
      })
    );
  };
  // get runs if both stations are selected
  useEffect(() => {
    if (!startStation || !endStation) return;
    setCurrRun(null);
    if (startStation == endStation) {
      setEndStation(null);
      dispatch({ type: RUN_GET_CONNECTION_RESET });
      return;
    }
    dispatch(getConnectionRunAction(startStation, endStation));
  }, [startStation, endStation]);

  const selectRun = (e, run) => {
    e.preventDefault();
    //if no curr run set it to run
    if (!currRun) {
      setCurrRun(run);
      return;
    }
    // else if selected run is equal to current run set to null ald clear focus
    if (currRun._id == run._id) {
      setCurrRun(null);
      e.target.blur();
      return;
    }
    // else just set curr ru nto run
    setCurrRun(run);
  };
  return (
    <div>
      {stationList && (
        <Form onSubmit={() => handleSubmit()}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <div id="station Section">
              <Form.Group className="mb-3">
                <Form.Label>Starting Station</Form.Label>
                <Form.Select onChange={(e) => setStartStation(e.target.value)}>
                  {stationList.map((station) => (
                    <option key={station._id}>{station.currStation}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Final Station</Form.Label>
                <Form.Select onChange={(e) => setEndStation(e.target.value)}>
                  <option>{endStation == null && "None"}</option>
                  {startStation &&
                    stationList
                      .filter((x) => x.currStation != startStation)
                      .map((station) => (
                        <option key={station._id}>{station.currStation}</option>
                      ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div>
              <Button
                style={{ margin: "4rem 2rem" }}
                disabled={currRun == null || !ticketValid}
                type="submit"
              >
                Submit
              </Button>
            </div>
            <div id="passanger section">
              <Form.Group className="mb-3">
                <Form.Label>Passenger Count</Form.Label>
                <Form.Control
                  onChange={(e) => setPassengerCount(e.target.value)}
                  type="number"
                  value={passengerCount}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bike Count</Form.Label>
                <Form.Control
                  onChange={(e) => setBikeCount(e.target.value)}
                  type="number"
                  value={bikeCount}
                />
              </Form.Group>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {connections &&
              connections.map((conn) =>
                conn.map((x) => (
                  <ListGroup key={x._id} style={{ margin: "1rem 0" }}>
                    <ListGroup.Item
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        padding: "1rem",
                      }}
                      active={currRun && x._id == currRun._id}
                      action
                      variant="light"
                      onClick={(e) => selectRun(e, x)}
                    >
                      <ListGroup style={{ margin: "0 1rem" }}>
                        <ListGroup.Item>Train Number</ListGroup.Item>
                        <ListGroup.Item>
                          {x.assignedTrain.number}
                        </ListGroup.Item>
                      </ListGroup>

                      <ListGroup style={{ margin: "0 1rem" }}>
                        <ListGroup.Item>Route</ListGroup.Item>
                        <ListGroup.Item>{x.route.routeName}</ListGroup.Item>
                      </ListGroup>

                      <ListGroup style={{ margin: "0 1rem" }}>
                        <ListGroup.Item>Stops</ListGroup.Item>
                        <ListGroup
                          style={{ maxWidth: "300px", overflowX: "auto" }}
                          horizontal
                        >
                          {x.route.stops
                            .slice(
                              x.route.stops
                                .map((stop) => {
                                  return stop.currStation;
                                })
                                .indexOf(startStation),
                              x.route.stops
                                .map((stop) => {
                                  return stop.currStation;
                                })
                                .indexOf(endStation) + 1
                            )
                            .map((stop) => (
                              <ListGroup.Item key={stop._id}>
                                {stop.currStation}
                              </ListGroup.Item>
                            ))}
                        </ListGroup>
                      </ListGroup>
                    </ListGroup.Item>
                  </ListGroup>
                ))
              )}
          </div>
        </Form>
      )}
    </div>
  );
}

export default create;

{
  /* <Form.Group className="mb-3">
            <Form.Label>Passengers</Form.Label>
            <Form.Control type="number" />
          </Form.Group> */
}

// {startStation && startStation}
//       <div style={{ position: "absolute", top: "100px", left: "200px" }}>
//         {newTicket && (
//           <Alert variant="success">
//             <h5>New Ticket Created</h5>
//           </Alert>
//         )}
//       </div>
//       <div className="station-selection-container">
//         <div className="start-station my-new-list">
//           {stationList && (
//             <div>
//               <h3>Start</h3>
//               <ul ref={startList}>
//                 {stationList.map((station) => (
//                   <li
//                     key={station._id}
//                     onClick={(e) => selectStation(e, station, startList)}
//                   >
//                     {station.currStation}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//         <div className="ending-station my-new-list">
//           {stationList && startStation && (
//             <div>
//               <h3>Finish</h3>
//               <ul ref={endList}>
//                 {stationList
//                   .filter((x) => x._id != startStation._id)
//                   .map((station) => (
//                     <li
//                       key={station._id}
//                       onClick={(e) => selectStation(e, station, endList)}
//                     >
//                       {station.currStation}
//                     </li>
//                   ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="route-selection-container">
//         {/* <ul className="connection-list">
//           {connections &&
//             connections.map((train) => (
//               <li key={train._id} onClick={() => setCurrConnection(train)}>
//                 <p>Train Number: {train.number}</p>
//                 <p>Route: {train.assignedRoute.routeName}</p>
//               </li>
//             ))}
//         </ul> */}
//         {/* <ul>
//           {allRoute &&
//             startStation &&
//             endStation &&
//             allRoute
//               .filter(
//                 (x) =>
//                   x.stops.includes(startStation._id) &&
//                   x.stops.includes(endStation._id)
//               )
//               .map((route) => (
//                 <li>
//                   <p>{route.routeName}</p>
//                 </li>
//               ))}
//         </ul> */}
//         <ul>
//           {allTrain &&
//             startStation &&
//             endStation &&
//             allTrain
//               .filter(
//                 (x) =>
//                   x.assignedRoute.stops.includes(startStation._id) &&
//                   x.assignedRoute.stops.includes(endStation._id)
//               )
//               .map((train) => (
//                 <li key={train._id} onClick={() => setCurrConnection(train)}>
//                   <p>{train.number}</p>
//                 </li>
//               ))}
//         </ul>
//         {currConnection && (
//           <div>
//             <p>Passenger Count</p>
//             <input
//               type="number"
//               value={passengerCount}
//               onChange={(e) => setPassengerCount(Number(e.target.value))}
//             ></input>
//             <p>Bike Count</p>
//             <input
//               type="number"
//               value={bikeCount}
//               onChange={(e) => setBikeCount(e.target.value)}
//               style={{ marginBottom: "1rem" }}
//             ></input>
//             <Dialog
//               btn={true}
//               btnText="Confirm!"
//               btnVariant="success"
//               onShow={() => addTicket()}
//               dialogHeading={
//                 ticketValid?.tickectExists
//                   ? "Ticket with exact connection exists. Do you want to create another one ?"
//                   : "Please confirm details."
//               }
//               dialogBody={
//                 myTicket && (
//                   <div>
//                     <p>Start : {myTicket?.startStation?.currStation}</p>
//                     <p>End : {myTicket?.endStation?.currStation}</p>
//                     <p>Passengers : {myTicket?.passengerCount}</p>
//                     <p>
//                       Connection : {myTicket?.conn?.assignedRoute?.routeName}
//                     </p>
//                   </div>
//                 )
//               }
//               onConfirm={() => confirmTicket()}
//               onCancelVar={ticketValid?.tickectExists && "danger"}
//             />
//           </div>
//         )}
//       </div>
