import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAction } from "../actions/userActions";
import Loader from '../components/Loader'

function register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()

  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading } = userRegister;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerAction(name,email,password))
  };
  return (
    <div>
      <h1>Register</h1>
      {error && error}
      {loading && <Loader/>}
      <form onSubmit={handleSubmit}>
        <h4>Name</h4>
        <input onChange={(e) => setName(e.target.value)}></input>
        <h4>Email</h4>
        <input onChange={(e) => setEmail(e.target.value)}></input>
        <h4>Password</h4>
        <input onChange={(e) => setPassword(e.target.value)}></input>
        <br />
        <button type="submit" disabled={!email || !password || !name}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default register;
