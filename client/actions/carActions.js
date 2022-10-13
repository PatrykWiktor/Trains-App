import {
  CAR_CREATE_REQUEST,
  CAR_CREATE_SUCCESS,
  CAR_CREATE_FAILED,
  CAR_GET_ALL_REQUEST,
  CAR_GET_ALL_SUCCESS,
  CAR_GET_ALL_FAILED,
  CAR_GET_ONE_REQUEST,
  CAR_GET_ONE_SUCCESS,
  CAR_GET_ONE_FAILED,
  CAR_UPDATE_REQUEST,
  CAR_UPDATE_SUCCESS,
  CAR_UPDATE_FAILED,
  CAR_REMOVE_REQUEST,
  CAR_REMOVE_SUCCESS,
  CAR_REMOVE_FAILED,
} from "../constants/carConstants";
import axios from "axios";

export const createCarAction =
  ({ type, number, assignedTrain }) =>
  async (dispatch) => {
    try {
      dispatch({ type: CAR_CREATE_REQUEST });
      const { data } = await axios.post("/api/car/create", {
        type,
        number,
        assignedTrain,
      });
      dispatch({ type: CAR_CREATE_SUCCESS, payload: data });
    } catch (err) {
      console.log(err);
      dispatch({ type: CAR_CREATE_FAILED, payload: err.response.data });
    }
  };

export const getAllCarAction = () => async (dispatch) => {
  try {
    dispatch({ type: CAR_GET_ALL_REQUEST });
    const { data } = await axios.get("/api/car/getall");
    dispatch({ type: CAR_GET_ALL_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: CAR_GET_ALL_FAILED, payload: err.response.data });
  }
};
export const removeCarAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: CAR_REMOVE_REQUEST });
    const { data } = await axios.delete(`/api/car/remove/${_id}`);
    dispatch({ type: CAR_REMOVE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: CAR_REMOVE_FAILED, payload: err.response.data });
  }
};

export const updateCarAction =
  ({ id, type, number, assignedTrain, seats }) =>
  async (dispatch) => {
    try {
      dispatch({ type: CAR_UPDATE_REQUEST });
      const { data } = await axios.patch(`/api/car/update/${id}`, {
        type,
        number,
        assignedTrain,
        seats,
      });
      dispatch({ type: CAR_UPDATE_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: CAR_UPDATE_FAILED, payload: err.response.data });
    }
  };

export const getOneCarAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: CAR_GET_ONE_REQUEST });

    const { data } = await axios.get(`/api/car/get/${_id}`);

    dispatch({ type: CAR_GET_ONE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: CAR_GET_ONE_FAILED, payload: err.response.data });
  }
};
