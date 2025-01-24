import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/testlogo.png";

const Navbar = () => {
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0 }}>
      <Link
        className="logo"
        to="/"
        style={{
          position: "absolute",
          left: "45px",
          top: "22px",
          fontSize: "20px",
          color: "#616336",
        }}
      >
        <img src={logo} alt="Logo" />
      </Link>
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        <li style={{ marginRight: "13px" }}>
          <Link to="/login" style={{ color: "#616336", fontSize: "16px" }}>
            L O G I N
          </Link>
        </li>
        <li style={{ marginRight: "15px" }}>
          <Link to="/register" style={{ color: "#616336", fontSize: "16px" }}>
            R E G I S T E R
          </Link>
        </li>
        <li style={{ marginRight: "16px" }}>
          <Link to="/profile" style={{ color: "#616336", fontSize: "16px" }}>
            P R O F I L E
          </Link>
        </li>
        <li style={{ marginRight: "17px" }}>
          <Link to="/browse" style={{ color: "#616336", fontSize: "16px" }}>
            B R O W S E
          </Link>
        </li>
        <li style={{ marginRight: "18px" }}>
          <Link
            to="/createaparty"
            style={{ color: "#616336", fontSize: "16px" }}
          >
            P A R T I E S
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
