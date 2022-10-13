import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../actions/userActions";
import { useRouter } from "next/router";
import Loader from '../components/Loader'
function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginAction(email, password));
  };
  useEffect(() => {
    if (userInfo){
      router.push('/')
    }
  }, [userInfo])
  return (
    <div>
      <h1>Login</h1>
      {error && error}
      {loading && <Loader/>}
      
      <form onSubmit={handleSubmit}>
        <h4>Email</h4>
        <input onChange={(e) => setEmail(e.target.value)}></input>
        <h4>Password</h4>
        <input onChange={(e) => setPassword(e.target.value)}></input>
        <br />
        <button type="submit" disabled={!email || !password}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default login;
