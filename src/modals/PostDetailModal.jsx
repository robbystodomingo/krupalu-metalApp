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

  // Custom Next button
  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <Button
        onClick={onClick}
        variant="contained"
        color="primary"
        sx={{
          position: "absolute",
          right: -80,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      >
        Next <ArrowForwardIos sx={{ ml: 1, fontSize: "1rem" }} />
      </Button>
    );
  };

  // Custom Previous button
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <Button
        onClick={onClick}
        variant="contained"
        color="primary"
        sx={{
          position: "absolute",
          left: -80,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
        }}
      >
        <ArrowBackIos sx={{ mr: 1, fontSize: "1rem" }} /> Previous
      </Button>
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
          width: 900,
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* Close button */}
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

        {/* Carousel with Previous/Next buttons */}
        {post.photoUrls && post.photoUrls.length > 0 && (
          <Slider {...settings}>
            {post.photoUrls.map((photo, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: "center",
                  height: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.100",
                  borderRadius: 2,
                }}
              >
                <img
                  src={photo}
                  alt={`${post.productName} ${index + 1}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
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
