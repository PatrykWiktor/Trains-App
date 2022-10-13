import {
  STATION_CREATE_REQUEST,
  STATION_CREATE_SUCCESS,
  STATION_CREATE_FAILED,
  STATION_GET_ALL_REQUEST,
  STATION_GET_ALL_SUCCESS,
  STATION_GET_ALL_FAILED,
  STATION_GET_ONE_REQUEST,
  STATION_GET_ONE_SUCCESS,
  STATION_GET_ONE_FAILED,
  STATION_GET_ALL_CONN_REQUEST,
  STATION_GET_ALL_CONN_SUCCESS,
  STATION_GET_ALL_CONN_FAILED,
  STATION_UPDATE_REQUEST,
  STATION_UPDATE_SUCCESS,
  STATION_UPDATE_FAILED,
  STATION_REMOVE_REQUEST,
  STATION_REMOVE_SUCCESS,
  STATION_REMOVE_FAILED,
} from "../constants/stationConstants";
import axios from "axios";

export const createStationAction =
  ({ currStation, prevStations, nextStations }) =>
  async (dispatch) => {
    try {
      dispatch({ type: STATION_CREATE_REQUEST });
      const { data } = await axios.post("/api/station/create", {
        currStation,
        prevStations,
        nextStations,
      });
      dispatch({ type: STATION_CREATE_SUCCESS, payload: data });
    } catch (err) {
      console.log(err);
      dispatch({ type: STATION_CREATE_FAILED, payload: err.response.data });
    }
  };

export const getAllStationAction = () => async (dispatch) => {
  try {
    dispatch({ type: STATION_GET_ALL_REQUEST });
    const { data } = await axios.get("/api/station/getall");
    dispatch({ type: STATION_GET_ALL_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: STATION_GET_ALL_FAILED, payload: err.response.data });
  }
};
export const getAllConn = () => async (dispatch) => {
  try {
    dispatch({ type: STATION_GET_ALL_CONN_REQUEST });
    const { data } = await axios.get("/api/station/getconnections");
    dispatch({ type: STATION_GET_ALL_CONN_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: STATION_GET_ALL_CONN_FAILED, payload: err.response.data });
  }
};


export const updateStationAction =
  ({ id, currStation, prevStations, nextStations }) =>
  async (dispatch) => {
    try {
      dispatch({ type: STATION_UPDATE_REQUEST });
      const { data } = await axios.patch(`/api/station/update/${id}`, {
        currStation,
        prevStations,
        nextStations,
      });
      dispatch({ type: STATION_UPDATE_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: STATION_UPDATE_FAILED, payload: err.response.data });
    }
  };

export const getOneStationAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: STATION_GET_ONE_REQUEST });
    const { data } = await axios.get(`/api/station/get/${_id}`);

    dispatch({ type: STATION_GET_ONE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: STATION_GET_ONE_FAILED, payload: err.response.data });
  }
};

export const removeStationAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: STATION_REMOVE_REQUEST });
    const { data } = await axios.delete(`/api/station/remove/${_id}`);
    dispatch({ type: STATION_REMOVE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: STATION_REMOVE_FAILED, payload: err.response.data });
  }
};
