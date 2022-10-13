import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRunAction } from "../../actions/runActions";
import { Card, ListGroup } from "react-bootstrap";
import { useRouter } from "next/router";
function RunsCounter() {
  const CURR_RUNS_COL = "#e33434";
  const PLANNED_RUNS_COL = "#e3ad5c";

  const router = useRouter();
  const dispatch = useDispatch();

  const [currRuns, setCurrRuns] = useState(null);
  const [plannedRuns, setPlannedRuns] = useState(null);

  const [currRunsPercentage, setCrrRunsPercentage] = useState(null);
  const runsList = useSelector((state) => state.run.all);
  const { data: runsListData, loading: runsListLoading } = runsList;

  useEffect(() => {
    if (!runsListData) dispatch(getAllRunAction());

    if (!currRuns && runsListData) {
      setCurrRuns(
        runsListData.filter((x) => {
          return x.onRun == true;
        }).length
      );
    }
    if (!plannedRuns && runsListData) {
      setPlannedRuns(
        runsListData &&
          runsListData.filter((x) => {
            return x.onRun == false;
          }).length
      );
    }
  }, [runsListData]);
  // count runs percentage for bar
  useEffect(() => {
    const totalRuns = currRuns + plannedRuns;
    const percentOfRunsIsCurrentRun = (currRuns / totalRuns) * 100;
    setCrrRunsPercentage(String(percentOfRunsIsCurrentRun));
  }, [currRuns, plannedRuns]);
  return (
    <Card
      style={{ display: "flex", flexDirection: "column", maxWidth: "400px",minWidth:'350px'  }}
    >
      <Card.Header>
        <Card
          id="data"
          style={{
            width: "80%",
            margin: "auto",
          }}
        >
          <Card.Header
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <p>Runs</p>

            <a
              onClick={() => router.push("/run")}
              style={{ cursor: "pointer" }}
            >
              {">"}
            </a>
          </Card.Header>

          <Card.Body>
            <ListGroup horizontal>
              <ListGroup.Item style={{ width: "70%" }}>Current</ListGroup.Item>
              <ListGroup.Item>{currRuns}</ListGroup.Item>
            </ListGroup>
            <ListGroup horizontal>
              <ListGroup.Item style={{ width: "70%" }}>Planned</ListGroup.Item>
              <ListGroup.Item>{plannedRuns}</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Card.Header>
     <Card.Body style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
      <div
        id="bar"
        style={{
          marginBottom: "1em",
          width: "100%",
          height: "12px",
          display: "flex",
        }}
      >
        <div
          style={{
            backgroundColor: CURR_RUNS_COL,
            width: `${currRunsPercentage}%`,
            height: "100%",
            borderTopLeftRadius: ".3rem",
            borderBottomLeftRadius: ".3rem",
          }}
        ></div>
        <div
          style={{
            backgroundColor: PLANNED_RUNS_COL,
            width: `${100 - Number(currRunsPercentage)}%`,
            height: "100%",
            borderTopRightRadius: ".3rem",
            borderBottomRightRadius: ".3rem",
          }}
        ></div>
      </div>
      <div
        id="legend"
        style={{
          width: "90%",
          height: "auto",
          display: "flex",
          marginBottom: "1em",
        }}
      >
        <div
          style={{
            width: `${currRunsPercentage}%`,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              height: "10px",
              width: "10px",
              backgroundColor: CURR_RUNS_COL,
              marginRight: "0.2em",
              borderRadius: ".3rem",
            }}
          ></div>
          <p>Current</p>
        </div>
        <div
          style={{
            width: `${100 - Number(currRunsPercentage)}%`,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              height: "10px",
              width: "10px",
              backgroundColor: PLANNED_RUNS_COL,
              marginRight: "0.2em",
              borderRadius: ".3rem",
            }}
          ></div>
          <p>Planned</p>
        </div>
      </div>
      </Card.Body>
    </Card>
  );
}

export default RunsCounter;
