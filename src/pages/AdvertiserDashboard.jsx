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
import AdvertisementDetailModal from "../modals/AdvertisementDetailModal";
import AdvertisementModal from "../modals/AdvertisementModal";
import { showConfirmation } from "../utils/ConfirmationModal";

export default function AdvertiserDashboard() {
  const [advertisements, setAdvertisements] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [sortBy, setSortBy] = useState("name");

  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedAdvertisementId, setSelectedAdvertisementId] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);

  // Unified fetch function
  const fetchAdvertisements = async () => {
    try {
      const res = await axios.get("/api/v1/advertiserDashboard/advertisements/getAllAdvertisements", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      let data = res.data;

      // Apply sorting
      data.sort((a, b) => {
        if (sortBy === "name") {
          return a.advertisementName.localeCompare(b.advertisementName);
        } else if (sortBy === "date") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });

      setAdvertisements(data);
    } catch (err) {
      console.error("Error fetching advertisements:", err);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, [sortBy]);

  // Handlers
  const handleCardClick = (id) => {
    setSelectedAdvertisementId(id);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedAdvertisementId(null);
  };

  // Pagination
  const startIndex = (page - 1) * pageSize;
  const paginatedAdvertisements = advertisements.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(advertisements.length / pageSize);

  return (

    <Box sx={{ p: 3, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Advertiser Dashboard
      </Typography>
      <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

      {/* Controls row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4, p: 5 }}>
        <Button variant="contained" color="primary" onClick={() => setCreateOpen(true)}>
          Post Advertisement
        </Button>

        <FormControl size="medium" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Product cards */}
      <Grid container spacing={5} sx={{ justifyContent: "center", mb: 2, p: 3 }}>
        {paginatedAdvertisements.map((advertisement) => (
          <Grid item xs={12} sm={6} md={4} key={advertisement.id}>
            <Card
              onClick={() => handleCardClick(advertisement.id)}
              sx={{
                cursor: "pointer",
                minWidth: 200,
                maxWidth: 250,
                minHeight: 340,
                maxHeight: 380,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px) scale(1.03)",
                  boxShadow: 6,
                },
                margin: "0 auto",
              }}
            >
              {(() => {
                const firstImage = advertisement.photoUrls?.[0];

                return (
                  firstImage && (
                    <CardMedia
                      ccomponent="img"
                      sx={{ height: 180, objectFit: "cover" }}
                      image={firstImage}
                      alt={advertisement.advertisementName || "Advertisement"}
                    />
                  )
                );
              })()}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{advertisement.advertisementName}</Typography>
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
                  {advertisement.description}
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
      <AdvertisementModal
        open={createOpen}
        handleClose={() => setCreateOpen(false)}
        mode="create"
        onSuccess={() => {
          showConfirmation({
            title: "Advertisement Listed",
            message: "Your advertisement has been successfully listed.",
            confirmText: "OK",
          }).then(() => {
            fetchAdvertisements();
          });
        }}
      />

      <AdvertisementModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        advertisement={selectedAdvertisement}
        mode="edit"
        onSuccess={() => {
          showConfirmation({
            title: "Advertisement Updated",
            message: "Your advertisement has been successfully updated.",
            confirmText: "OK",
          }).then(() => {
            fetchAdvertisements();
          });
        }}
      />

      <AdvertisementDetailModal
        open={openDetailModal}
        handleClose={handleCloseDetailModal}
        advertisementId={selectedAdvertisementId}
        onPostDeleted={(deletedId) => {
          setAdvertisements((prev) => prev.filter((p) => p.id !== deletedId));
          showConfirmation({
            title: "Advertisement Deleted",
            message: "The advertisement has been successfully deleted.",
            confirmText: "OK",
          }).then(() => {
            fetchAdvertisements();
          });
        }}
        onEdit={(advertisements) => {
          setSelectedAdvertisement(advertisements);
          setEditOpen(true);
        }}
      />
    </Box>
  );


}