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
  Divider,
} from "@mui/material";
import axios from "axios";
import PostDetailModal from "../modals/PostDetailModal";
import ProductModal from "../modals/ProductModal";

export default function SellerDashboard() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortBy, setSortBy] = useState("name");

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Unified fetch function
  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/v1/sellerDashboard/posts/getAllPosting", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      let data = res.data;

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
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  // Handlers
  const handleCardClick = (id) => {
    setSelectedProductId(id);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedProductId(null);
  };

  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p.id !== deletedId));
  };

  // Pagination
  const startIndex = (page - 1) * pageSize;
  const paginatedPosts = posts.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(posts.length / pageSize);

  return (
    <Box sx={{ flexGrow: 1, p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>

      <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

      {/* Controls row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "left", mb: 4, p: 5 }}>
        <Button variant="contained" color="primary" onClick={() => setCreateOpen(true)}>
          Add Product
        </Button>

        <FormControl size="medium" sx={{ minWidth: 150 }}>
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
      <Grid container spacing={3} sx={{ display: "flex", justifyContent: "space-between", alignItems: "left", mb: 2, p: 3 }}>
        {paginatedPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card
              onClick={() => handleCardClick(post.id)}
              sx={{
                cursor: "pointer",
                flex: "1 1 auto",          // 👈 flexible sizing
                minWidth: 200,             // 👈 minimum width
                maxWidth: 280,             // 👈 maximum width
                minHeight: 300,            // 👈 minimum height
                maxHeight: 380,            // 👈 maximum height
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.03)",
                  boxShadow: 6,
                },
                margin: "0 auto",          // 👈 centers cards if row isn’t full
              }}
            >
              {(() => {
                const firstImage =
                  (post.photoUrls && post.photoUrls[0]) ||
                  (post.photos && post.photos[0]);
                return (
                  firstImage && (
                    <CardMedia
                      component="img"
                      sx={{
                        height: 180,
                        objectFit: "cover",
                      }}
                      image={firstImage}
                      alt={post.productName}
                    />
                  )
                );
              })()}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{post.productName}</Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {post.categoryName}
                </Typography>
                <Typography
                  variant="body2"
                  mt={1}
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                  }}
                >
                  {post.description}
                </Typography>
              </CardContent>
            </Card>

          </Grid>

        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, p: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Modals */}
      <ProductModal
        open={createOpen}
        handleClose={() => setCreateOpen(false)}
        mode="create"
        onSuccess={fetchPosts}
      />

      <ProductModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        product={selectedProduct}
        mode="edit"
        onSuccess={fetchPosts}
      />


      <PostDetailModal
        open={openDetailModal}
        handleClose={handleCloseDetailModal}
        productId={selectedProductId}
        onPostDeleted={handlePostDeleted}
        onEdit={(post) => {
          setSelectedProduct(post);
          setEditOpen(true);
        }}
      />


    </Box>
  );
}
