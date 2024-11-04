// Header.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Header = ({ handleHamburgerBtn }) => {
    return (
        <header className="sticky right-0 left-0 z-50 top-0 flex p-4 justify-between bg-white min-h-20 max-h-20 border-b border-black-opacity-20">
            <button
                className="border border-black-opacity-20 outline-none px-4 py-2 rounded"
                onClick={handleHamburgerBtn}>
                <FontAwesomeIcon icon={faBars} />
            </button>
            <div>
                <Link to="/panel/profile">
                    <img src="https://placehold.co/45x45/png" alt="Profile" className="rounded-full" />
                </Link>
            </div>
        </header>
    );
};

export default Header;
