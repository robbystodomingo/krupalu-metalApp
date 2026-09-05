import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import ProductPostModal from "../modals/ProductPostModal";
import PostDetailModal from "../modals/PostDetailModal";

export default function SellerDashboard() {
  const [posts, setPosts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [sortBy, setSortBy] = useState("name");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  // Fetch all postings
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "/api/v1/sellerDashboard/posts/getAllPosting",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        let data = response.data;

        // Apply sorting
        data.sort((a, b) => {
          if (sortBy === "name") {
            return a.productName.localeCompare(b.productName);
          } else if (sortBy === "category") {
            return a.categoryName.localeCompare(b.categoryName);
          } else if (sortBy === "date") {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return 0;
        });

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [sortBy]);

  const handleCardClick = (id) => {
    setSelectedProductId(id);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedProductId(null);
  };

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    axios
      .get("/api/v1/sellerDashboard/posts/getAllPosting", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error refreshing posts:", err));
  };

  const handlePostDeleted = (deletedId) => {
    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== deletedId));
  };

  // Pagination logic
  const startIndex = (page - 1) * pageSize;
  const paginatedPosts = posts.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(posts.length / pageSize);

  return (
    <Box sx={{ flexGrow: 1, p: 4, mt: 6 }}>
      {/* Header under Navbar */}
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>

      {/* Controls row: button + dropdown side by side */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
        >
          Create Posting
        </Button>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="category">Category</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Product cards */}
      <Grid container spacing={4}>
        {paginatedPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card
              onClick={() => handleCardClick(post.id)}
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.03)",
                  boxShadow: 6,
                },
              }}
            >
              {post.photos && post.photos.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={post.photos[0]}
                  alt={post.productName}
                />
              )}
              <CardContent>
                <Typography variant="h6">{post.productName}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {post.categoryName}
                </Typography>
                <Typography variant="body2" mt={1}>
                  {post.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Modals */}
      <ProductPostModal open={openModal} handleClose={handleCloseModal} />
      <PostDetailModal
        open={openDetailModal}
        handleClose={handleCloseDetailModal}
        productId={selectedProductId}
        onPostDeleted={handlePostDeleted}
      />
    </Box>
  );

}
