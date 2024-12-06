// Header.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Header = ({ handleHamburgerBtn }) => {
    return (
        <header className="sticky right-0 left-0 z-50 top-0 flex p-4 justify-between bg-white min-h-20 max-h-20 border-b border-black-opacity-20">
            <button
                className="border border-black-opacity-20 outline-none px-4 py-2 rounded"
                onClick={handleHamburgerBtn}>
                <FontAwesomeIcon icon={faBars} />
            </button>
            <div className="border h-11 w-11 rounded-full flex items-center justify-center">
                <Link to="/panel/profile" className="">
                    <FontAwesomeIcon icon={faUser} className="text-xl text-gray-700" />
                </Link>
            </div>
        </header>
    );
};

export default Header;
