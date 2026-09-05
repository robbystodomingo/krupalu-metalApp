import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';

import { showConfirmation } from '../utils/ConfirmationModal';
import Sidenav from '../component/Sidenav'; // 👈 your sidebar

const drawerWidth = 0;



const Navbar = ({ role, open, toggleDrawer }) => {
  const navigate = useNavigate();

  async function logout(event) {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        '/api/v1/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` } }

      );

      const confirmed = showConfirmation({
        title: 'Logout',
        message: 'You have logged out.',
        confirmText: 'Got it!',
      });

      console.log(response.data);

      if (confirmed) {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert('Logout failed: ' + err.message);

      localStorage.removeItem('role');
      localStorage.removeItem('token');
      navigate('/');
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* Menu button toggles the Drawer */}
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 6 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>

          <Button sx={{ ml: 'auto' }} color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Persistent Drawer with your Sidenav */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? drawerWidth : 220, // 👈 collapsed width
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 220,
          },
        }}
      >
        <Sidenav role={role} />
      </Drawer>


    </Box>
  );
};

export default Navbar;
