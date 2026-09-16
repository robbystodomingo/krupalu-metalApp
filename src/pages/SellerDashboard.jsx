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
  Chip,
} from "@mui/material";
import axios from "axios";
import PostDetailModal from "../modals/PostDetailModal";
import ProductModal from "../modals/ProductModal";
import { showConfirmation } from "../utils/ConfirmationModal";

const STATUS_CHIP_PROPS = {
  PENDING: { label: "Pending Review", color: "warning" },
  APPROVED: { label: "Approved", color: "success" },
  REJECTED: { label: "Rejected", color: "error" },
};

function StatusChip({ status }) {
  const props = STATUS_CHIP_PROPS[status] || { label: status || "Unknown", color: "default" };
  return <Chip size="small" label={props.label} color={props.color} sx={{ fontWeight: 600 }} />;
}

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

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/v1/sellerDashboard/posts/getAllPosting", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      let data = res.data;

      const role = localStorage.getItem("role")?.toUpperCase();

      if (role === "BUYER" || role === "ADVERTISER") {
        data = data.filter((post) => post.approvalStatus === "APPROVED");
      }

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

  const handleCardClick = (id) => {
    setSelectedProductId(id);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedProductId(null);
  };

  const startIndex = (page - 1) * pageSize;
  const paginatedPosts = posts.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(posts.length / pageSize);

  return (
    <Box sx={{ p: 3, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>

      <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

      {/* Controls row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, py: 2 }}>
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
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 3,
          mb: 2,
        }}
      >
        {paginatedPosts.map((post) => (
          <Card
            key={post.id}
            onClick={() => handleCardClick(post.id)}
            sx={{
              cursor: "pointer",
              width: "100%",
              aspectRatio: "5 / 8",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px) scale(1.03)",
                boxShadow: 6,
              },
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
                    sx={{ height: "58%", objectFit: "cover" }}
                    image={firstImage}
                    alt={post.productName}
                  />
                )
              );
            })()}

            <CardContent
              sx={{
                flexGrow: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" noWrap>
                {post.productName}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" noWrap>
                {post.categoryName}
              </Typography>
              <Typography
                variant="body2"
                mt={1}
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "normal",
                }}
              >
                {post.description}
              </Typography>

              <Box sx={{ mt: "auto", pt: 1 }}>
                <StatusChip status={post.approvalStatus} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

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
        onSuccess={() => {
          setCreateOpen(false);
          showConfirmation({
            title: "Product for review",
            message: "Your product has been submitted for approval.",
            confirmText: "OK",
          }).then(() => {
            fetchPosts();
          });
        }}
      />

      <ProductModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        product={selectedProduct}
        mode="edit"
        onSuccess={() => {
          setEditOpen(false);
          showConfirmation({
            title: "Product Updated",
            message: "Your product has been successfully updated.",
            confirmText: "OK",
          }).then(() => {
            fetchPosts();
          });
        }}
      />

      <PostDetailModal
        open={openDetailModal}
        handleClose={handleCloseDetailModal}
        productId={selectedProductId}
        onPostDeleted={(deletedId) => {
          setPosts((prev) => prev.filter((p) => p.id !== deletedId));
          showConfirmation({
            title: "Product Deleted",
            message: "The product has been successfully deleted.",
            confirmText: "OK",
          }).then(() => {
            fetchPosts();
          });
        }}
        onEdit={(post) => {
          setSelectedProduct(post);
          setEditOpen(true);
        }}
      />
    </Box>
  );
}