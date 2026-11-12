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
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

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
      {/* Full-viewport background with the same industrial photo used on the homepage */}
      <Box
        sx={{
          position: "relative", // lets the Home button sit in the top-left corner
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('/Whoweare.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: { xs: "scroll", md: "fixed" },
          py: 4,
          px: 2,
        }}
      >
        {/* Back to home — same as the login page. The dark pill keeps it readable over the photo. */}
        <Button
          href="/"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            position: "absolute",
            top: { xs: 10, md: 20 },
            left: { xs: 8, md: 24 },
            zIndex: 2,
            px: 2,
            color: "#fff",
            bgcolor: "transparent",
            borderRadius: 50,
            textTransform: "none",
            fontWeight: 600,
            textShadow: "0 1px 6px rgba(0,0,0,0.8)", // keeps the text readable over the photo
            "& .MuiButton-startIcon": { filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.8))" },
            "&:hover": { color: "#D4AF37", bgcolor: "transparent" },
          }}
        >
          Home
        </Button>

        <Box
          component="form"
          onSubmit={handleNext}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 800,
            maxWidth: "100%",
            mt: { xs: 4, md: 0 }, // keeps the card clear of the Home button on small screens
            p: 3,
            bgcolor: "rgba(255,255,255,0.85)",
            borderRadius: 2,
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
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
