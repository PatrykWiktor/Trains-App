import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../components/Loader";
import Clock from "../components/dashboard/Clock";
import RunsCounter from "../components/dashboard/RunsCounter";
import TrainsCounter from "../components/dashboard/TrainsCounter";
import VacuityChart from "../components/dashboard/VacuityChart";
import Map from "../components/dashboard/Map";

function dashboard() {
  return (
  <div style={{ display: "flex", flexDirection: "column",alignItems:'stretch',minHeight:'90vh'}} >
      <Map/>
      {/* <Clock />
      <div style={{ display: "flex", flexDirection: "row",justifyContent:'space-evenly' }}>
        <RunsCounter />
        <TrainsCounter />
        <VacuityChart />
      </div> */}
    </div>
  );
}

export default dashboard;
