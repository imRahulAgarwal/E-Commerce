import { Slide } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

const toastCss = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "colored",
    transition: Slide,
};

export default toastCss;
