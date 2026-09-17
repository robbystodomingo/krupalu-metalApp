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

function BuyerCard({ name, country, requirement, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: "100%", // fills whatever column width the grid gives it
        aspectRatio: "14 / 9", // keeps roughly your original 280:180 proportions, but scales fluidly
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

export default function BuyersList() {
  const [buyers, setBuyers] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const role = localStorage.getItem("role")?.toUpperCase();

  useEffect(() => {
    let endpoint = null;
    if (role === "SELLER") {
      endpoint = "/api/v1/sellerDashboard/buyersList";
    } else if (role === "ADVERTISER") {
      endpoint = "/api/v1/advertiserDashboard/buyersList";
    }

    if (endpoint) {
      axios
        .get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setBuyers(res.data))
        .catch((err) => console.error("Error fetching buyers:", err));
    }
  }, [role]);


  const filteredBuyers = buyers.filter(
    (buyer) =>
      buyer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      buyer.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedBuyers = filteredBuyers.slice(
    startIndex,
    startIndex + rowsPerPage
  );
  const totalPages = Math.ceil(filteredBuyers.length / rowsPerPage);

  const handleCardClick = (buyer) => {
    setSelectedBuyer(buyer);
    setOpenModal(true);
  };

  const handleSendEmail = () => {
    axios
      .post(
        `/api/v1/email/offerBuyer?fullName=${encodeURIComponent(
          selectedBuyer.fullName
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
          message: `Your request to contact ${selectedBuyer.fullName} has been sent to Admin.`,
          confirmText: "OK",
        }).then(() => {
          axios
            .get(
              role === "SELLER"
                ? "/api/v1/sellerDashboard/buyersList"
                : "/api/v1/advertiserDashboard/buyersList",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            )
            .then((res) => setBuyers(res.data))
            .catch((err) => console.error("Error refreshing buyers:", err));
        });
      })
      .catch((err) => console.error("Error sending email:", err));
  };


  return (
    <Box sx={{ p: 3, mt: 4 }}>
      <Box textAlign="center" mb={4}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom>
            Buyers List
          </Typography>
          <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />
        </Box>
        <Box>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "left", mb: 2 }}
          >
            Browse buyers from around the world. Click a card to request Admin to
            offer them your product.
          </Typography>
        </Box>
      </Box>


      {/* Search bar */}
      <Box display="flex" justifyContent="flex-start" mb={3}>
        <TextField
          label="Search Buyer by Name or Country"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1); // reset to first page when searching
          }}
          sx={{ width: 400 }}
        />
      </Box>

      {/* Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 300px)", // exactly 5 fixed-width columns
          gap: 3, // matches your old spacing={3}
          justifyContent: "flex-start", // centers the WHOLE grid block, not each row individually
        }}>

        {paginatedBuyers.map((buyer, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <BuyerCard
              name={buyer.fullName}
              country={buyer.country}
              requirement={buyer.requirement}
              onClick={() => handleCardClick(buyer)}
            />
          </Grid>
        ))}
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
          {/* X Close button */}
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Request Admin to offer {selectedBuyer?.fullName} my product.
          </Typography>

          <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Typography variant="subtitle1"><strong>Name:</strong> {selectedBuyer?.fullName}</Typography>
            <Typography variant="subtitle1"><strong>Country:</strong> {selectedBuyer?.country}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Requirements:</strong> {selectedBuyer?.requirement || "No requirement provided"}
            </Typography>
          </Box>

          <Button variant="contained" color="primary" onClick={handleSendEmail}>
            Send Request to Admin
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
