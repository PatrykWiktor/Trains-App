import {
  STATION_CREATE_REQUEST,
  STATION_CREATE_SUCCESS,
  STATION_CREATE_FAILED,
  STATION_CREATE_RESET,
  STATION_GET_ALL_REQUEST,
  STATION_GET_ALL_SUCCESS,
  STATION_GET_ALL_FAILED,
  STATION_GET_ONE_REQUEST,
  STATION_GET_ONE_SUCCESS,
  STATION_GET_ONE_FAILED,
  STATION_UPDATE_REQUEST,
  STATION_UPDATE_SUCCESS,
  STATION_UPDATE_FAILED,
  STATION_UPDATE_RESET,
  STATION_REMOVE_REQUEST,
  STATION_REMOVE_SUCCESS,
  STATION_REMOVE_FAILED,
  STATION_REMOVE_RESET,
} from "../constants/stationConstants";

export const stationReducer = (
  state = { createStation: [], allStations: [], getOne: [], update: [], remove:[] },
  action
) => {
  switch (action.type) {
    case STATION_CREATE_REQUEST:
      return {
        ...state,
        createStation: { loading: true },
      };
    case STATION_CREATE_SUCCESS:
      return {
        ...state,
        createStation: { loading: false, data: action.payload },
      };
    case STATION_CREATE_FAILED:
      return {
        ...state,
        createStation: { loading: false, error: action.payload },
      };
    case STATION_CREATE_RESET:
      return {
        ...state,
        createStation: { loading: false },
      };
    case STATION_GET_ALL_REQUEST:
      return {
        ...state,
        allStations: { loading: true },
      };

    case STATION_GET_ALL_SUCCESS:
      return {
        ...state,
        allStations: { loading: false, data: action.payload },
      };

    case STATION_GET_ALL_FAILED:
      return {
        ...state,
        allStations: { loading: false, error: action.payload },
      };
    case STATION_GET_ONE_REQUEST:
      return {
        ...state,
        getOne: { loading: true },
      };
    case STATION_GET_ONE_SUCCESS:
      return {
        ...state,
        getOne: { loading: true, data: action.payload },
      };
    case STATION_GET_ONE_FAILED:
      return {
        ...state,
        getOne: { loading: false, error: action.payload },
      };
    case STATION_UPDATE_REQUEST:
      return {
        ...state,
        update: { loading: true },
      };
    case STATION_UPDATE_SUCCESS:
      return {
        ...state,
        update: { loading: false, data: action.payload },
      };
    case STATION_UPDATE_FAILED:
      return {
        ...state,
        update: { loading: false, error: action.payload },
      };
    case STATION_UPDATE_RESET:
      return {
        ...state,
        update: { loading: false },
      };
    case STATION_REMOVE_REQUEST:
      return {
        ...state,
        remove: { loading: true },
      };
    case STATION_REMOVE_SUCCESS:
      return {
        ...state,
        remove: { loading: false, data: action.payload },
      };
    case STATION_REMOVE_FAILED:
      return {
        ...state,
        remove: { loading: false, error: action.payload },
      };
    case STATION_REMOVE_RESET:
      return {
        ...state,
        remove: { loading: false },
      };
    default:
      return state;
  }
};
