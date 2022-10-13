import {
  RUN_CREATE_REQUEST,
  RUN_CREATE_SUCCESS,
  RUN_CREATE_FAILED,
  RUN_CREATE_RESET,
  RUN_GET_ALL_REQUEST,
  RUN_GET_ALL_SUCCESS,
  RUN_GET_ALL_FAILED,
  RUN_GET_ONE_REQUEST,
  RUN_GET_ONE_SUCCESS,
  RUN_GET_ONE_FAILED,
  RUN_UPDATE_REQUEST,
  RUN_UPDATE_SUCCESS,
  RUN_UPDATE_FAILED,
  RUN_UPDATE_RESET,
  RUN_REMOVE_REQUEST,
  RUN_REMOVE_SUCCESS,
  RUN_REMOVE_FAILED,
  RUN_REMOVE_RESET,
  RUN_GET_CONNECTION_REQUEST,
  RUN_GET_CONNECTION_SUCCESS,
  RUN_GET_CONNECTION_FAILED,
  RUN_GET_CONNECTION_RESET,
} from "../constants/runConstants";

export const runReducer = (
  state = {
    create: [],
    all: [],
    getOne: [],
    update: [],
    remove: [],
    getConnection: [],
  },
  action
) => {
  switch (action.type) {
    case RUN_GET_CONNECTION_REQUEST:
      return {
        ...state,
        getConnection: { loading: true },
      };
    case RUN_GET_CONNECTION_SUCCESS:
      return {
        ...state,
        getConnection: { loading: false, data: action.payload },
      };
    case RUN_GET_CONNECTION_FAILED:
      return {
        ...state,
        getConnection: { loading: false, error: action.payload },
      };
    case RUN_GET_CONNECTION_RESET:
      return {
        ...state,
        getConnection: { loading: false },
      };
    case RUN_CREATE_REQUEST:
      return {
        ...state,
        create: { loading: true },
      };
    case RUN_CREATE_SUCCESS:
      return {
        ...state,
        create: { loading: false, data: action.payload },
      };
    case RUN_CREATE_FAILED:
      return {
        ...state,
        create: { loading: false, error: action.payload },
      };
    case RUN_CREATE_RESET:
      return {
        ...state,
        create: { loading: false },
      };
    case RUN_GET_ALL_REQUEST:
      return {
        ...state,
        all: { loading: true },
      };
    case RUN_GET_ALL_SUCCESS:
      return {
        ...state,
        all: { loading: false, data: action.payload },
      };
    case RUN_GET_ALL_FAILED:
      return {
        ...state,
        all: { loading: false, error: action.payload },
      };
    case RUN_REMOVE_REQUEST:
      return {
        ...state,
        remove: { loading: true },
      };
    case RUN_REMOVE_SUCCESS:
      return {
        ...state,
        remove: { loading: false, data: action.payload },
      };
    case RUN_REMOVE_FAILED:
      return {
        ...state,
        remove: { loading: false, error: action.payload },
      };
    case RUN_REMOVE_RESET:
      return {
        ...state,
        remove: { loading: false },
      };
    case RUN_GET_ONE_REQUEST:
      return {
        ...state,
        getOne: { loading: true },
      };
    case RUN_GET_ONE_SUCCESS:
      return {
        ...state,
        getOne: { loading: true, data: action.payload },
      };
    case RUN_GET_ONE_FAILED:
      return {
        ...state,
        getOne: { loading: false, error: action.payload },
      };
    case RUN_UPDATE_REQUEST:
      return {
        ...state,
        update: { loading: true },
      };
    case RUN_UPDATE_SUCCESS:
      return {
        ...state,
        update: { loading: false, data: action.payload },
      };
    case RUN_UPDATE_FAILED:
      return {
        ...state,
        update: { loading: false, error: action.payload },
      };
    case RUN_UPDATE_RESET:
      return {
        ...state,
        update: { loading: false },
      };
    default:
      return state;
  }
};
