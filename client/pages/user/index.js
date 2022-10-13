import React from "react";
import UserRoute from "../../components/routes/UserRoute";
import { useSelector } from "react-redux";
function index() {
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  return (
    <UserRoute>
      <h1>USER PAGE</h1>
      <div>
        <h2>Active Tickets</h2>
        <table>
          <tbody>
            <tr>
              <td>Ticket ID</td>
              <td>Ticket ID</td>
            </tr>
            <tr>
              <td>Destination</td>
              <td>Destination</td>
            </tr>
            <tr>
              <td>Seats</td>
              <td>Seats</td>
            </tr>
            <tr>
              <td>Bikes</td>
              <td>Bikes</td>
            </tr>
            <tr>
              <td>departure time</td>
              <td>departure time</td>
            </tr>
            <tr>
              <td>arrival time</td>
              <td>arrival time</td>
            </tr>
          </tbody>
        </table>
        <h3>Details CTA</h3>
      </div>
      <h2>UserInfo</h2>
      <div>
        <table>
          <tbody>
            <tr>
              <td>Some Info</td>
            </tr>
          </tbody>
        </table>
      </div>
    </UserRoute>
  );
}

export default index;
