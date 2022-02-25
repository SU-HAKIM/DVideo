import React from "react";
import Vector from "../images/Vector.png";

const Navbar = ({ address }) => {
  return (
    <div className="bg-dark py-2">
      <div className="container d-flex justify-content-between align-items-center">
        <h3 className="lead text-white">
          <img
            src={Vector}
            alt="logo"
            style={{ width: 30, height: 25, marginRight: 5 }}
          />
          Decentragram
        </h3>
        <p className="text-muted">ADD: {address}</p>
      </div>
    </div>
  );
};

export default Navbar;

