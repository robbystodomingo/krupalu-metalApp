import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Autocomplete, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { showConfirmation } from '../utils/ConfirmationModal';
import { countries } from '../component/Countries';

const ProfileModal = ({ open, onClose }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [isPhoneFocused, setIsPhoneFocused] = useState(false);

    const phoneHasValue = phoneNumber && phoneNumber.replace(/\D/g, '').length > 0;
    const isPhoneLabelFloating = isPhoneFocused || phoneHasValue;

    // 🔎 Fetch existing details when modal opens
    useEffect(() => {
        if (open) {
            const token = localStorage.getItem("token");
            if (!token) return;

            axios.get("/api/v1/user/me", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    const data = res.data;
                    setFullName(data.fullName || "");
                    setEmail(data.email || "");
                    setPhoneNumber(data.phoneNumber || "");
                    setCountry(data.country || "");
                })
                .catch(err => {
                    console.error("Failed to fetch user details:", err);
                });
        }
    }, [open]);

    async function handleProfileSubmit(e) {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
            setPhoneError('Please enter a valid phone number (10–15 digits)');
            return;
        }

        try {
            const updateData = { fullName, email, phoneNumber, country };
            const response = await axios.put(
                `/api/v1/user/updateUser/${userId}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            localStorage.setItem('fullName', response.data.fullName || '');
            localStorage.setItem('email', response.data.email || '');
            localStorage.setItem('phoneNumber', response.data.phoneNumber || '');
            localStorage.setItem('country', response.data.country || '');

            await showConfirmation({
                title: 'Profile Updated',
                message: 'Your profile has been updated successfully.',
                confirmText: 'OK',
            });

            onClose();
            window.location.reload();
        } catch (err) {
            console.error(err);
            await showConfirmation({
                title: 'Update Failed',
                message: 'Profile update failed: ' + err.message,
                confirmText: 'Got it',
            });
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                p: 4, borderRadius: 2, boxShadow: 24,
                width: 400
            }}>
                {/* Close button */}
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>

                <h2>Update Profile</h2>
                <form onSubmit={handleProfileSubmit}>
                    <TextField fullWidth margin="normal" label="Full Name"
                        value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <TextField fullWidth margin="normal" label="Email"
                        value={email} onChange={(e) => setEmail(e.target.value)} />

                    {/* Phone Number Field */}
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            component="label"
                            variant="body2"
                            sx={{
                                display: "block",
                                mb: 0.5,
                                color: phoneError ? "#d32f2f" : "rgba(0,0,0,0.6)",
                                fontWeight: 500,
                            }}
                        >
                        </Typography>

                        <PhoneInput
                            country={"us"}
                            value={phoneNumber}
                            onChange={(value) => {
                                setPhoneNumber(value);
                                if (phoneError) setPhoneError("");
                            }}
                            inputStyle={{
                                width: "100%",
                                height: "56px",
                                fontSize: "16px",
                                borderRadius: "4px",
                                border: phoneError
                                    ? "2px solid #d32f2f"
                                    : "1px solid rgba(0,0,0,0.23)",
                                paddingLeft: "48px",
                                transition: "border-color 0.2s, box-shadow 0.2s",
                            }}
                            buttonStyle={{
                                border: "none",
                                background: "transparent",
                            }}
                            containerStyle={{
                                width: "100%",
                            }}
                            inputProps={{
                                required: true,
                                name: "phoneNumber",
                            }}
                        />

                        {phoneError && (
                            <Typography
                                variant="caption"
                                sx={{ color: "#d32f2f", mt: 0.5, display: "block" }}
                            >
                                {phoneError}
                            </Typography>
                        )}
                    </Box>



                    {/* Country Dropdown */}
                    <Autocomplete
                        options={countries}
                        value={country}
                        onChange={(event, newValue) => setCountry(newValue)}
                        getOptionLabel={(option) => option || ""}
                        renderInput={(params) => (
                            <TextField {...params} label="Country" required variant="outlined" fullWidth margin="normal" />
                        )}
                        fullWidth
                    />

                    <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save Changes</Button>
                </form>
            </Box>
        </Modal>
    );
};

export default ProfileModal;
