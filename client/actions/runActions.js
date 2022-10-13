import {
  RUN_CREATE_REQUEST,
  RUN_CREATE_SUCCESS,
  RUN_CREATE_FAILED,
  RUN_GET_ALL_REQUEST,
  RUN_GET_ALL_SUCCESS,
  RUN_GET_ALL_FAILED,
  RUN_GET_ONE_REQUEST,
  RUN_GET_ONE_SUCCESS,
  RUN_GET_ONE_FAILED,
  RUN_UPDATE_REQUEST,
  RUN_UPDATE_SUCCESS,
  RUN_UPDATE_FAILED,
  RUN_REMOVE_REQUEST,
  RUN_REMOVE_SUCCESS,
  RUN_REMOVE_FAILED,
  RUN_GET_CONNECTION_REQUEST,
  RUN_GET_CONNECTION_SUCCESS,
  RUN_GET_CONNECTION_FAILED,
} from "../constants/runConstants";
import axios from "axios";

export const createRunAction =
  ({ route, assignedTrain, onRun, departureTime }) =>
  async (dispatch) => {
    try {
      dispatch({ type: RUN_CREATE_REQUEST });
      const { data } = await axios.post("/api/run/create", {
        route,
        assignedTrain,
        onRun,
        departureTime,
      });
      dispatch({ type: RUN_CREATE_SUCCESS, payload: data });
    } catch (err) {
      console.log(err);
      dispatch({ type: RUN_CREATE_FAILED, payload: err.response.data });
    }
  };

export const getAllRunAction = () => async (dispatch) => {
  try {
    dispatch({ type: RUN_GET_ALL_REQUEST });
    const { data } = await axios.get("/api/run/getall");
    dispatch({ type: RUN_GET_ALL_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: RUN_GET_ALL_FAILED, payload: err.response.data });
  }
};
export const removeRunAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: RUN_REMOVE_REQUEST });
    const { data } = await axios.delete(`/api/run/remove/${_id}`);
    dispatch({ type: RUN_REMOVE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: RUN_REMOVE_FAILED, payload: err.response.data });
  }
};

export const updateRunAction =
  ({ id, route, assignedTrain, onRun, departureTime }) =>
  async (dispatch) => {
    try {
      dispatch({ type: RUN_UPDATE_REQUEST });
      const { data } = await axios.patch(`/api/run/update/${id}`, {
        route,
        assignedTrain,
        onRun,
        departureTime,
      });
      dispatch({ type: RUN_UPDATE_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: RUN_UPDATE_FAILED, payload: err.response.data });
    }
  };

export const getOneRunAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: RUN_GET_ONE_REQUEST });
    const { data } = await axios.get(`/api/run/get/${_id}`);

    dispatch({ type: RUN_GET_ONE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: RUN_GET_ONE_FAILED, payload: err.response.data });
  }
};


export const getConnectionRunAction =
  (startStation, endStation) => async (dispatch) => {
    try {
      dispatch({ type: RUN_GET_CONNECTION_REQUEST });
      const { data } = await axios.get(
        `/api/run/getconnection/${startStation}/${endStation}`
      );

      dispatch({ type: RUN_GET_CONNECTION_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: RUN_GET_CONNECTION_FAILED, payload: err.response.data });
    }
  };
