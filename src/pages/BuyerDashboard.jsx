import React from "react";
import SellersList from "./SellersList";
import { Box, Typography } from "@mui/material";

export default function BuyerDashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Buyer Dashboard
      </Typography>
      
      {/* Product list only visible here */}
      {/* <SellersList /> */}
    </Box>
  );
}