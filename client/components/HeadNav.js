import React from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logoutAction } from "../actions/userActions";
function HeadNav() {
  const dispatch = useDispatch();
  return (
    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
      <Link href="/login">
        <a>Login</a>
      </Link>
      <Link href="/register">
        <a>Register</a>
      </Link>
      <button onClick={(e) => dispatch(logoutAction())} >LOGOUT</button>
    </nav>
  );
}

export default HeadNav;
