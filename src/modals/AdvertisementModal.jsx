import React, { useState, useEffect } from "react";
import {
    Modal,
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function AdvertisementModal({ open = false, handleClose, advertisement, mode = "create", onSuccess }) {
    const [formData, setFormData] = useState({
        advertisementName: "",
        description: "",
        photos: [],
    });
    const [previewUrls, setPreviewUrls] = useState([]);

    const navigate = useNavigate();

    // Sync formData when product changes (edit mode)
    useEffect(() => {
        if (mode === "edit" && advertisement) {
            setFormData({
                name: advertisement.advertisementName || "",
                description: advertisement.description || "",
                photos: advertisement.photos || [],
            });
            setPreviewUrls(advertisement.photoUrls || []);
        } else if (mode === "create") {
            setFormData({ advertisementName: "", description: "", photos: [] });
            setPreviewUrls([]);
        }
    }, [advertisement, mode]);

    console.log("Advertisement prop:", advertisement);


    
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "photos") {
            const fileArray = Array.from(files);
            setFormData((prev) => ({ ...prev, photos: fileArray }));
            const urls = fileArray.map((file) => URL.createObjectURL(file));
            setPreviewUrls(urls);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            if (formData.name) data.append("advertisementName", formData.name);
            if (formData.description) data.append("description", formData.description);
            if (formData.photos.length > 0) {
                formData.photos.forEach((file) => data.append("photos", file));
            }

            const token = localStorage.getItem("token");

            if (mode === "create") {
                await axios.post("/api/v1/advertiserDashboard/advertisements/createAdvertisement", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.put(`/api/v1/advertiserDashboard/advertisements/edit/${advertisement.id}`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            handleClose();

            if (onSuccess) {
                onSuccess();
            }

            navigate("/advertiser");
        } catch (error) {
            console.error(error);
            alert(`Failed to ${mode === "create" ? "post" : "update"} advertisement.`);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    {mode === "create" ? "Post Advertisement" : "Edit Advertisement"}
                </Typography>

                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                />

                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    margin="normal"
                />

                <Button variant="contained" component="label" sx={{ mt: 3 }}>
                    {mode === "create" ? "Upload Photos" : "Upload New Photos"}
                    <input
                        type="file"
                        name="photos"
                        hidden
                        multiple
                        onChange={handleChange}
                    />
                </Button>

                {previewUrls.length > 0 && (
                    <Box mt={2} sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 3 }}>
                        {previewUrls.map((url, idx) => (
                            <Box
                                key={idx}
                                component="img"
                                src={url}
                                alt={`preview-${idx}`}
                                sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 1 }}
                            />
                        ))}
                    </Box>
                )}

                <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

                <Box display="flex" justifyContent="flex-end" sx={{ mt: 2, width: "100%" }} gap={3}>
                    <Button variant="contained" color="success" onClick={handleSubmit}>
                        {mode === "create" ? "Post" : "Save Changes"}
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleClose}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
