import {
  TRAIN_CREATE_REQUEST,
  TRAIN_CREATE_SUCCESS,
  TRAIN_CREATE_FAILED,
  TRAIN_CREATE_RESET,
  TRAIN_GET_ALL_REQUEST,
  TRAIN_GET_ALL_SUCCESS,
  TRAIN_GET_ALL_FAILED,
  TRAIN_GET_ONE_REQUEST,
  TRAIN_GET_ONE_SUCCESS,
  TRAIN_GET_ONE_FAILED,
  TRAIN_UPDATE_REQUEST,
  TRAIN_UPDATE_SUCCESS,
  TRAIN_UPDATE_FAILED,
  TRAIN_UPDATE_RESET,
  TRAIN_REMOVE_REQUEST,
  TRAIN_REMOVE_SUCCESS,
  TRAIN_REMOVE_FAILED,
  TRAIN_REMOVE_RESET,
  TRAIN_CONTROL_CREATE_REQUEST,
  TRAIN_CONTROL_CREATE_SUCCESS,
  TRAIN_CONTROL_CREATE_FAILED,
  TRAIN_CONTROL_REMOVE_REQUEST,
  TRAIN_CONTROL_REMOVE_SUCCESS,
  TRAIN_CONTROL_REMOVE_FAILED,
  TRAIN_CONTROL_GET_ALL_REQUEST,
  TRAIN_CONTROL_GET_ALL_SUCCESS,
  TRAIN_CONTROL_GET_ALL_FAILED,
  TRAIN_CONTROL_UPDATE_REQUEST,
  TRAIN_CONTROL_UPDATE_SUCCESS,
  TRAIN_CONTROL_UPDATE_FAILED,
} from "../constants/trainConstants";

export const trainReducer = (
  state = {
    create: [],
    all: [],
    getOne: [],
    update: [],
    remove: [],
    controlCreate: [],
    controlAll: [],
    controlUpdate:[],
  },
  action
) => {
  switch (action.type) {
    case TRAIN_CONTROL_CREATE_REQUEST:
      return {
        ...state,
        controlCreate: { loading: true },
      };
    case TRAIN_CONTROL_CREATE_SUCCESS:
      return {
        ...state,
        controlCreate: { loading: false, data: action.payload },
      };
    case TRAIN_CONTROL_CREATE_FAILED:
      return {
        ...state,
        controlCreate: { loading: false, error: action.payload },
      };
    case TRAIN_CONTROL_REMOVE_REQUEST:
      return {
        ...state,
        controlRemove: { loading: true },
      };
    case TRAIN_CONTROL_REMOVE_SUCCESS:
      return {
        ...state,
        controlRemove: { loading: false, data: action.payload },
      };
    case TRAIN_CONTROL_REMOVE_FAILED:
      return {
        ...state,
        controlRemove: { loading: false, error: action.payload },
      };

    case TRAIN_CONTROL_GET_ALL_REQUEST:
      return {
        ...state,
        controlAll: { loading: true },
      };
    case TRAIN_CONTROL_GET_ALL_SUCCESS:
      return {
        ...state,
        controlAll: { loading: false, data: action.payload },
      };
    case TRAIN_CONTROL_GET_ALL_FAILED:
      return {
        ...state,
        controlAll: { loading: false, error: action.payload },
      };
    case TRAIN_CONTROL_UPDATE_REQUEST:
      return {
        ...state,
        controlUpdate: { loading: true },
      };
    case TRAIN_CONTROL_UPDATE_SUCCESS:
      return {
        ...state,
        controlUpdate: { loading: false, data: action.payload },
      };
    case TRAIN_CONTROL_UPDATE_FAILED:
      return {
        ...state,
        controlUpdate: { loading: false, error: action.payload },
      };

    case TRAIN_CREATE_REQUEST:
      return {
        ...state,
        create: { loading: true },
      };
    case TRAIN_CREATE_SUCCESS:
      return {
        ...state,
        create: { loading: false, data: action.payload },
      };
    case TRAIN_CREATE_FAILED:
      return {
        ...state,
        create: { loading: false, error: action.payload },
      };
    case TRAIN_CREATE_RESET:
      return {
        ...state,
        create: { loading: false },
      };
    case TRAIN_GET_ALL_REQUEST:
      return {
        ...state,
        all: { loading: true },
      };
    case TRAIN_GET_ALL_SUCCESS:
      return {
        ...state,
        all: { loading: false, data: action.payload },
      };
    case TRAIN_GET_ALL_FAILED:
      return {
        ...state,
        all: { loading: false, error: action.payload },
      };
    case TRAIN_REMOVE_REQUEST:
      return {
        ...state,
        remove: { loading: true },
      };
    case TRAIN_REMOVE_SUCCESS:
      return {
        ...state,
        remove: { loading: false, data: action.payload },
      };
    case TRAIN_REMOVE_FAILED:
      return {
        ...state,
        remove: { loading: false, error: action.payload },
      };
    case TRAIN_REMOVE_RESET:
      return {
        ...state,
        remove: { loading: false },
      };
    case TRAIN_GET_ONE_REQUEST:
      return {
        ...state,
        getOne: { loading: true },
      };
    case TRAIN_GET_ONE_SUCCESS:
      return {
        ...state,
        getOne: { loading: true, data: action.payload },
      };
    case TRAIN_GET_ONE_FAILED:
      return {
        ...state,
        getOne: { loading: false, error: action.payload },
      };
    case TRAIN_UPDATE_REQUEST:
      return {
        ...state,
        update: { loading: true },
      };
    case TRAIN_UPDATE_SUCCESS:
      return {
        ...state,
        update: { loading: false, data: action.payload },
      };
    case TRAIN_UPDATE_FAILED:
      return {
        ...state,
        update: { loading: false, error: action.payload },
      };
    case TRAIN_UPDATE_RESET:
      return {
        ...state,
        update: { loading: false },
      };
    default:
      return state;
  }
};
