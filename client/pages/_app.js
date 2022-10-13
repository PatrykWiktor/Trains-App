import "../styles/globals.scss";
import "../styles/three-dots.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import HeadNav from "../components/HeadNav";
import { Provider } from "react-redux";
import store from "../store";
import Context from "../context/context";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Context />
      <HeadNav />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
