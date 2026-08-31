import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ShowNavBar = ({ children }) => {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
    // Routes where navbar should be hidden
    const hideNavbarRoutes = [
      "/",               // homepage
      "/login",          // login page
      "/register",       // registration page
      "/joinasseller",   // seller registration
      "/joinasbuyer",    // buyer registration
      "/joinasadvertiser"// advertiser registration
    ];

    if (hideNavbarRoutes.includes(location.pathname)) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [location]);

  return <>{showNavbar && children}</>;
};

export default ShowNavBar;
