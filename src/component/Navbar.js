import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { showConfirmation } from '../utils/ConfirmationModal';
import Sidenav from '../component/Sidenav';
import ProfileModal from '../modals/ProfileModal';
import ChangePasswordModal from '../modals/ChangePasswordModal';


import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


const drawerWidth = 0;

const Navbar = ({ role, open, toggleDrawer }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const username = localStorage.getItem('fullName');



  const handleChangePassword = () => {
    handleMenuClose();
    setPasswordOpen(true);
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  async function logout(event) {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');

      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      localStorage.removeItem("fullName");

      await showConfirmation({
        title: 'Logout',
        message: 'You have logged out.',
        confirmText: 'Got it!',
      });

      localStorage.clear();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Logout failed: ' + err.message);
      localStorage.clear();
      navigate('/');
    }
  }

  const handleChangeProfile = () => {
    handleMenuClose();
    setProfileOpen(true);
  };

  const dropdownRoles = ['BUYER', 'SELLER', 'ADVERTISER'];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
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

          {dropdownRoles.includes(role) ? (
            <>
              <Typography variant="body1" sx={{ ml: 'auto', mr: 2 }}>
                Hi, {username || 'User'}!
              </Typography>
              <IconButton size="large" edge="end" color="inherit" onClick={handleMenuOpen}>
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleChangeProfile}>
                  <EditIcon fontSize="small" sx={{ mr: 1 }} /> Change Profile
                </MenuItem>
                <MenuItem onClick={handleChangePassword}>
                  <LockIcon fontSize="small" sx={{ mr: 1 }} /> Change Password
                </MenuItem>
                <MenuItem onClick={logout}>
                  <ExitToAppIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>

            </>
          ) : (
            <Button sx={{ ml: 'auto' }} color="inherit" onClick={logout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            p: 1,
          },
        }}
      >
        <Sidenav role={role} />
      </Drawer>

      {/* Profile Modal */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />

      { /* Change Password Modal */}

      <ChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </Box>
  );
};

export default Navbar;
