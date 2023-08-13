// Header.js
import React from "react";
import "./Header.css"; // Import your CSS file for styling if needed
import logo from "../logo-main.png";

function Header() {
  return (
    <header className="header">
      <h1></h1>
      <img
        src={logo}
        width="5%"
        height="5%"
        style={{ marginLeft: "10px", marginTop: "0px" }}
      />
      <nav style={{ marginLeft: "150px", marginTop: "-25px" }}>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
