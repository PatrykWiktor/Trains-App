import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTakenSeatAction } from "../../actions/seatActions";
import { Card, ListGroup } from "react-bootstrap";
import { useRouter } from "next/router";

const SEATS_TAKEN_COL = "#593ccf";
const SEATS_FREE_COL = "#43a343";

function VacuityChart() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [seatsOccupied, setSeatsOccupied] = useState();
  const [seatsFree, setSeatsFree] = useState();
  const [seatsFreePercentage, setSeatsFreePercentage] = useState();

  useEffect(() => {
    dispatch(getTakenSeatAction());
  }, []);

  const seatsData = useSelector((state) => state.seat.taken.data);
  useEffect(() => {
    if (!seatsData) return;
    setSeatsOccupied(seatsData.occupied);
    setSeatsFree(seatsData.free);
  }, [seatsData]);

  useEffect(() => {
    const totalSeats = seatsFree + seatsOccupied;
    const percentOfSeatsIsFree = (seatsFree / totalSeats) * 100;
    setSeatsFreePercentage(String(percentOfSeatsIsFree));
  }, [seatsFree, seatsOccupied]);
  return (
    <Card
      style={{
        maxWidth: "400px",
        minWidth: "350px",
      }}
    >
      <Card.Header>
        <Card
          style={{
            width: "80%",
            margin: "auto",
          }}
        >
          <Card.Header
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <p>Tickets</p>

            <a onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
              {">"}
            </a>
          </Card.Header>
          <Card.Body>
            <ListGroup horizontal>
              <ListGroup.Item
                style={{
                  width: "60%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                
                <p>Available</p>
              </ListGroup.Item>
              <ListGroup.Item style={{ width: "40%" }}>
                {Number(seatsFreePercentage).toFixed(2)}%
              </ListGroup.Item>
            </ListGroup>

            <ListGroup horizontal>
              <ListGroup.Item
                style={{
                  width: "60%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                
                <p>Sold</p>
              </ListGroup.Item>
              <ListGroup.Item style={{ width: "40%" }}>
                {(100 - Number(seatsFreePercentage)).toFixed(2)}%
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Card.Header>
      <Card.Body style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
        <div
          id="bar"
          style={{
            margin: "1em",
            width: "90%",
            height: "12px",
            display: "flex",
          }}
        >
          <div
            style={{
              backgroundColor: SEATS_TAKEN_COL,
              width: `${100 - Number(seatsFreePercentage)}%`,
              
              height: "100%",
              borderTopLeftRadius: ".3rem",
              borderBottomLeftRadius: ".3rem",
            }}
          ></div>
          <div
            style={{
              backgroundColor: SEATS_FREE_COL,
              width: `${seatsFreePercentage}%`,
              height: "100%",
              borderTopRightRadius: ".3rem",
              borderBottomRightRadius: ".3rem",
            }}
          ></div>
        </div>

        <div
          id="legend"
          style={{
            width: "100%",
            height: "auto",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "10px",
                width: "10px",
                backgroundColor: SEATS_TAKEN_COL,
                marginRight: "0.2em",
                borderRadius: ".3rem",
              }}
            ></div>
            <p>Sold</p>
          </div>
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "10px",
                width: "10px",
                backgroundColor: SEATS_FREE_COL,
                marginRight: "0.2em",
                borderRadius: ".3rem",
              }}
            ></div>
            <p>Available</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default VacuityChart;
