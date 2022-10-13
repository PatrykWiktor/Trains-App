import {
  ROUTE_CREATE_REQUEST,
  ROUTE_CREATE_SUCCESS,
  ROUTE_CREATE_FAILED,
  ROUTE_CREATE_RESET,
  ROUTE_GET_ALL_REQUEST,
  ROUTE_GET_ALL_SUCCESS,
  ROUTE_GET_ALL_FAILED,
  ROUTE_GET_ONE_REQUEST,
  ROUTE_GET_ONE_SUCCESS,
  ROUTE_GET_ONE_FAILED,
  ROUTE_UPDATE_REQUEST,
  ROUTE_UPDATE_SUCCESS,
  ROUTE_UPDATE_FAILED,
  ROUTE_UPDATE_RESET,
  ROUTE_REMOVE_REQUEST,
  ROUTE_REMOVE_SUCCESS,
  ROUTE_REMOVE_FAILED,
  ROUTE_REMOVE_RESET,
  ROUTE_GET_CONNECTION_REQUEST,
  ROUTE_GET_CONNECTION_SUCCESS,
  ROUTE_GET_CONNECTION_ERROR,
  ROUTE_GET_CONNECTION_RESET,
} from "../constants/routeConstants";

export const routeReducer = (
  state = {
    createRoute: [],
    allRoute: [],
    getOne: [],
    update: [],
    remove: [],
    getConnection: [],
  },
  action
) => {
  switch (action.type) {
    case ROUTE_GET_CONNECTION_REQUEST:
      return {
        ...state,
        getConnection: { loading: true },
      };
    case ROUTE_GET_CONNECTION_SUCCESS:
      return {
        ...state,
        getConnection: { loading: false, data: action.payload },
      };
    case ROUTE_GET_CONNECTION_ERROR:
      return {
        ...state,
        getConnection: { loading: false, error: action.payload },
      };
    case ROUTE_GET_CONNECTION_RESET:
      return {
        ...state,
        getConnection: {},
      };
    case ROUTE_CREATE_REQUEST:
      return {
        ...state,
        createRoute: { loading: true },
      };
    case ROUTE_CREATE_SUCCESS:
      return {
        ...state,
        createRoute: { loading: false, data: action.payload },
      };
    case ROUTE_CREATE_FAILED:
      return {
        ...state,
        createRoute: { loading: false, error: action.payload },
      };
    case ROUTE_CREATE_RESET:
      return {
        ...state,
        createRoute: { loading: false },
      };
    case ROUTE_GET_ALL_REQUEST:
      return {
        ...state,
        allRoute: { loading: true },
      };
    case ROUTE_GET_ALL_SUCCESS:
      return {
        ...state,
        allRoute: { loading: false, data: action.payload },
      };
    case ROUTE_GET_ALL_FAILED:
      return {
        ...state,
        allRoute: { loading: false, error: action.payload },
      };
    case ROUTE_REMOVE_REQUEST:
      return {
        ...state,
        remove: { loading: true },
      };
    case ROUTE_REMOVE_SUCCESS:
      return {
        ...state,
        remove: { loading: false, data: action.payload },
      };
    case ROUTE_REMOVE_FAILED:
      return {
        ...state,
        remove: { loading: false, error: action.payload },
      };
    case ROUTE_REMOVE_RESET:
      return {
        ...state,
        remove: { loading: false },
      };
    case ROUTE_GET_ONE_REQUEST:
      return {
        ...state,
        getOne: { loading: true },
      };
    case ROUTE_GET_ONE_SUCCESS:
      return {
        ...state,
        getOne: { loading: true, data: action.payload },
      };
    case ROUTE_GET_ONE_FAILED:
      return {
        ...state,
        getOne: { loading: false, error: action.payload },
      };
    case ROUTE_UPDATE_REQUEST:
      return {
        ...state,
        update: { loading: true },
      };
    case ROUTE_UPDATE_SUCCESS:
      return {
        ...state,
        update: { loading: false, data: action.payload },
      };
    case ROUTE_UPDATE_FAILED:
      return {
        ...state,
        update: { loading: false, error: action.payload },
      };
    case ROUTE_UPDATE_RESET:
      return {
        ...state,
        update: { loading: false },
      };
    default:
      return state;
  }
};
