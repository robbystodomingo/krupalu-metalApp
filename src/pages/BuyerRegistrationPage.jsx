import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Autocomplete
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css"; // Material-styled variant of the library
import { showConfirmation } from "../utils/ConfirmationModal";
import { countries } from "../component/Countries";



const steps = ["Account Setup", "Role Details"];

export default function BuyerRegistrationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email] = useState(state?.email || "");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [country, setCountry] = useState("");
  const [requirement, setRequirement] = useState("");

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const phoneHasValue = phoneNumber && phoneNumber.replace(/\D/g, "").length > 0;
  const isPhoneLabelFloating = isPhoneFocused || phoneHasValue;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    try {
      const response = await fetch("/api/v1/auth/register", {
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
          role: "BUYER"
        }),
      });

      if (!response.ok) throw new Error("Registration failed");

      const data = await response.json();
      console.log("Buyer registered:", data);

      const confirmed = await showConfirmation({
        title: "Buyer Registration is for approval",
        message: "Your Buyer account is under review by our Administrators and will get back to you shortly. Thank you!",
        confirmText: "Got it!",
        cancelText: "Back"
      });

      if (confirmed) {
        navigate("/");
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
        width: 1000,
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
                if (index === 0) navigate("/register");
              }}
              sx={{ cursor: "pointer" }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
        Join as a Buyer
      </Typography>
      <Grid container spacing={2}>
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
          {/* react-phone-input-2 styled to match MUI outlined TextFields */}
          <Box
            sx={{
              position: "relative",
              "& .react-tel-input .special-label": {
                display: "none",
              },
              "& .react-tel-input .form-control": {
                width: "100%",
                height: "56px",
                fontSize: "1rem",
                fontFamily: "inherit",
                borderRadius: "10px",
                borderColor: phoneError
                  ? "#d32f2f"
                  : isPhoneFocused
                    ? "#1976d2"
                    : "rgba(0, 0, 0, 0.23)",
                borderWidth: isPhoneFocused ? "2px" : "1px",
                backgroundColor: "transparent",
                "&:hover": {
                  borderColor: phoneError ? "#d32f2f" : "rgba(0, 0, 0, 0.87)",
                },
                "&:focus": {
                  boxShadow: "none",
                },
              },
              "& .react-tel-input .flag-dropdown": {
                borderColor: phoneError
                  ? "#d32f2f"
                  : isPhoneFocused
                    ? "#1976d2"
                    : "rgba(0, 0, 0, 0.23)",
                borderWidth: isPhoneFocused ? "2px" : "1px",
                borderRadius: "10px 0 0 10px",
                backgroundColor: "transparent",
              },
              "& .react-tel-input .flag-dropdown.open .selected-flag": {
                backgroundColor: "transparent",
              },
              "& .react-tel-input .selected-flag:hover, & .react-tel-input .selected-flag:focus": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Typography
              component="label"
              sx={{
                position: "absolute",
                left: isPhoneLabelFloating ? "10px" : "96px",
                top: isPhoneLabelFloating ? "-9px" : "50%",
                transform: isPhoneLabelFloating ? "none" : "translateY(-50%)",
                fontSize: isPhoneLabelFloating ? "0.8rem" : "1rem",
                color: phoneError
                  ? "#d32f2f"
                  : isPhoneFocused
                    ? "#1976d2"
                    : "rgba(0, 0, 0, 0.6)",
                backgroundColor: isPhoneLabelFloating
                  ? (theme) => theme.palette.background.default
                  : "transparent",
                padding: isPhoneLabelFloating ? "0 4px" : 0,
                pointerEvents: "none",
                transition: "all 150ms cubic-bezier(0.0, 0, 0.2, 1)",
                zIndex: 1,
              }}
            >
              Phone Number *
            </Typography>

            <PhoneInput
              country={"us"}
              value={phoneNumber}
              onChange={(value) => {
                setPhoneNumber(value);
                if (phoneError) setPhoneError("");
              }}
              onFocus={() => setIsPhoneFocused(true)}
              onBlur={() => setIsPhoneFocused(false)}
              inputProps={{
                name: "phoneNumber",
                required: true,
              }}
            />
            {phoneError && (
              <Typography variant="caption" sx={{ color: "#d32f2f", ml: 1.5, mt: 0.5, display: "block" }}>
                {phoneError}
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid size={6}>
          <Autocomplete
            options={countries}
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

        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/register")}>
            Back
          </Button>
          <Button type="submit" variant="contained">
            Register Buyer
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
