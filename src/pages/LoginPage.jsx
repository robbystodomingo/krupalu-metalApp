import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const fontDisplay = '"Oswald", sans-serif';
const fontBody = '"Inter", sans-serif';

const COLORS = {
  graphite: "#5b6168",
  accent: "#D4AF37",
  accentDim: "#a19f05",
  text: "#15181B",
};

// Shared look for every text field: gold focus ring, soft rounded corners.
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "#fff",
    fontFamily: fontBody,
    transition: "box-shadow 0.25s ease",
    "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(212,175,55,0.22)" },
    "&.Mui-focused fieldset": { borderColor: COLORS.accent },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: COLORS.accentDim },
};

// Shared look for dialog primary buttons.
const dialogPrimarySx = {
  bgcolor: COLORS.accent,
  color: COLORS.text,
  fontFamily: fontBody,
  fontWeight: 700,
  textTransform: "none",
  borderRadius: 2,
  px: 3,
  "&:hover": { bgcolor: "#e2bf4a" },
};

const dialogPaperProps = { sx: { borderRadius: 3, m: 2 } };

function LoginPage({ setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Same fonts as the rest of the site
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  async function login(event) {
    event.preventDefault();
    setErrorMessage("");
    setErrorType("");
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        minHeight: "100vh",
        // 100dvh keeps the layout correct when mobile browser bars show/hide
        "@supports (height: 100dvh)": { minHeight: "100dvh" },
        alignItems: "center",
        justifyContent: { xs: "center", md: "flex-start" },
        px: { xs: 2, sm: 4, md: 10, lg: 16 },
        py: { xs: 4, md: 6 },
        overflow: "hidden",
        bgcolor: "#15181b",
        fontFamily: fontBody,
      }}
    >
      {/* Animations */}
      <style>{`
        @keyframes bgZoom {
          from { transform: scale(1); }
          to   { transform: scale(1.1); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(32px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sheen {
          0%   { transform: translateX(-120%) skewX(-20deg); }
          60%, 100% { transform: translateX(380%) skewX(-20deg); }
        }
      `}</style>

      {/* Slowly zooming background photo */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/LoginPage.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          animation: "bgZoom 24s ease-in-out infinite alternate",
        }}
      />
      {/* Dark overlay so the card pops and text stays legible */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(21,24,27,0.78) 0%, rgba(21,24,27,0.45) 60%, rgba(21,24,27,0.7) 100%)",
        }}
      />

      {/* Back to home */}
      <Button
        href="/"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{
          position: "absolute",
          top: { xs: 10, md: 20 },
          left: { xs: 8, md: 24 },
          color: "rgba(255,255,255,0.85)",
          textTransform: "none",
          fontFamily: fontBody,
          fontWeight: 500,
          zIndex: 2,
          "&:hover": { color: COLORS.accent, bgcolor: "transparent" },
        }}
      >
        Home
      </Button>

      <Paper
        elevation={0}
        component="form"
        onSubmit={login}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: { xs: 440, md: 850 },
          mt: { xs: 4, md: 0 },
          p: { xs: 3, sm: 4.5 },
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          borderRadius: 4,
          borderTop: `4px solid ${COLORS.accent}`,
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
          animation: "cardIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        }}
      >
        <Box sx={{ textAlign: "center", animation: "fadeUp 0.7s ease 0.2s both" }}>
          <img
            src="/new-logo-for-site-2.png"
            alt="Krupalu Metal Inc."
            style={{ height: 56, maxWidth: "100%", objectFit: "contain" }}
          />
          <Typography
            component="h1"
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: { xs: "1.55rem", sm: "1.9rem" },
              lineHeight: 1.2,
              letterSpacing: "0.5px",
              color: COLORS.text,
              mt: 2,
            }}
          >
            Welcome to Krupalu Metal Inc!
          </Typography>
          <Box sx={{ width: 48, height: 3, bgcolor: COLORS.accent, borderRadius: 2, mx: "auto", my: 1.5 }} />
          <Typography sx={{ fontFamily: fontBody, color: "text.secondary" }}>
            Sign in to continue.
          </Typography>
        </Box>

        <TextField
          label="Email"
          type="email"
          fullWidth
          autoComplete="email"
          inputProps={{ inputMode: "email", autoCapitalize: "none" }}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          sx={{ ...fieldSx, animation: "fadeUp 0.7s ease 0.3s both" }}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          sx={{ ...fieldSx, animation: "fadeUp 0.7s ease 0.4s both" }}
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
          fullWidth
          disabled={loading}
          sx={{
            position: "relative",
            overflow: "hidden",
            py: 1.6,
            borderRadius: 50,
            bgcolor: COLORS.accent,
            color: COLORS.text,
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: "1.05rem",
            textTransform: "none",
            boxShadow: "0 8px 22px rgba(212,175,55,0.35)",
            animation: "fadeUp 0.7s ease 0.5s both",
            transition: "transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease",
            "&:hover": {
              bgcolor: "#e2bf4a",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 28px rgba(212,175,55,0.5)",
            },
            "&:active": { transform: "translateY(0) scale(0.99)" },
            "&.Mui-disabled": { bgcolor: "rgba(212,175,55,0.6)", color: COLORS.text },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "30%",
              height: "100%",
              background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))",
              animation: "sheen 3.5s ease-in-out infinite",
            },
          }}
        >
          {loading ? <CircularProgress size={26} sx={{ color: COLORS.text }} /> : "Log in"}
        </Button>

        <Box sx={{ textAlign: "center", animation: "fadeUp 0.7s ease 0.6s both" }}>
          <Typography variant="body2" sx={{ fontFamily: fontBody }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              underline="hover"
              sx={{ color: COLORS.accentDim, fontWeight: 600 }}
            >
              Register!
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5, fontFamily: fontBody }}>
            <Link
              underline="hover"
              onClick={() => setForgotOpen(true)}
              sx={{ cursor: "pointer", color: COLORS.graphite, fontWeight: 500 }}
            >
              Forgot Password?
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Error Modal */}
      <Dialog
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={dialogPaperProps}
      >
        <DialogTitle sx={{ fontFamily: fontDisplay, fontWeight: 600 }}>
          {errorType === "pending" && "Account Pending Approval"}
          {errorType === "rejected" && "Account Rejected"}
          {errorType === "invalid" && "Invalid Credentials"}
          {errorType === "other" && "Login Error"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: fontBody }}>
            {errorType === "pending" &&
              "Your account is still under review by our Administrators. You'll be notified once it's approved."}
            {errorType === "rejected" &&
              "Your account registration was not approved. Please contact support if you believe this is a mistake."}
            {errorType === "invalid" &&
              "The email or password you entered is incorrect. Please try again."}
            {errorType === "other" && errorMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenErrorModal(false)} sx={dialogPrimarySx}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Forgot password — step 1: email */}
      <Dialog
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={dialogPaperProps}
      >
        <DialogTitle sx={{ fontFamily: fontDisplay, fontWeight: 600 }}>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Enter your email"
            type="email"
            fullWidth
            autoComplete="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            sx={{ ...fieldSx, mt: 1 }}
          />
          {forgotMessage && (
            <Typography variant="body2" sx={{ mt: 1, color: forgotMessage.includes("Error") ? "error.main" : "success.main" }}>
              {forgotMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setForgotOpen(false)} sx={{ color: COLORS.graphite, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            sx={dialogPrimarySx}
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

      {/* Forgot password — step 2: OTP */}
      <Dialog
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={dialogPaperProps}
      >
        <DialogTitle sx={{ fontFamily: fontDisplay, fontWeight: 600 }}>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            label="6-digit Code"
            fullWidth
            autoComplete="one-time-code"
            inputProps={{ inputMode: "numeric" }}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{ ...fieldSx, mt: 1 }}
          />
          {otpMessage && (
            <Typography variant="body2" sx={{ mt: 1, color: otpMessage.includes("Invalid") ? "error.main" : "success.main" }}>
              {otpMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOtpOpen(false)} sx={{ color: COLORS.graphite, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            sx={dialogPrimarySx}
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

      {/* Forgot password — step 3: new password */}
      <Dialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={dialogPaperProps}
      >
        <DialogTitle sx={{ fontFamily: fontDisplay, fontWeight: 600 }}>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            fullWidth
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ ...fieldSx, mt: 1 }}
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
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ ...fieldSx, mt: 2 }}
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
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPasswordOpen(false)} sx={{ color: COLORS.graphite, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            sx={dialogPrimarySx}
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
