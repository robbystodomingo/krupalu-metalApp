import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
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

export default function ProductPostModal({ open, handleClose }) {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    photos: null,
  });
  const [categories, setCategories] = useState([]);   // 👈 local state
  const [loading, setLoading] = useState(false);

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
      setFormData({ ...formData, photos: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("productName", formData.name);
      data.append("categoryId", formData.categoryId); // 👈 send ID
      data.append("description", formData.description);
      if (formData.photos) {
        Array.from(formData.photos).forEach((file) =>
          data.append("photos", file)
        );
      }

      await axios.post("/api/v1/sellerDashboard/posts/createPosting", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Product posted successfully!");
      handleClose();
    } catch (error) {
      console.error(error);
      alert("Failed to post product.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Add Product
        </Typography>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
        />

        {/* Dropdown populated from categories fetched here */}
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
          Upload Photos
          <input
            type="file"
            name="photos"
            hidden
            multiple
            onChange={handleChange}
          />
        </Button>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button variant="contained" color="success" onClick={handleSubmit}>
            OK
          </Button>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
