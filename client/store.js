import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { userLoginReducer, userRegisterReducer } from "./reducers/userReducers";
import { stationReducer } from "./reducers/stationReducers";
import { routeReducer } from "./reducers/routeReducers";
import { ticketReducer } from "./reducers/ticketReducers";
import { carReducer } from "./reducers/carReducers";
import { trainReducer } from "./reducers/trainReducers";
import { seatReducer } from "./reducers/seatReducer";
import { runReducer } from "./reducers/runReducer";
const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  station: stationReducer,
  route: routeReducer,
  ticket: ticketReducer,
  car: carReducer,
  train: trainReducer,
  seat: seatReducer,
  run: runReducer,
});
let userInfoFromStorage = null;

if (typeof window !== "undefined") {
  userInfoFromStorage = localStorage.getItem("userInfo")
    ? JSON.parse(window.localStorage.getItem("userInfo"))
    : null;
}
const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
export default store;
