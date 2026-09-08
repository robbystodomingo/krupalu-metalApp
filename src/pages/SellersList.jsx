import React, { useEffect, useState } from "react";
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

export default function SellersList() {
  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const role = localStorage.getItem("role")?.toUpperCase();

  useEffect(() => {
    let endpoint = null;
    if (role === "BUYER") {
      endpoint = "/api/v1/buyerDashboard/sellersList";
    } else if (role === "ADVERTISER") {
      endpoint = "/api/v1/advertiserDashboard/sellersList";
    }

    if (endpoint) {
      axios
        .get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setSellers(res.data))
        .catch((err) => console.error("Error fetching sellers:", err));
    }
  }, [role]);

  // Filter sellers by search term
  const filteredSellers = sellers.filter(
    (seller) =>
      seller.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.requirement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply pagination AFTER filtering
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedSellers = filteredSellers.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(filteredSellers.length / rowsPerPage);

  const handleCardClick = (seller) => {
    setSelectedSeller(seller);
    setOpenModal(true);
  };

  const handleSendEmail = () => {
    axios
      .post(
        `/api/v1/email/offerSeller?fullName=${encodeURIComponent(
          selectedSeller.fullName
        )}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setOpenModal(false);

        showConfirmation({
          title: "Email Sent",
          message: `Your request to contact ${selectedSeller.fullName} has been sent to Admin.`,
          confirmText: "OK",
        }).then(() => {
          // re-fetch sellers list
          axios
            .get(
              role === "BUYER"
                ? "/api/v1/buyerDashboard/sellersList"
                : "/api/v1/advertiserDashboard/sellersList",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            .then((res) => setSellers(res.data))
            .catch((err) => console.error("Error refreshing sellers:", err));
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
          maxWidth="600px"
          mx="auto"
          sx={{ p: 3, mt: 4 }}
        >
          Browse sellers from around the world. Click a card to request Admin to
          connect you with their products.
        </Typography>
      </Box>

      {/* Search bar */}
      <Box display="flex" justifyContent="center" mb={3}>
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

      {/* Grid */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ maxWidth: 1500, margin: "0 auto" }}
        >
          {paginatedSellers.map((seller, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <SellerCard
                name={seller.fullName}
                country={seller.country}
                requirement={seller.requirement}
                onClick={() => handleCardClick(seller)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4, p: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Confirmation Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
            width: 500,
            textAlign: "center",
          }}
        >
          {/* Close button in top-right */}
          <IconButton
            aria-label="close"
            onClick={() => setOpenModal(false)}
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
            Request Admin to connect with {selectedSeller?.fullName}.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {selectedSeller?.requirement}
          </Typography>

          <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

          <Button variant="contained" color="primary" onClick={handleSendEmail}>
            Send Request to Admin
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
