import {
    CAR_CREATE_REQUEST,
    CAR_CREATE_SUCCESS,
    CAR_CREATE_FAILED,
    CAR_CREATE_RESET,
    CAR_GET_ALL_REQUEST,
    CAR_GET_ALL_SUCCESS,
    CAR_GET_ALL_FAILED,
    CAR_GET_ONE_REQUEST,
    CAR_GET_ONE_SUCCESS,
    CAR_GET_ONE_FAILED,
    CAR_UPDATE_REQUEST,
    CAR_UPDATE_SUCCESS,
    CAR_UPDATE_FAILED,
    CAR_UPDATE_RESET,
    CAR_REMOVE_REQUEST,
    CAR_REMOVE_SUCCESS,
    CAR_REMOVE_FAILED,
    CAR_REMOVE_RESET,
  } from "../constants/carConstants";
  
  export const carReducer = (
    state = {
      create: [],
      all: [],
      getOne: [],
      update: [],
      remove: [],
    },
    action
  ) => {
    switch (action.type) {
      case CAR_CREATE_REQUEST:
        return {
          ...state,
          create: { loading: true },
        };
      case CAR_CREATE_SUCCESS:
        return {
          ...state,
          create: { loading: false, data: action.payload },
        };
      case CAR_CREATE_FAILED:
        return {
          ...state,
          create: { loading: false, error: action.payload },
        };
      case CAR_CREATE_RESET:
        return {
          ...state,
          create: { loading: false },
        };
      case CAR_GET_ALL_REQUEST:
        return {
          ...state,
          all: { loading: true },
        };
      case CAR_GET_ALL_SUCCESS:
        return {
          ...state,
          all: { loading: false, data: action.payload },
        };
      case CAR_GET_ALL_FAILED:
        return {
          ...state,
          all: { loading: false, error: action.payload },
        };
      case CAR_REMOVE_REQUEST:
        return {
          ...state,
          remove: { loading: true },
        };
      case CAR_REMOVE_SUCCESS:
        return {
          ...state,
          remove: { loading: false, data: action.payload },
        };
      case CAR_REMOVE_FAILED:
        return {
          ...state,
          remove: { loading: false, error: action.payload },
        };
      case CAR_REMOVE_RESET:
        return {
          ...state,
          remove: { loading: false },
        };
      case CAR_GET_ONE_REQUEST:
        return {
          ...state,
          getOne: { loading: true },
        };
      case CAR_GET_ONE_SUCCESS:
        return {
          ...state,
          getOne: { loading: true, data: action.payload },
        };
      case CAR_GET_ONE_FAILED:
        return {
          ...state,
          getOne: { loading: false, error: action.payload },
        };
      case CAR_UPDATE_REQUEST:
        return {
          ...state,
          update: { loading: true },
        };
      case CAR_UPDATE_SUCCESS:
        return {
          ...state,
          update: { loading: false, data: action.payload },
        };
      case CAR_UPDATE_FAILED:
        return {
          ...state,
          update: { loading: false, error: action.payload },
        };
      case CAR_UPDATE_RESET:
        return {
          ...state,
          update: { loading: false },
        };
      default:
        return state;
    }
  };
  