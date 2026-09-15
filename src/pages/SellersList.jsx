import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  Pagination,
  Modal,
  Button,
  TextField,
  IconButton,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import { showConfirmation } from "../utils/ConfirmationModal";

function SellerCard({ name, country, requirement, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: 280,
        height: 180,
        border: "1px solid #eee",
        boxShadow: 2,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px) scale(1.05)",
          boxShadow: 6,
          cursor: "pointer",
        },
        textAlign: "center",
        borderRadius: 2,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" gutterBottom>
          {name}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {country}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
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
          {requirement}
        </Typography>
      </CardContent>
    </Card>
  );
}

function ProductDetails({ product }) {
  if (!product) return null;

  // Rendered only if present, so this is safe even if your API doesn't return these fields.
  const extraFields = [
    { label: "Price", value: product.price },
    { label: "Quantity", value: product.quantity },
    { label: "Unit", value: product.unit },
    { label: "Category", value: product.category },
    { label: "Origin", value: product.origin },
    { label: "SKU", value: product.sku },
  ].filter((f) => f.value !== undefined && f.value !== null && f.value !== "");

  return (
    <Box>
      <Grid container spacing={2}>
        {product.photoUrls && product.photoUrls.length > 0 && (
          <Grid item xs={12} sm={5}>
            <CardMedia
              component="img"
              image={product.photoUrls[0]}
              alt={product.productName}
              sx={{
                width: "100%",
                height: 220,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
            {product.photoUrls.length > 1 && (
              <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                {product.photoUrls.slice(1).map((url, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={url}
                    alt={`${product.productName} ${idx + 2}`}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 1,
                      border: "1px solid #ddd",
                    }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        )}

        <Grid item xs={12} sm={product.photoUrls?.length ? 7 : 12}>
          <Typography variant="h6" gutterBottom>
            {product.productName}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: "pre-line", mb: 2 }}
          >
            {product.description || "No description provided."}
          </Typography>

          {extraFields.length > 0 && (
            <Box>
              <Divider sx={{ mb: 1 }} />
              <Grid container spacing={1}>
                {extraFields.map((field) => (
                  <Grid item xs={6} key={field.label}>
                    <Typography variant="caption" color="text.secondary">
                      {field.label}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {field.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default function SellersList() {
  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);

  // New: separate state for the product details modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openProductModal, setOpenProductModal] = useState(false);

  const role = localStorage.getItem("role")?.toUpperCase();

  const fetchSellers = useCallback(() => {
    let endpoint = null;
    if (role === "BUYER") {
      endpoint = "/api/v1/buyerDashboard/sellersList";
    } else if (role === "ADVERTISER") {
      endpoint = "/api/v1/advertiserDashboard/sellersList";
    }

    if (endpoint) {
      return axios
        .get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setSellers(res.data))
        .catch((err) => console.error("Error fetching sellers:", err));
    }
    return Promise.resolve();
  }, [role]);

  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.requirement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedSellers = filteredSellers.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(filteredSellers.length / rowsPerPage);

  const handleCardClick = (seller) => {
    setSelectedSeller(seller);
    setOpenModal(true);
    setSelectedProduct(null);
    setSellerProducts([]);

    const roleLocal = localStorage.getItem("role")?.toUpperCase();
    let endpoint = "";

    if (roleLocal === "BUYER") {
      endpoint = `/api/v1/buyerDashboard/sellerProducts/${seller.id}`;
    } else if (roleLocal === "ADVERTISER") {
      endpoint = `/api/v1/advertiserDashboard/sellerProducts/${seller.id}`;
    }

    axios.get(endpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => setSellerProducts(res.data))
      .catch((err) => console.error("Error fetching seller products:", err));
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setOpenProductModal(true);
  };

  const closeProductModal = () => {
    setOpenProductModal(false);
    setSelectedProduct(null);
  };

  const closeSellerModal = () => {
    setOpenModal(false);
    setSelectedSeller(null);
    setSellerProducts([]);
    setSelectedProduct(null);
  };

  const handleSendEmail = () => {
    if (!selectedProduct || !selectedSeller) return;

    axios
      .post(
        `/api/v1/email/intentToPurchase?fullName=${encodeURIComponent(
          selectedSeller.fullName
        )}&productId=${selectedProduct.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        const seller = selectedSeller;
        const product = selectedProduct;

        setOpenProductModal(false);
        setOpenModal(false);
        setSelectedSeller(null);
        setSellerProducts([]);
        setSelectedProduct(null);

        showConfirmation({
          title: "Email Sent",
          message: `Your request to contact ${seller.fullName} about ${product.productName} has been sent to Admin.`,
          confirmText: "OK",
        }).then(() => {
          fetchSellers();
        });
      })
      .catch((err) => console.error("Error sending email:", err));
  };

  return (
    <Box sx={{ p: 3, mt: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Sellers List
        </Typography>
        <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />
        <Typography
          variant="body1"
            color="text.secondary"
            sx={{ textAlign: "left", mb: 2 }}
        >
          Browse sellers from around the world. Click a card to see their
          products. Select a product to request Admin to connect you.
        </Typography>
      </Box>

      <Box display="flex" justifyContent="flex-start" mb={3}>
        <TextField
          label="Search Seller by Name or Country"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          sx={{ width: 400 }}
        />
      </Box>

      <Box  sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 300px)", // exactly 5 fixed-width columns
          gap: 3, // matches your old spacing={3}
          justifyContent: "flex-start", // centers the WHOLE grid block, not each row individually
        }}>
        
          {paginatedSellers.map((seller, index) => (
            <Grid item xs={12} sm={6} md={4} key={seller.id || index}>
              <SellerCard
                name={seller.fullName}
                country={seller.country}
                requirement={seller.requirement}
                onClick={() => handleCardClick(seller)}
              />
            </Grid>
          ))}
        
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, p: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Seller Products Modal */}
      <Modal open={openModal} onClose={closeSellerModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: { xs: "90%", sm: 700 },
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeSellerModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Products from {selectedSeller?.fullName}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {sellerProducts.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No products available.
                </Typography>
              </Grid>
            )}

            {sellerProducts.map((product) => (
              <Grid item xs={12} sm={6} key={product.id}>
                <Card
                  onClick={() => handleProductClick(product)}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    border: "1px solid #eee",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  {product.photoUrls && product.photoUrls.length > 0 && (
                    <CardMedia
                      component="img"
                      image={product.photoUrls[0]}
                      alt={product.productName}
                      sx={{ height: 140, objectFit: "cover" }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {product.productName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>

      {/* Product Details Modal (nested on top of the seller products modal) */}
      <Modal open={openProductModal} onClose={closeProductModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: { xs: "90%", sm: 600 },
            maxHeight: "85vh",
            overflowY: "auto",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={closeProductModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Product Details
          </Typography>
          <Divider sx={{ my: 2 }} />

          <ProductDetails product={selectedProduct} />

          <Box mt={3} textAlign="center">
            <Button variant="contained" color="primary" onClick={handleSendEmail}>
              Send Request to Admin
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
