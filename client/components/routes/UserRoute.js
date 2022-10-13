import React, { useEffect, useState } from "react";
import axios from "axios";
import {useRouter} from 'next/router'
function UserRoute({children}) {
  const router = useRouter()
  const [userAccess, setUserAccess] = useState(false);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/current-user");
      console.log("User access", data);
      if (data.valid) setUserAccess(true);
    } catch (err) {
      console.log(err);
      setUserAccess(false)
      router.push('/login')
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return <div>
      {!userAccess ? "No user Access": 
      <>
      {children}
      </>}
  </div>;
}

export default UserRoute;
