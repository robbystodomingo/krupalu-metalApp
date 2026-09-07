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

export default function ProductModal({ open = false, handleClose, product, mode = "create", onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
        description: "",
        photos: [],
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewUrls, setPreviewUrls] = useState([]);

    const navigate = useNavigate();

    // Sync formData when product changes (edit mode)
    useEffect(() => {
        if (mode === "edit" && product) {
            setFormData({
                name: product.productName || "",
                categoryId: product.categoryId || "",
                description: product.description || "",
                photos: [],
            });
            setPreviewUrls(product.photoUrls || []);
        } else if (mode === "create") {
            setFormData({ name: "", categoryId: "", description: "", photos: [] });
            setPreviewUrls([]);
        }
    }, [product, mode]);

    // Fetch categories when modal opens
    useEffect(() => {
        if (open) {
            const fetchCategories = async () => {
                setLoading(true);
                try {
                    const res = await axios.get("/api/v1/sellerDashboard/categories", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    setCategories(res.data);
                } catch (err) {
                    console.error("Error fetching categories:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchCategories();
        }
    }, [open]);

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
            if (formData.name) data.append("productName", formData.name);
            if (formData.categoryId) data.append("categoryId", formData.categoryId);
            if (formData.description) data.append("description", formData.description);
            if (formData.photos.length > 0) {
                formData.photos.forEach((file) => data.append("photos", file));
            }

            const token = localStorage.getItem("token");

            if (mode === "create") {
                await axios.post("/api/v1/sellerDashboard/posts/createPosting", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await axios.put(`/api/v1/sellerDashboard/posts/edit/${product.id}`, data, {
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

            navigate("/seller");
        } catch (error) {
            console.error(error);
            alert(`Failed to ${mode === "create" ? "post" : "update"} product.`);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    {mode === "create" ? "Add Product" : "Edit Product"}
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
                    select
                    fullWidth
                    label="Category"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    margin="normal"
                >
                    {loading ? (
                        <MenuItem disabled>Loading categories...</MenuItem>
                    ) : categories.length === 0 ? (
                        <MenuItem disabled>No categories available</MenuItem>
                    ) : (
                        categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.categoryName}
                            </MenuItem>
                        ))
                    )}
                </TextField>

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
