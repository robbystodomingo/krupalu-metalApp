import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";
import { Box } from "@mui/material";

const drawerWidth = 220; // 👈 adjust this value to control how narrow the sidebar + header offset is

export default function Layout({ role, setRole, children }) {
  const location = useLocation();
  const hiddenPaths = ["/", "/login", "/register"];
  const shouldHideNavbar = hiddenPaths.includes(location.pathname);

  // Sidebar state lives here
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Navbar always on top unless hidden */}
      {!shouldHideNavbar && role && (
        <Navbar
          role={role}
          open={open}
          toggleDrawer={toggleDrawer}
          setRole={setRole}
        />
      )}

      {/* Main content shifts right only by drawerWidth when drawer is open */}

      <Box
        component="main"
        sx={{
          flexGrow: shouldHideNavbar ? 1 : 1,
          width: shouldHideNavbar ? "100%" : "auto",
          minWidth: shouldHideNavbar ? "100%" : 1650,
          maxWidth: shouldHideNavbar ? "100%" : 1920,
          minHeight: "calc(100vh - 64px)",
          maxHeight: "calc(100vh - 64px)",
          marginTop: !shouldHideNavbar ? "64px" : "0",
          marginLeft: !shouldHideNavbar && role && open ? `${drawerWidth}px` : 0,
          transition: "margin-left 0.3s ease",
          boxShadow: "none",
          borderRight: "none",
          backgroundImage: "none",
          p: { xs: 0, md: 0 },
          // overflowX: "hidden",
        }}
      >
        {children}
      </Box>




    </Box>
  );
}
