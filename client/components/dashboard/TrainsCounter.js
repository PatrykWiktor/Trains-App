import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrainControlAction } from "../../actions/trainActions";
import { getAllRunAction } from "../../actions/runActions";
import { Card, ListGroup } from "react-bootstrap";
import { useRouter } from "next/router";
import TrainsChart from "./TrainsChart";

import Loader from "../Loader";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042"];

function TrainsCounter() {
  const dispatch = useDispatch();
  const router = useRouter();
  //
  const trainsList = useSelector((state) => state.train.controlAll);
  const { data: trainsListData, loading: trainsListLoading } = trainsList;

  useEffect(() => {
    if (!trainsListData) dispatch(getAllTrainControlAction());
  }, [trainsListData]);
  //
  const runsList = useSelector((state) => state.run.all);
  const { data: runsListData, loading: runsListLoading } = runsList;

  //TODO getAllRunAction gets dispatched twice as RunsCounter also depends on it and requests it
  useEffect(() => {
    if (!runsListData) dispatch(getAllRunAction());
  }, [runsListData]);
  // Collect Data for chart
  const [idleTrains, setIdleTrains] = useState(0);
  const [chartData, setChartData] = useState([
    {
      name: "idleTrains",
      value: 0,
    },
    {
      name: "RuningTrains",
      value: 0,
    },
  ]);
  useEffect(() => {
    if (!runsListData || !trainsListData) return;
    const trainsInRuns = runsListData.map((x) => {
      return x.assignedTrain.number;
    });

    const trains = trainsListData.map((x) => {
      return x.number;
    });
    let trainsNotOnRun = 0;
    for (let i = 0; i < trains.length; i++) {
      const train = trains[i];
      if (!trainsInRuns.includes(train)) {
        trainsNotOnRun++;
      }
    }
    setIdleTrains(trainsNotOnRun);
    // idle trains
    chartData[0].value = trainsNotOnRun;
    // total trains
    chartData[1].value = trainsListData.length - trainsNotOnRun;
    setChartData([...chartData]);
  }, [runsListData]);
  // Chart End
  return (
    <Card style={{ maxWidth: "400px",minWidth:'350px'  }}>
      <Card.Header>
        <Card style={{ maxWidth: "80%", margin: "auto" }}>
          <Card.Header
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <p>Trains</p>

            <a
              onClick={() => router.push("/train")}
              style={{ cursor: "pointer" }}
            >
              {">"}
            </a>
          </Card.Header>
          <Card.Body style={{ display: "flex", flexDirection: "column" }}>
            <ListGroup horizontal>
              <ListGroup.Item style={{ width: "70%" }}>
                Total Trains
              </ListGroup.Item>
              {trainsListLoading ? (
                <Loader />
              ) : (
                trainsListData && (
                  <ListGroup.Item>{trainsListData.length}</ListGroup.Item>
                )
              )}
            </ListGroup>
            <ListGroup horizontal>
              <ListGroup.Item style={{ width: "70%" }}>
                Idle Trains
              </ListGroup.Item>
              <ListGroup.Item>{idleTrains}</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Card.Header>
      <TrainsChart chartData={chartData} colors={COLORS} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          marginBottom: "1em",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              height: "10px",
              width: "10px",
              backgroundColor: COLORS[0],
              marginRight: "0.2em",
              borderRadius: ".3rem",
            }}
          ></div>
          <p>Idle</p>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              height: "10px",
              width: "10px",
              backgroundColor: COLORS[1],
              marginRight: "0.2em",
              borderRadius: ".3rem",
            }}
          ></div>
          <p>On Run</p>
        </div>
      </div>
    </Card>
  );
}

export default TrainsCounter;
