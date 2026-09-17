import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Pagination,
  Modal,
  Button,
  Divider,
  TextField,
  IconButton,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

import { showConfirmation } from "../utils/ConfirmationModal";

function AdvertiserCard({ name, country, requirement, approvalStatus, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: "100%",
        aspectRatio: "14 / 9",
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
          sx={{
            mt: 1,
            fontStyle: "italic",
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {requirement || "No requirement available"}
        </Typography>
        <Typography
          variant="caption"
          sx={{ mt: 1, color: approvalStatus === "APPROVED" ? "green" : "orange" }}
        >
          Status: {approvalStatus}
        </Typography>
      </CardContent>
    </Card>
  );
}



export default function AdvertisersList() {
  const [advertisers, setAdvertisers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedAdvertiser, setSelectedAdvertiser] = useState(null);

  const role = localStorage.getItem("role")?.toUpperCase();

  // reusable fetch function
  const fetchAdvertisers = () => {
    let endpoint = null;
    if (role === "SELLER") {
      endpoint = "/api/v1/sellerDashboard/advertisersList";
    } else if (role === "BUYER") {
      endpoint = "/api/v1/buyerDashboard/advertisersList";
    }

    if (endpoint) {
      axios
        .get(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setAdvertisers(res.data))
        .catch((err) => console.error("Error fetching advertisers:", err));
    }
  };

  useEffect(() => {
    fetchAdvertisers();
  }, [role]);

  // Filter advertisers by search term
  const filteredAdvertisers = advertisers.filter(
    (adv) =>
      adv.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adv.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination AFTER filtering
  const startIndex = (page - 1) * pageSize;
  const paginatedAdvertisers = filteredAdvertisers.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(filteredAdvertisers.length / pageSize);

  const handleCardClick = (advertiser) => {
    setSelectedAdvertiser(advertiser);
    setOpenModal(true);
  };

  const handleSendEmail = () => {
    axios
      .post(
        `/api/v1/email/offerAdvertiser?fullName=${encodeURIComponent(
          selectedAdvertiser.fullName
        )}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setOpenModal(false); // close request modal
        showConfirmation({
          title: "Email Sent",
          message: `Your request to contact ${selectedAdvertiser.fullName} has been sent to Admin.`,
          confirmText: "OK",
        }).then(() => {
          // re-fetch advertisers after closing confirmation modal
          fetchAdvertisers();
        });
      })
      .catch((err) => console.error("Error sending email:", err));
  };

  return (
    <Box sx={{ p: 3, mt: 4 }}>
      <Box textAlign="center" mb={4}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" gutterBottom>
            Advertisers List
          </Typography>

          <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "left", mb: 2 }}
          >
            Browse advertisers from around the world. Click a card to request Admin
            to offer them your product for advertisement.
          </Typography>
        </Box>
      </Box>

      {/* Search bar */}
      <Box display="flex" justifyContent="flex-start" mb={3}>
        <TextField
          label="Search Advertiser by Name or Country"
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
      {/* Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 280px)", // exactly 5 fixed-width columns
          gap: 3, // matches your old spacing={3}
          justifyContent: "flex-start", // centers the WHOLE grid block, not each row individually
        }}
      >
        {paginatedAdvertisers.map((advertiser, index) => (
          <AdvertiserCard
            key={index}
            name={advertiser.fullName}
            country={advertiser.country}
            requirement={advertiser.requirement}
            approvalStatus={advertiser.approvalStatus}  
            onClick={() => handleCardClick(advertiser)}
          />
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

      {/* Request Modal */}
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
            Request Admin to offer {selectedAdvertiser?.fullName} my product for advertisement.
          </Typography>

          <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

          <Box sx={{ textAlign: "left", mb: 3 }}>
            <Typography variant="subtitle1"><strong>Name:</strong> {selectedAdvertiser?.fullName}</Typography>
            <Typography variant="subtitle1"><strong>Country:</strong> {selectedAdvertiser?.country}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Requirements:</strong> {selectedAdvertiser?.requirement || "No requirement provided"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Approval Status:</strong> {selectedAdvertiser?.approvalStatus}
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
