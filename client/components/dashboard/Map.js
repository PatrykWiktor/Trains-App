import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactFlow from "react-flow-renderer";
import { getAllStationAction } from "../../actions/stationActions";

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Input Node" },
    position: { x: 0, y: 0 },
    sourcePosition: "right",
    targetPosition: "left",
  },

  {
    id: "2",
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 250, y: 0 },
    sourcePosition: "bottom",
    targetPosition: "left",
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output Node" },
    position: { x: 250, y: 100 },
    sourcePosition: "right",
    targetPosition: "top",
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

const getStart = (stationList) => {
  const startStation = stationList.filter((x)=>{
    return x.prevStations.length == 0
  })
  return startStation
};

const createNodes =()=> {

  const node = {
    id: "1",
    type: "input",
    data: { label: "Input Node" },
    position: { x: 0, y: 0 },
    sourcePosition: "right",
    targetPosition: "left",
  }
}

function Map() {
  const dispatch = useDispatch();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const stationList = useSelector((state) => state.station.allStations);
  const { data: allStations } = stationList;
  
  useEffect(() => {
    if(allStations) return
    dispatch(getAllStationAction());
  }, []);

  useEffect(()=>{
    if(!allStations) return
    const res = getStart(allStations)

  },[allStations])

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
}

export default Map;
