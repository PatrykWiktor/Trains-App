import {
    TICKET_CREATE_REQUEST,
    TICKET_CREATE_SUCCESS,
    TICKET_CREATE_FAILED,
    TICKET_CREATE_RESET,
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
    TICKET_UPDATE_RESET,
    TICKET_REMOVE_REQUEST,
    TICKET_REMOVE_SUCCESS,
    TICKET_REMOVE_FAILED,
    TICKET_REMOVE_RESET,
  } from "../constants/ticketConstants";
  
  export const ticketReducer = (
    state = { valid:[],create: [], all: [], getOne: [], update: [], remove:[] },
    action
  ) => {
    switch (action.type) {
      case TICKET_VALIDATE_REQUEST:
        return {
          ...state,
          valid: { loading: true },
        };
      case TICKET_VALIDATE_SUCCESS:
        return {
          ...state,
          valid: { loading: false, data: action.payload },
        };
      case TICKET_VALIDATE_FAILED:
        return {
          ...state,
          valid: { loading: false, error: action.payload },
        };
      case TICKET_CREATE_REQUEST:
        return {
          ...state,
          create: { loading: true },
        };
      case TICKET_CREATE_SUCCESS:
        return {
          ...state,
          create: { loading: false, data: action.payload },
        };
      case TICKET_CREATE_FAILED:
        return {
          ...state,
          create: { loading: false, error: action.payload },
        };
      case TICKET_CREATE_RESET:
        return {
          ...state,
          create: { loading: false },
        };
      case TICKET_GET_ALL_REQUEST:
        return {
          ...state,
          all: { loading: true },
        };
  
      case TICKET_GET_ALL_SUCCESS:
        return {
          ...state,
          all: { loading: false, data: action.payload },
        };
  
      case TICKET_GET_ALL_FAILED:
        return {
          ...state,
          all: { loading: false, error: action.payload },
        };
      case TICKET_GET_ONE_REQUEST:
        return {
          ...state,
          getOne: { loading: true },
        };
      case TICKET_GET_ONE_SUCCESS:
        return {
          ...state,
          getOne: { loading: true, data: action.payload },
        };
      case TICKET_GET_ONE_FAILED:
        return {
          ...state,
          getOne: { loading: false, error: action.payload },
        };
      case TICKET_UPDATE_REQUEST:
        return {
          ...state,
          update: { loading: true },
        };
      case TICKET_UPDATE_SUCCESS:
        return {
          ...state,
          update: { loading: false, data: action.payload },
        };
      case TICKET_UPDATE_FAILED:
        return {
          ...state,
          update: { loading: false, error: action.payload },
        };
      case TICKET_UPDATE_RESET:
        return {
          ...state,
          update: { loading: false },
        };
      case TICKET_REMOVE_REQUEST:
        return {
          ...state,
          remove: { loading: true },
        };
      case TICKET_REMOVE_SUCCESS:
        return {
          ...state,
          remove: { loading: false, data: action.payload },
        };
      case TICKET_REMOVE_FAILED:
        return {
          ...state,
          remove: { loading: false, error: action.payload },
        };
      case TICKET_REMOVE_RESET:
        return {
          ...state,
          remove: { loading: false },
        };
      default:
        return state;
    }
  };
  