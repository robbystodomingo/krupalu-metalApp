import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

import Sheet from '@mui/joy/Sheet';
import CssBaseline from '@mui/joy/CssBaseline';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';

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
 
      console.log(response.data);

     

      const { role } = response.data;
      console.log("APP ROLE: ", role)

      setRole(role.toUpperCase());

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "SELLER") {
        navigate("/seller");
      } else if (role === "BUYER") {
        navigate("/buyer");
      } else if (role === "ADVERTISER") {
        navigate("/advertiser");
      } else {
        navigate("/home"); 
      }

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  }

  return (
    <main  style={{
      display: "flex",
      minHeight: "100dvh",
      backgroundImage: "url('/LoginPage.png')", 
      backgroundSize: "cover",                  
      backgroundPosition: "center",             
      backgroundRepeat: "no-repeat",
    }}>
      <CssBaseline />
      <Sheet
        sx={{
           width: 750,
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
        variant="outlined"
      >
        <div>
          <Typography level="h4" component="h1">
            <b>Welcome to Krupalu Metal Inc!</b>
          </Typography>
          <Typography level="body-sm">Sign in to continue.</Typography>
        </div>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormControl>
        <Button onClick={login} sx={{ mt: 1 }}>Log in</Button>
        <Typography
          endDecorator={<Link href="/register">Register</Link>}
          fontSize="sm"
          sx={{ alignSelf: 'center' }}
        >
          Don&apos;t have an account?
        </Typography>
      </Sheet>
    </main>
  );
}

export default LoginPage;
