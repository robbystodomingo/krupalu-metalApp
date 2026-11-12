import React, { useEffect, useRef, useState } from "react";
import { Modal, Box, Typography, Button, Divider, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import Slider from "react-slick";
import axios from "axios";

// Shared look for the round arrow buttons that sit on top of the photo.
const arrowButtonSx = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 3,
  width: { xs: 36, sm: 44 },
  height: { xs: 36, sm: 44 },
  bgcolor: "rgba(0,0,0,0.5)",
  color: "#fff",
  backdropFilter: "blur(4px)",
  transition: "background-color 0.2s ease, transform 0.2s ease",
  "&:hover": {
    bgcolor: "rgba(0,0,0,0.75)",
    transform: "translateY(-50%) scale(1.08)",
  },
};

const PostDetailModal = ({ open = false, handleClose, productId, onPostDeleted, onEdit }) => {
  const [post, setPost] = useState(null);
  const sliderRef = useRef(null);

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

  // Left/Right arrow keys switch photos while the modal is open
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "ArrowLeft") {
        sliderRef.current?.slickPrev();
      } else if (e.key === "ArrowRight") {
        sliderRef.current?.slickNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!post) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // built-in text buttons stay off; we draw our own round arrows below
  };

  const hasPhotos = post.photoUrls && post.photoUrls.length > 0;
  const hasMultiplePhotos = hasPhotos && post.photoUrls.length > 1;

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
            zIndex: 4,
          }}
        >
          <Close />
        </IconButton>

        {/* Carousel: arrow buttons, keyboard arrows, dots and swipe all work */}
        {hasPhotos && (
          <Box sx={{ position: "relative" }}>
            <Slider ref={sliderRef} {...settings}>
              {post.photoUrls.map((photo, index) => (
                // Outer div takes react-slick's inline styles so the inner Box keeps its flex centering
                <div key={index}>
                  <Box
                    sx={{
                      width: "100%",
                      height: { xs: 260, sm: 380, md: 500 }, // scales with screen size
                      maxHeight: "60vh",
                      overflow: "hidden",
                      bgcolor: "grey.100",
                      borderRadius: 2,
                    }}
                  >
                    <img
                      src={photo}
                      alt={`${post.productName} ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // fills the box, ignores the photo's original ratio (edges get cropped)
                        display: "block",
                      }}
                    />
                  </Box>
                </div>
              ))}
            </Slider>

            {hasMultiplePhotos && (
              <>
                <IconButton
                  aria-label="Previous photo"
                  onClick={() => sliderRef.current?.slickPrev()}
                  sx={{ ...arrowButtonSx, left: { xs: 8, sm: 14 } }}
                >
                  <ArrowBackIosNewRoundedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  aria-label="Next photo"
                  onClick={() => sliderRef.current?.slickNext()}
                  sx={{ ...arrowButtonSx, right: { xs: 8, sm: 14 } }}
                >
                  <ArrowForwardIosRoundedIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
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
