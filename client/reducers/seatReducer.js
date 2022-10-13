import {
    SEAT_CREATE_REQUEST,
    SEAT_CREATE_SUCCESS,
    SEAT_CREATE_FAILED,
    SEAT_CREATE_RESET,
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
    SEAT_UPDATE_RESET,
    SEAT_REMOVE_REQUEST,
    SEAT_REMOVE_SUCCESS,
    SEAT_REMOVE_FAILED,
    SEAT_REMOVE_RESET,
  } from "../constants/seatConstants";
  
  export const seatReducer = (
    state = {
      create: [],
      all: [],
      getOne: [],
      update: [],
      remove: [],
      taken:[],
    },
    action
  ) => {
    switch (action.type) {
      case SEAT_GET_TAKEN_REQUEST:
        return{
          ...state,
          taken:{loading:true}
        }
      case SEAT_GET_TAKEN_SUCCESS:
        return{
          ...state,
          taken:{loading:false, data: action.payload }
        }
      case SEAT_GET_TAKEN_FAILED:
        return{
          ...state,
          taken:{loading:true, error: action.payload }
        }
      case SEAT_CREATE_REQUEST:
        return {
          ...state,
          create: { loading: true },
        };
      case SEAT_CREATE_SUCCESS:
        return {
          ...state,
          create: { loading: false, data: action.payload },
        };
      case SEAT_CREATE_FAILED:
        return {
          ...state,
          create: { loading: false, error: action.payload },
        };
      case SEAT_CREATE_RESET:
        return {
          ...state,
          create: { loading: false },
        };
      case SEAT_GET_ALL_REQUEST:
        return {
          ...state,
          all: { loading: true },
        };
      case SEAT_GET_ALL_SUCCESS:
        return {
          ...state,
          all: { loading: false, data: action.payload },
        };
      case SEAT_GET_ALL_FAILED:
        return {
          ...state,
          all: { loading: false, error: action.payload },
        };
      case SEAT_REMOVE_REQUEST:
        return {
          ...state,
          remove: { loading: true },
        };
      case SEAT_REMOVE_SUCCESS:
        return {
          ...state,
          remove: { loading: false, data: action.payload },
        };
      case SEAT_REMOVE_FAILED:
        return {
          ...state,
          remove: { loading: false, error: action.payload },
        };
      case SEAT_REMOVE_RESET:
        return {
          ...state,
          remove: { loading: false },
        };
      case SEAT_GET_ONE_REQUEST:
        return {
          ...state,
          getOne: { loading: true },
        };
      case SEAT_GET_ONE_SUCCESS:
        return {
          ...state,
          getOne: { loading: true, data: action.payload },
        };
      case SEAT_GET_ONE_FAILED:
        return {
          ...state,
          getOne: { loading: false, error: action.payload },
        };
      case SEAT_UPDATE_REQUEST:
        return {
          ...state,
          update: { loading: true },
        };
      case SEAT_UPDATE_SUCCESS:
        return {
          ...state,
          update: { loading: false, data: action.payload },
        };
      case SEAT_UPDATE_FAILED:
        return {
          ...state,
          update: { loading: false, error: action.payload },
        };
      case SEAT_UPDATE_RESET:
        return {
          ...state,
          update: { loading: false },
        };
      default:
        return state;
    }
  };
  