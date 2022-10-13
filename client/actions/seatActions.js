import {
  SEAT_CREATE_REQUEST,
  SEAT_CREATE_SUCCESS,
  SEAT_CREATE_FAILED,
  SEAT_GET_ALL_REQUEST,
  SEAT_GET_ALL_SUCCESS,
  SEAT_GET_ALL_FAILED,
  SEAT_GET_ONE_REQUEST,
  SEAT_GET_ONE_SUCCESS,
  SEAT_GET_ONE_FAILED,
  SEAT_GET_TAKEN_REQUEST,
  SEAT_GET_TAKEN_SUCCESS,
  SEAT_GET_TAKEN_FAILED,
  SEAT_UPDATE_REQUEST,
  SEAT_UPDATE_SUCCESS,
  SEAT_UPDATE_FAILED,
  SEAT_REMOVE_REQUEST,
  SEAT_REMOVE_SUCCESS,
  SEAT_REMOVE_FAILED,
} from "../constants/seatConstants";
import axios from "axios";

export const getTakenSeatAction = () => async (dispatch) => {
  try {
    dispatch({ type: SEAT_GET_TAKEN_REQUEST });
    const { data } = await axios.get("/api/seat/gettaken");
    dispatch({ type: SEAT_GET_TAKEN_SUCCESS, payload: data });
  } catch (err) {
    console.log(err);
    dispatch({ type: SEAT_GET_TAKEN_FAILED, payload: err.response.data });
  }
};

export const createSeatAction =
  ({ assignedCar }) =>
  async (dispatch) => {
    try {
      dispatch({ type: SEAT_CREATE_REQUEST });
      const { data } = await axios.post("/api/seat/create", {
        assignedCar,
      });
      dispatch({ type: SEAT_CREATE_SUCCESS, payload: data });
    } catch (err) {
      console.log(err);
      dispatch({ type: SEAT_CREATE_FAILED, payload: err.response.data });
    }
  };

export const getAllSeatAction = () => async (dispatch) => {
  try {
    dispatch({ type: SEAT_GET_ALL_REQUEST });
    const { data } = await axios.get("/api/seat/getall");
    dispatch({ type: SEAT_GET_ALL_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: SEAT_GET_ALL_FAILED, payload: err.response.data });
  }
};

export const updateSeatAction =
  ({ number, position, occupied, assignedCar }) =>
  async (dispatch) => {
    try {
      dispatch({ type: SEAT_UPDATE_REQUEST });
      const { data } = await axios.patch(`/api/seat/update/${id}`, {
        number,
        position,
        occupied,
        assignedCar,
      });
      dispatch({ type: SEAT_UPDATE_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: SEAT_UPDATE_FAILED, payload: err.response.data });
    }
  };

export const removeSeatAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: SEAT_REMOVE_REQUEST });
    const { data } = await axios.delete(`/api/seat/remove/${_id}`);
    dispatch({ type: SEAT_REMOVE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: SEAT_REMOVE_FAILED, payload: err.response.data });
  }
};
