import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
function Clock() {
  const [clockState, setClockState] = useState();
  const [currDate, setCurrDate] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      let date = new Date();
      setClockState(date.toLocaleTimeString("PL-pl"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      style={{
        maxHeight: "200px",
        maxWidth: "150px",
        textAlign: "center",
        fontSize: "1.2em",
        fontWeight: "400",
        margin: "3em auto 3em auto ",
      }}
    >
      <Card.Header>{clockState}</Card.Header>
      <Card.Body>{currDate.toLocaleDateString("PL-pl")}</Card.Body>
    </Card>
  );
}

export default Clock;
