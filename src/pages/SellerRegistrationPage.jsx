import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TextField, 
          Button, 
          Box, 
          Grid, 
          Typography, 
          Stepper, 
          Step, 
          StepLabel, 
          Autocomplete } from "@mui/material";
import { showConfirmation } from "../utils/ConfirmationModal";
import { countries } from "../component/Countries"; 

const steps = ["Account Setup", "Role Details"];

export default function SellerRegistrationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email] = useState(state?.email || "");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [requirement, setRequirement] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8082/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          username,
          phoneNumber,
          country,
          requirement,
          password: state?.password,
          role: "SELLER"
        }),
      });

      if (!response.ok) throw new Error("Registration failed");

      const data = await response.json();
      console.log("Seller registered:", data);

      const confirmed = await showConfirmation({
        title: "Registration Successful",
        message: "Your Seller account has been created successfully.",
        confirmText: "Got it!",
        cancelText: "Back"
      });

      if (confirmed){
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
     <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: 1000, // wider to fit two columns
        margin: "auto",
        mt: 5,
        p: 3,
        my: "auto",
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Stepper activeStep={1} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              onClick={() => {
                if (index === 0) navigate("/register"); // go back to step 1
              }}
              sx={{ cursor: "pointer" }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

       {/* Header */}
      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        Join as a Seller
      </Typography>
      <Grid container spacing={2}>
        {/* Left column */}
        <Grid size={6}>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
        </Grid>

        <Grid size={6}>
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid size={6}>
          <Autocomplete
            options={countries} // your imported list
            value={country}
            onChange={(event, newValue) => setCountry(newValue)}
            getOptionLabel={(option) => option || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                required
                variant="outlined" 
                fullWidth
              />
            )}
            fullWidth
          />
        </Grid>


        {/* Requirement field spans full width */}
        <Grid size={12}>
          <TextField
            label="Requirement"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            multiline
            rows={3}
            fullWidth
            required
          />
        </Grid>

        {/* Submit button spans full width */}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/register")}>
            Back
          </Button>
          <Button type="submit" variant="contained">
            Register Seller
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
