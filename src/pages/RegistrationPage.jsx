import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const steps = ["Account Setup", "Role Details"];

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

let emailCheckTimeout; // ✅ declare outside component to persist between renders

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Modal state
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`/api/v1/auth/check-email?email=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error("Failed to check email");
      return await response.json(); // backend returns true/false
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("Email is required");
      return;
    } else if (!isValidEmail(value)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (emailCheckTimeout) clearTimeout(emailCheckTimeout);

    emailCheckTimeout = setTimeout(async () => {
      const exists = await checkEmailExists(value);
      if (exists) {
        setEmailError("This email is already registered");
      } else {
        setEmailError("");
      }
    }, 500);
  };

  // ✅ Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (emailCheckTimeout) {
        clearTimeout(emailCheckTimeout);
      }
    };
  }, []);

  const showError = (message) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
  };

  const handleNext = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      showError("Invalid email format. Please enter a valid email.");
      return;
    }

    const exists = await checkEmailExists(email);
    if (exists) {
      showError("This email is already registered. Please use another one.");
      return;
    }

    if (!role) {
      showError("Please select a role before continuing.");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match!");
      return;
    }

    try {
      if (role === "buyer") {
        navigate("/joinasbuyer", { state: { email, password } });
      } else if (role === "seller") {
        navigate("/joinasseller", { state: { email, password } });
      } else if (role === "advertiser") {
        navigate("/joinasadvertiser", { state: { email, password } });
      }
    } catch (error) {
      console.error("Error:", error);
      showError("Registration failed. Please try again.");
    }
  };

  return (
    <>
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
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ cursor: "pointer" }}>{label}</StepLabel>
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
          onChange={handleEmailChange}
          error={Boolean(emailError)}
          helperText={emailError}
          required
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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

      {/* Error Modal */}
      <Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorModalOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
