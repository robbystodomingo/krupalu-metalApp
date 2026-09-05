import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import Slider from "react-slick";
import axios from "axios";

const PostDetailModal = ({ open, handleClose, productId, onPostDeleted }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!open || !productId) return;

    const token = localStorage.getItem("token");
    axios
      .get(`/api/v1/sellerDashboard/posts/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPost(res.data))
      .catch((err) => console.error("Error fetching product:", err));
  }, [open, productId]);

  if (!post) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  const handleDelete = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(`/api/v1/sellerDashboard/posts/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Post deleted successfully");
        onPostDeleted(productId); // ✅ update parent state
        handleClose();            // ✅ close modal
      })
      .catch((err) => console.error("Error deleting post:", err));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* Carousel for product photos */}
        {post.photoUrls && post.photoUrls.length > 0 && (
          <Slider {...settings}>
            {post.photoUrls.map((photo, index) => (
              <Box key={index} sx={{ textAlign: "center" }}>
                <img
                  src={photo}
                  alt={`${post.productName} ${index + 1}`}
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              </Box>
            ))}
          </Slider>
        )}

        {/* Product details */}
        <Typography variant="h6" mt={3}>
          {post.productName}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {post.categoryName}
        </Typography>
        <Typography variant="body1" mt={2}>
          {post.description}
        </Typography>

        {/* Delete button */}
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          sx={{ mt: 3 }}
        >
          Delete Post
        </Button>
      </Box>
    </Modal>
  );
};

export default PostDetailModal;
