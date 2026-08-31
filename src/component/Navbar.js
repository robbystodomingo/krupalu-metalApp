import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { showConfirmation } from "../utils/ConfirmationModal";


const Navbar = () => {

  const navigate = useNavigate();

  async function logout(event) {
    event.preventDefault();
    try {
      await axios.post("api/v1/auth/logout", {
      
      }).then((response) => {
        
      const confirmed = showConfirmation({
              title: "Logout",
              message: "You have logged out.",
              confirmText: "Got it!"
              // cancelText: "Back"
            });

        console.log(response.data);
        if(confirmed){
          navigate('/');
        }
        
    });

    } catch (err) {
      alert(err);
    }
  }

    return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Button sx={{ ml: 'auto' }} color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  
   
      
    );
  }

  export default Navbar;




