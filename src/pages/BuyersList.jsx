import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Paper,
  TablePagination,
} from "@mui/material";
import axios from "axios";

function BuyerCard({ name, country }) {
  return (
    <Card
      sx={{
        border: "1px solid #eee",
        boxShadow: 2,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px) scale(1.05)",
          boxShadow: 6,
        },
        textAlign: "center",
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {country}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function BuyersList() {
  const [buyers, setBuyers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
        .get(endpoint)
        .then((res) => setBuyers(res.data))
        .catch((err) => console.error("Error fetching sellers:", err));
    }
  }, [role]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedBuyers = buyers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3, mt: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Buyers List
        </Typography>
        <Typography variant="body1" color="text.secondary" maxWidth="600px" mx="auto">
          Browse buyers from around the world. Hover over a card to interact.
        </Typography>
      </Box>

      {/* Center the grid */}
      <Box display="flex" justifyContent="flex-start">
        <Grid container spacing={3} justifyContent="center" maxWidth="900px">
          {paginatedBuyers.map((buyer, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <BuyerCard name={buyer.fullName} country={buyer.country} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box display="flex" justifyContent="center" mt={3}>
        <TablePagination
          component="div"
          count={buyers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </Box>
    </Box>
  );
}
