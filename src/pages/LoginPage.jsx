import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper
} from "@mui/material";

function LoginPage({ setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function login(event) {
    event.preventDefault();
    try {
      const response = await axios.post("api/v1/auth/signin", {
        email,
        password,
      }, {
        headers: { "Content-Type": "application/json" }
      });

      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role.toUpperCase());
      setRole(role.toUpperCase());

      if (role === "ADMIN") navigate("/admin");
      else if (role === "SELLER") navigate("/seller");
      else if (role === "BUYER") navigate("/buyer");
      else if (role === "ADVERTISER") navigate("/advertiser");
      else navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Login failed");
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
          type="password"
          fullWidth
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={login}
          fullWidth
          sx={{ mt: 1 }}
        >
          Log in
        </Button>

        <Typography variant="body2" align="center">
          Don&apos;t have an account?{" "}
          <Link href="/register" underline="hover">
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginPage;
