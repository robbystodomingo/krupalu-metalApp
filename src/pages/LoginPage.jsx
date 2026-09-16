import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function LoginPage({ setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorType, setErrorType] = useState("");

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpOpen, setOtpOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [forgotMessage, setForgotMessage] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  async function login(event) {
    event.preventDefault();
    setErrorMessage("");
    setErrorType("");

    try {
      const response = await axios.post(
        "/api/v1/auth/signin",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token, role, message, id, fullName, email: userEmail } = response.data;

      if (!token) {
        setErrorMessage(message || "Login failed");
        setErrorType(
          message?.toLowerCase().includes("pending") ? "pending" :
            message?.toLowerCase().includes("rejected") ? "rejected" :
              message?.toLowerCase().includes("invalid") ? "invalid" : "other"
        );
        setOpenErrorModal(true);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role.toUpperCase());
      localStorage.setItem("userId", id);
      localStorage.setItem("fullName", fullName || "");
      localStorage.setItem("email", userEmail || "");
      setRole(role.toUpperCase());

      // Navigate based on role
      if (role === "ADMIN") navigate("/admin");
      else if (role === "SELLER") navigate("/seller");
      else if (role === "BUYER") navigate("/buyer");
      else if (role === "ADVERTISER") navigate("/advertiser");
      else navigate("/home");

    } catch (err) {
      console.error(err);
      let message = "Login failed";
      let type = "other";
      if (err.response && err.response.data) {
        message = err.response.data.message || "Login failed";
        if (message.toLowerCase().includes("pending")) type = "pending";
        else if (message.toLowerCase().includes("rejected") || message.toLowerCase().includes("denied")) type = "rejected";
      }
      setErrorMessage(message);
      setErrorType(type);
      setOpenErrorModal(true);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundImage: "url('/LoginPage.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        alignItems: "center",
        justifyContent: "flex-start",
        pl: 10,
      }}
    >
      <Paper
        elevation={6}
        component="form"
        onSubmit={login}
        sx={{
          width: 600,
          ml: 20,
          my: "auto",
          py: 3,
          px: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: "sm",
          boxShadow: "md",
          backgroundColor: "rgba(255,255,255,0.85)",
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          <b>Welcome to Krupalu Metal Inc!</b>
        </Typography>
        <Typography variant="body2" align="center">
          Sign in to continue.
        </Typography>

        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  tabIndex={-1}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 1 }}
        >
          Log in
        </Button>

        <Typography variant="body2" align="center">
          Don&apos;t have an account?{" "}
          <Link href="/register" underline="hover">
            Register!
          </Link>
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <Link underline="hover" onClick={() => setForgotOpen(true)} sx={{ cursor: "pointer" }}>
            Forgot Password?
          </Link>
        </Typography>

      </Paper>

      {/* Error Modal */}
      <Dialog open={openErrorModal} onClose={() => setOpenErrorModal(false)}>
        <DialogTitle>
          {errorType === "pending" && "Account Pending Approval"}
          {errorType === "rejected" && "Account Rejected"}
          {errorType === "invalid" && "Invalid Credentials"}
          {errorType === "other" && "Login Error"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {errorType === "pending" &&
              "Your account is still under review by our Administrators. You'll be notified once it's approved."}
            {errorType === "rejected" &&
              "Your account registration was not approved. Please contact support if you believe this is a mistake."}
            {errorType === "invalid" &&
              "The email or password you entered is incorrect. Please try again."}
            {errorType === "other" && errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenErrorModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)}>
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter your email"
            type="email"
            fullWidth
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            sx={{ mt: 1 }}
          />
          {forgotMessage && (
            <Typography variant="body2" sx={{ mt: 1, color: forgotMessage.includes("Error") ? "error.main" : "success.main" }}>
              {forgotMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                const res = await fetch(`/api/v1/auth/forgot-password?email=${encodeURIComponent(forgotEmail)}`, { method: "POST" });
                if (res.ok) {
                  setForgotMessage("OTP sent to your email.");
                  setTimeout(() => {
                    setForgotOpen(false);
                    setOtpOpen(true);
                    setForgotMessage("");
                  }, 1500);
                } else {
                  setForgotMessage("Error sending OTP.");
                }
              } catch (err) {
                setForgotMessage("Request failed: " + err.message);
              }
            }}
          >
            Send OTP
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={otpOpen} onClose={() => setOtpOpen(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            label="6-digit Code"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{ mt: 1 }}
          />
          {otpMessage && (
            <Typography variant="body2" sx={{ mt: 1, color: otpMessage.includes("Invalid") ? "error.main" : "success.main" }}>
              {otpMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtpOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                const res = await fetch(`/api/v1/auth/validate-otp?token=${otp}`, { method: "POST" });
                if (res.ok) {
                  setOtpMessage("OTP verified!");
                  setTimeout(() => {
                    setOtpOpen(false);
                    setPasswordOpen(true);
                    setOtpMessage("");
                  }, 1000);
                } else {
                  setOtpMessage("Invalid or expired OTP.");
                }
              } catch (err) {
                setOtpMessage("Request failed: " + err.message);
              }
            }}
          >
            Verify
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={passwordOpen} onClose={() => setPasswordOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {passwordMessage && (
            <Typography variant="body2" sx={{ mt: 1, color: passwordMessage.includes("Error") ? "error.main" : "success.main" }}>
              {passwordMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (newPassword !== confirmPassword) {
                setPasswordMessage("Error: Passwords do not match.");
                return;
              }
              try {
                const res = await fetch(`/api/v1/auth/reset-password?token=${otp}&newPassword=${encodeURIComponent(newPassword)}`, {
                  method: "POST"
                });
                if (res.ok) {
                  setPasswordMessage("Password reset successful! You can now log in.");
                  setTimeout(() => {
                    setPasswordOpen(false);
                    setPasswordMessage("");
                  }, 1500);
                } else {
                  const errorText = await res.text();
                  setPasswordMessage("Error: " + errorText);
                }
              } catch (err) {
                setPasswordMessage("Request failed: " + err.message);
              }
            }}
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default LoginPage;