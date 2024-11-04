import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import CustomRouter from "./CustomRouter.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <CustomRouter />
        <ToastContainer />
    </Provider>
);
