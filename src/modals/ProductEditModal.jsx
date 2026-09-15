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

export default function ProductEditModal({ open = false, handleClose, product }) {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    photos: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Sync formData whenever product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.productName || "",
        categoryId: product.categoryId || "",
        description: product.description || "",
        photos: [],
      });
      setPreviewUrls(product.photoUrls || []);
    }
  }, [product]);

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

  // When uploading new files
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photos") {
      const fileArray = Array.from(files).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      setFormData((prev) => ({ ...prev, photos: fileArray }));
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
        formData.photos.forEach((photoObj) => data.append("photos", photoObj.file));
      }

      await axios.put(`/api/v1/sellerDashboard/posts/edit/${product.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Product updated successfully!");
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update product.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Edit Product
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

        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload New Photos
          <input
            type="file"
            name="photos"
            hidden
            multiple
            onChange={handleChange}
          />
        </Button>

        {formData.photos.length > 0 && (
          <Box mt={2} sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {formData.photos.map((photoObj, idx) => (
              <Box
                key={idx}
                sx={{
                  position: "relative",
                  width: 100,
                  height: 100,
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={photoObj.previewUrl}
                  alt={`preview-${idx}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 1,
                  }}
                />

                {/* Delete button */}
                <Button
                  size="small"
                  color="error"
                  variant="contained"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      photos: prev.photos.filter((_, i) => i !== idx),
                    }));
                  }}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    minWidth: "auto",
                    p: "2px 6px",
                    fontSize: "0.7rem",
                  }}
                >
                  ✕
                </Button>

                {/* Replace button */}
                <Button
                  size="small"
                  variant="contained"
                  component="label"
                  sx={{
                    position: "absolute",
                    bottom: 4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    minWidth: "auto",
                    p: "2px 6px",
                    fontSize: "0.7rem",
                  }}
                >
                  Change
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const newPhoto = {
                          file,
                          previewUrl: URL.createObjectURL(file),
                        };
                        setFormData((prev) => {
                          const newPhotos = [...prev.photos];
                          newPhotos[idx] = newPhoto;
                          return { ...prev, photos: newPhotos };
                        });
                      }
                    }}
                  />
                </Button>
              </Box>
            ))}
          </Box>
        )}



        <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

        <Box display="flex" justifyContent="flex-end" sx={{ mt: 2, width: "100%" }} gap={2}>
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
