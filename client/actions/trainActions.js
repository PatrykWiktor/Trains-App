import {
  TRAIN_CREATE_REQUEST,
  TRAIN_CREATE_SUCCESS,
  TRAIN_CREATE_FAILED,
  TRAIN_GET_ALL_REQUEST,
  TRAIN_GET_ALL_SUCCESS,
  TRAIN_GET_ALL_FAILED,
  TRAIN_GET_ONE_REQUEST,
  TRAIN_GET_ONE_SUCCESS,
  TRAIN_GET_ONE_FAILED,
  TRAIN_UPDATE_REQUEST,
  TRAIN_UPDATE_SUCCESS,
  TRAIN_UPDATE_FAILED,
  TRAIN_REMOVE_REQUEST,
  TRAIN_REMOVE_SUCCESS,
  TRAIN_REMOVE_FAILED,
  TRAIN_CONTROL_CREATE_REQUEST,
  TRAIN_CONTROL_CREATE_SUCCESS,
  TRAIN_CONTROL_CREATE_FAILED,
  TRAIN_CONTROL_GET_ALL_REQUEST,
  TRAIN_CONTROL_GET_ALL_SUCCESS,
  TRAIN_CONTROL_GET_ALL_FAILED,
  TRAIN_CONTROL_REMOVE_REQUEST,
  TRAIN_CONTROL_REMOVE_SUCCESS,
  TRAIN_CONTROL_REMOVE_FAILED,
  TRAIN_CONTROL_UPDATE_REQUEST,
  TRAIN_CONTROL_UPDATE_SUCCESS,
  TRAIN_CONTROL_UPDATE_FAILED,
} from "../constants/trainConstants";
import axios from "axios";

export const createTrainAction =
  ({ number, cars, assignedRoute }) =>
  async (dispatch) => {
    try {
      dispatch({ type: TRAIN_CREATE_REQUEST });
      const { data } = await axios.post("/api/train/create", {
        number,
        cars,
        assignedRoute,
      });
      dispatch({ type: TRAIN_CREATE_SUCCESS, payload: data });
    } catch (err) {
      console.log(err);
      dispatch({ type: TRAIN_CREATE_FAILED, payload: err.response.data });
    }
  };

export const getAllTrainAction = () => async (dispatch) => {
  try {
    dispatch({ type: TRAIN_GET_ALL_REQUEST });
    const { data } = await axios.get("/api/train/getall");
    dispatch({ type: TRAIN_GET_ALL_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: TRAIN_GET_ALL_FAILED, payload: err.response.data });
  }
};
export const removeTrainAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: TRAIN_REMOVE_REQUEST });
    const { data } = await axios.delete(`/api/train/remove/${_id}`);
    dispatch({ type: TRAIN_REMOVE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: TRAIN_REMOVE_FAILED, payload: err.response.data });
  }
};

export const updateTrainAction =
  ({ id, number, cars, assignedRoute }) =>
  async (dispatch) => {
    try {
      dispatch({ type: TRAIN_UPDATE_REQUEST });
      const { data } = await axios.patch(`/api/train/update/${id}`, {
        number,
        cars,
        assignedRoute,
      });
      dispatch({ type: TRAIN_UPDATE_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: TRAIN_UPDATE_FAILED, payload: err.response.data });
    }
  };

export const getOneTrainAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: TRAIN_GET_ONE_REQUEST });
    const { data } = await axios.get(`/api/train/get/${_id}`);
    if (data == null) throw `train with id of ${_id} does not exist`;
    dispatch({ type: TRAIN_GET_ONE_SUCCESS, payload: data });
  } catch (err) {
    if (err.response) {
      dispatch({ type: TRAIN_GET_ONE_FAILED, payload: err.response.data });
    } else {
      dispatch({ type: TRAIN_GET_ONE_FAILED, payload: err });
    }
  }
};
//////////////////////
export const removeTrainControlAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: TRAIN_CONTROL_REMOVE_REQUEST });
    const { data } = await axios.delete(`/api/traincontrol/remove/${_id}`);
    dispatch({ type: TRAIN_CONTROL_REMOVE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: TRAIN_CONTROL_REMOVE_FAILED, payload: err.response.data });
  }
};
export const createTrainControlAction =
  ({ number, cars }) =>
  async (dispatch) => {
    try {
      dispatch({ type: TRAIN_CONTROL_CREATE_REQUEST });
      const { data } = await axios.post("/api/traincontrol/create", {
        number,
        cars,
      });
      dispatch({ type: TRAIN_CONTROL_CREATE_SUCCESS, payload: data });
    } catch (err) {
      console.log(err);
      dispatch({
        type: TRAIN_CONTROL_CREATE_FAILED,
        payload: err.response.data,
      });
    }
  };
export const getAllTrainControlAction = () => async (dispatch) => {
  try {
    dispatch({ type: TRAIN_CONTROL_GET_ALL_REQUEST });
    const { data } = await axios.get("/api/traincontrol/getall");
    dispatch({ type: TRAIN_CONTROL_GET_ALL_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: TRAIN_CONTROL_GET_ALL_FAILED,
      payload: err.response.data,
    });
  }
};
export const updateTrainControlAction =
  ({ id, number, cars }) =>
  async (dispatch) => {
    try {
      dispatch({ type: TRAIN_CONTROL_UPDATE_REQUEST });
      const { data } = await axios.patch(`/api/traincontrol/update/${id}`, {
        number,
        cars,
      });
      dispatch({ type: TRAIN_CONTROL_UPDATE_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: TRAIN_CONTROL_UPDATE_FAILED, payload: err.response.data });
    }
  };