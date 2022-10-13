import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_FAIL,
  USER_LOGOUT_SUCCESS,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
} from "../constants/userConstants";
import axios from "axios";

export const loginAction = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const { data } = await axios.post("/api/user/login", {
      email: email,
      password: password,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    // Save info in local storage
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (err) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: err.response.data,
    });
  }
};
export const logoutAction = () => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGOUT_REQUEST,
    });

    const { data } = await axios.get("/api/user/logout");

    dispatch({
      type: USER_LOGOUT_SUCCESS,
      payload: data,
    });
    // remove info in local storage
    localStorage.removeItem("userInfo");
  } catch (err) {
    dispatch({
      type: USER_LOGOUT_FAIL,
      payload: err.response.data,
    });
  }
};

export const registerAction = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const { data } = await axios.post(`/api/user/register`, {
      name,
      email,
      password,
    });

    dispatch({
      type: USER_REGISTER_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: err.response.data,
    });
  }
};
