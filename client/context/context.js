import axios from "axios";
import { logoutAction } from "../actions/userActions";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import React from "react";

function Context() {
  const dispatch = useDispatch();
  const router = useRouter();
  // expired token detection
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      let res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get("/api/user/logout")
            .then((data) => {
              console.log("401 error > logout");
              dispatch(logoutAction());
              localStorage.removeItem("userInfo");
              router.push("/login");
            })
            .catch((err) => {
              console.log("axios interceptor error", err);
              reject(error);
            });
        });
      }
      return Promise.reject(error);
    }
  );
  // csrf protection
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      console.log("csrf", data);
      axios.defaults.headers["X-CSRF-Token"] = data.csrfToken;
    };
    getCsrfToken();
  }, []);
  return <div></div>;
}

export default Context;
