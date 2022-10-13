import {
  ROUTE_CREATE_REQUEST,
  ROUTE_CREATE_SUCCESS,
  ROUTE_CREATE_FAILED,
  ROUTE_GET_ALL_REQUEST,
  ROUTE_GET_ALL_SUCCESS,
  ROUTE_GET_ALL_FAILED,
  ROUTE_GET_ONE_REQUEST,
  ROUTE_GET_ONE_SUCCESS,
  ROUTE_GET_ONE_FAILED,
  ROUTE_UPDATE_REQUEST,
  ROUTE_UPDATE_SUCCESS,
  ROUTE_UPDATE_FAILED,
  ROUTE_REMOVE_REQUEST,
  ROUTE_REMOVE_SUCCESS,
  ROUTE_REMOVE_FAILED,
  ROUTE_GET_CONNECTION_REQUEST,
  ROUTE_GET_CONNECTION_SUCCESS,
  ROUTE_GET_CONNECTION_ERROR,
} from "../constants/routeConstants";
import axios from "axios";

export const createRouteAction =
  ({ routeName, startStation, endStation, stops }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ROUTE_CREATE_REQUEST });
      const { data } = await axios.post("/api/route/create", {
        routeName,
        startStation,
        endStation,
        stops,
      });
      dispatch({ type: ROUTE_CREATE_SUCCESS, payload: data });
    } catch (err) {
      console.log(err);
      dispatch({ type: ROUTE_CREATE_FAILED, payload: err.response.data });
    }
  };

export const getAllRouteAction = () => async (dispatch) => {
  try {
    dispatch({ type: ROUTE_GET_ALL_REQUEST });
    const { data } = await axios.get("/api/route/getall");
    dispatch({ type: ROUTE_GET_ALL_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: ROUTE_GET_ALL_FAILED, payload: err.response.data });
  }
};
export const removeRouteAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: ROUTE_REMOVE_REQUEST });
    const { data } = await axios.delete(`/api/route/remove/${_id}`);
    dispatch({ type: ROUTE_REMOVE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: ROUTE_REMOVE_FAILED, payload: err.response.data });
  }
};

export const updateRouteAction =
  ({ id, routeName, startStation, endStation, stops }) =>
  async (dispatch) => {
    try {
      dispatch({ type: ROUTE_UPDATE_REQUEST });
      const { data } = await axios.patch(`/api/route/update/${id}`, {
        routeName,
        startStation,
        endStation,
        stops,
      });
      dispatch({ type: ROUTE_UPDATE_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: ROUTE_UPDATE_FAILED, payload: err.response.data });
    }
  };

export const getOneRouteAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: ROUTE_GET_ONE_REQUEST });
    const { data } = await axios.get(`/api/route/get/${_id}`);

    dispatch({ type: ROUTE_GET_ONE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: ROUTE_GET_ONE_FAILED, payload: err.response.data });
  }
};

export const getConnectionAction =
  (startStation, endStation) => async (dispatch) => {
    try {
      dispatch({ type: ROUTE_GET_CONNECTION_REQUEST });
      const { data } = await axios.get(`/api/route/getconnection/${startStation}/${endStation}`, {
        startStation,
        endStation,
      });

      dispatch({ type: ROUTE_GET_CONNECTION_SUCCESS, payload: data });
    } catch (err) {
      dispatch({
        type: ROUTE_GET_CONNECTION_ERROR,
        payload: err.response.data,
      });
    }
  };
