import React, { useState } from 'react';
import { Modal, Box, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { showConfirmation } from '../utils/ConfirmationModal';

const ChangePasswordModal = ({ open, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      await showConfirmation({ title: 'Mismatch', message: 'New passwords do not match.', confirmText: 'Got it' });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`/api/v1/user/changePassword/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (response.ok) {
        await showConfirmation({ title: 'Success', message: 'Password changed successfully.', confirmText: 'OK' });
        onClose();
      } else {
        const errorText = await response.text();
        await showConfirmation({ title: 'Error', message: 'Password change failed: ' + errorText, confirmText: 'Got it' });
      }
    } catch (err) {
      console.error(err);
      await showConfirmation({ title: 'Error', message: 'Request failed: ' + err.message, confirmText: 'Got it' });
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                 bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24, width: 400 }}>
        {/* Close button */}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>

        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <TextField fullWidth margin="normal" label="Old Password" type="password"
                     value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <TextField fullWidth margin="normal" label="New Password" type="password"
                     value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <TextField fullWidth margin="normal" label="Confirm New Password" type="password"
                     value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Changes</Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
