// Footer.js
import React from "react";
import "./Footer.css"; // Import your CSS file for styling if needed

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
