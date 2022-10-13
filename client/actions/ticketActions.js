import {
  TICKET_CREATE_REQUEST,
  TICKET_CREATE_SUCCESS,
  TICKET_CREATE_FAILED,
  TICKET_VALIDATE_REQUEST,
  TICKET_VALIDATE_SUCCESS,
  TICKET_VALIDATE_FAILED,
  TICKET_GET_ALL_REQUEST,
  TICKET_GET_ALL_SUCCESS,
  TICKET_GET_ALL_FAILED,
  TICKET_GET_ONE_REQUEST,
  TICKET_GET_ONE_SUCCESS,
  TICKET_GET_ONE_FAILED,
  TICKET_UPDATE_REQUEST,
  TICKET_UPDATE_SUCCESS,
  TICKET_UPDATE_FAILED,
  TICKET_REMOVE_REQUEST,
  TICKET_REMOVE_SUCCESS,
  TICKET_REMOVE_FAILED,
} from "../constants/ticketConstants";
import axios from "axios";

export const validateTicketAction =
  ({user,startStation, endStation,passengerCount,conn }) =>
  async (dispatch) => {
    try {
      dispatch({ type: TICKET_VALIDATE_REQUEST });
      const { data } = await axios.post("/api/ticket/validate", {
        user,
        startStation,
        endStation,
        passengerCount,
        conn
      });
      dispatch({ type: TICKET_VALIDATE_SUCCESS, payload: data });
    } catch (err) {
      console.log(err);
      dispatch({ type: TICKET_VALIDATE_FAILED, payload: err.response.data });
    }
  };

export const createTicketAction =
  ({ user, seats, stops}) =>
  async (dispatch) => {
    try {
      dispatch({ type: TICKET_CREATE_REQUEST });
      const { data } = await axios.post("/api/ticket/create", { user,seats, stops});
      dispatch({ type: TICKET_CREATE_SUCCESS, payload: data });
    } catch (err) {
      console.log(err);
      dispatch({ type: TICKET_CREATE_FAILED, payload: err.response.data });
    }
  };

export const getAllTicketAction = () => async (dispatch) => {
  try {
    dispatch({ type: TICKET_GET_ALL_REQUEST });
    const { data } = await axios.get("/api/ticket/getall");
    dispatch({ type: TICKET_GET_ALL_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: TICKET_GET_ALL_FAILED, payload: err.response.data });
  }
};

export const updateStationAction =
  ({ user, startStation, endStation, seat }) =>
  async (dispatch) => {
    try {
      dispatch({ type: TICKET_UPDATE_REQUEST });
      const { data } = await axios.patch(`/api/ticket/update/${id}`, {
        user,
        startStation,
        endStation,
        seat,
      });
      dispatch({ type: TICKET_UPDATE_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: TICKET_UPDATE_FAILED, payload: err.response.data });
    }
  };

// export const getOneStationAction = (_id) => async (dispatch) => {
//   try {
//     dispatch({ type: STATION_GET_ONE_REQUEST });
//     const { data } = await axios.get(`/api/station/get/${_id}`);

//     dispatch({ type: STATION_GET_ONE_SUCCESS, payload: data });
//   } catch (err) {
//     dispatch({ type: STATION_GET_ONE_FAILED, payload: err.response.data });
//   }
// };

export const removeTicketAction = (_id) => async (dispatch) => {
  try {
    dispatch({ type: TICKET_REMOVE_REQUEST });
    const { data } = await axios.delete(`/api/ticket/remove/${_id}`);
    dispatch({ type: TICKET_REMOVE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: TICKET_REMOVE_FAILED, payload: err.response.data });
  }
};
