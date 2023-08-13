// Footer.js
import React from "react";
import "../App.css";

function Footer() {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Xalts. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
