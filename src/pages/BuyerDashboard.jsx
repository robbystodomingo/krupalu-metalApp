import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Pagination,
} from "@mui/material";
import axios from "axios";

export default function BuyerDashboard() {
  const [requestedItems, setRequestedItems] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchRequestedItems = async () => {
    try {
      const res = await axios.get("/api/v1/buyerDashboard/requestedItems", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRequestedItems(res.data);
    } catch (err) {
      console.error("Error fetching requested items:", err);
    }
  };

  useEffect(() => {
    fetchRequestedItems();
  }, []);

  const startIndex = (page - 1) * pageSize;
  const paginatedItems = requestedItems.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(requestedItems.length / pageSize);

  return (
    <Box sx={{ p: 3, mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Buyer Dashboard
      </Typography>

      <Divider sx={{ my: 3, borderColor: "grey.700", borderBottomWidth: 2 }} />

      <Typography
        variant="body1"
        color="text.secondary"
        maxWidth="600px"
        mx="auto"
        sx={{ mb: 4, textAlign: "center"  }}
      >
        Here are the products you’ve requested from Admin.
      </Typography>

      {/* If no requested items */}
      {requestedItems.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="h4" color="text.secondary">
            No requested products yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Once you request a product from the Admin, it will appear here.
          </Typography>
        </Box>
      ) : (
        <>
          {/* Requested Items Grid */}
          <Grid container spacing={3} justifyContent="center">
            {paginatedItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.productId}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.03)",
                      boxShadow: 6,
                    },
                  }}
                >
                  {item.photoUrls?.[0] && (
                    <CardMedia
                      component="img"
                      sx={{ height: 180, objectFit: "cover" }}
                      image={item.photoUrls[0]}
                      alt={item.productName}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {item.productName}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" noWrap>
                      Seller: {item.sellerName}
                    </Typography>
                    <Typography variant="body2" mt={1} color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="body2" mt={1} color="text.secondary">
                      Status: {item.status}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Requested At: {new Date(item.requestedAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
