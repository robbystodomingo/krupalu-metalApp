import React from "react";
import { useLocation } from "react-router-dom";

import Sidenav from "../component/Sidenav"; 

export default function Layout({ role, children }) {
    
const location = useLocation();
const hiddenPaths = ["/", "/login", "/register"];
const shouldHideSidenav = hiddenPaths.includes(location.pathname);
  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ✅ Only show navbar if not on hidden paths */}
      {!shouldHideSidenav}
      <div style={{ display: "flex" }}>
        {/* ✅ Only show sidenav if role exists and not on hidden paths */}
        {!shouldHideSidenav && role && <Sidenav role={role} />}
        <main
          style={{
            flex: 1,
            marginLeft: !shouldHideSidenav && role ? "220px" : "0",
            marginTop: !shouldHideSidenav ? "64px" : "0", // ✅ only offset when navbar is visible
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
