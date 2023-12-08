import { useState } from "react";

import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <div className="navbar">
      <div className="nav-icon">PERS</div>
      {isLoggedIn && (
        <>
          <div>option1</div>
          <div>option2</div>
        </>
      )}
    </div>
  );
};

export default Navbar;
