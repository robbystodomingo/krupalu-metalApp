import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, Divider, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos, Close } from "@mui/icons-material";
import Slider from "react-slick";
import axios from "axios";

const PostDetailModal = ({ open = false, handleClose, productId, onPostDeleted, onEdit }) => {
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

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <IconButton
        onClick={onClick}
        sx={{ position: "absolute", right: -25, top: "40%", zIndex: 1 }}
      >
        <ArrowForwardIos />
      </IconButton>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <IconButton
        onClick={onClick}
        sx={{ position: "absolute", left: -25, top: "40%", zIndex: 1 }}
      >
        <ArrowBackIos />
      </IconButton>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const handleDelete = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(`/api/v1/sellerDashboard/posts/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        onPostDeleted(productId);
        handleClose();
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
          width: 900, // was 600 — more room overall, and for the photo carousel especially
          maxWidth: "90vw", // keeps it from overflowing on smaller screens
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* Close button, upper right */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
          }}
        >
          <Close />
        </IconButton>

        {/* Carousel for product photos */}
        {post.photoUrls && post.photoUrls.length > 0 && (
          <Slider {...settings}>
            {post.photoUrls.map((photo, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: "center",
                  height: 500, // fixed viewing area, was capped only by maxHeight before
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.100", // fills empty space around non-matching aspect ratios neutrally
                  borderRadius: 2,
                }}
              >
                <img
                  src={photo}
                  alt={`${post.productName} ${index + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain", // was "cover" — this is what preserves true aspect ratio, no cropping
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

        <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete Post
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onEdit(post);
              handleClose();
            }}
          >
            Edit Post
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PostDetailModal;