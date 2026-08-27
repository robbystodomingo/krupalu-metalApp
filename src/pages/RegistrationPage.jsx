import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, MenuItem, Box, Stepper, Step, StepLabel, Typography } from "@mui/material";

const steps = ["Account Setup", "Role Details"];

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleNext = async (e) => {
    e.preventDefault();

    if (!role) {
      alert("Please select a role");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      
      // Navigate to role-specific page
      if (role === "buyer") {
        navigate("/joinasbuyer", { state: { email, password } });
      } else if (role === "seller") {
        navigate("/joinasseller", { state: { email, password } });
      } else if (role === "advertiser") {
        navigate("/joinasadvertiser", { state: { email, password } });
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleNext}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 800,
        margin: "auto",
        mt: 5,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
       <Stepper activeStep={0} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={() => {
                  if (index === 0) navigate("/register");
                  if (index === 1 && role) {
                    if (role === "buyer") navigate("/joinasbuyer", { state: { email, password } });
                    if (role === "seller") navigate("/joinasseller", { state: { email, password } });
                    if (role === "advertiser") navigate("/joinasadvertiser", { state: { email, password } });
                  }
                }}
                sx={{ cursor: "pointer" }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        Register @ Krupalu Metal Inc!
      </Typography>

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <TextField
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <TextField
        select
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      >
        <MenuItem value="buyer">Buyer</MenuItem>
        <MenuItem value="seller">Seller</MenuItem>
        <MenuItem value="advertiser">Advertiser</MenuItem>
      </TextField>
      <Button type="submit" variant="contained">
        Next
      </Button>
    </Box>
  );
}
