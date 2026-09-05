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

function SellerCard({ name, country }) {
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

export default function SellerList() {
  const [sellers, setSellers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
        .get(endpoint)
        .then((res) => setSellers(res.data))
        .catch((err) => console.error("Error fetching sellers:", err));
    }
  }, [role]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedSellers = sellers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // If role is SELLER, block access
  if (role === "SELLER") {
    return (
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Sellers cannot view this page.
        </Typography>
      </Paper>
    );
  }
  

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" gutterBottom>
          Sellers List
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          maxWidth="600px"
          mx="auto"
        >
          Browse sellers from around the world. Hover over a card to interact.
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center">
        <Grid container spacing={3} justifyContent="center" maxWidth="900px">
          {paginatedSellers.map((seller, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <SellerCard name={seller.fullName} country={seller.country} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box display="flex" justifyContent="center" mt={3}>
        <TablePagination
          component="div"
          count={sellers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </Box>
    </Paper>
  );
}



// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Box,
//   Paper,
//   TablePagination,
// } from "@mui/material";
// import axios from "axios";

// function SellerCard({ name, country }) {
//   return (
//     <Card
//       sx={{
//         border: "1px solid #eee",
//         boxShadow: 2,
//         transition: "transform 0.3s ease, box-shadow 0.3s ease",
//         "&:hover": {
//           transform: "translateY(-8px) scale(1.05)",
//           boxShadow: 6,
//         },
//         textAlign: "center",
//         borderRadius: 2,
//       }}
//     >
//       <CardContent>
//         <Typography variant="h6" gutterBottom>
//           {name}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {country}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// }

// export default function SellersList() {
//   const [sellers, setSellers] = useState([]);
//   const [advertisers, setAdvertisers] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(6);

//   const role = localStorage.getItem("role");

//   useEffect(() => {
//     if (role === "BUYER") {
//       // Fetch sellers and advertisers in parallel
//       Promise.all([
//         axios.get("/api/v1/buyerDashboard/sellersList"),
//         axios.get("/api/v1/buyerDashboard/advertisersList"),
//       ])
//         .then(([sellersRes, advertisersRes]) => {
//           setSellers(sellersRes.data);
//           setAdvertisers(advertisersRes.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching data:", error);
//         });
//     } else if (role === "SELLER") {
//       axios
//         .get("/api/v1/sellerDashboard/sellersList")
//         .then((res) => setSellers(res.data))
//         .catch((err) => console.error("Error fetching sellers:", err));
//     } else if (role === "ADVERTISER") {
//       axios
//         .get("/api/v1/advertiserDashboard/advertisersList")
//         .then((res) => setAdvertisers(res.data))
//         .catch((err) => console.error("Error fetching advertisers:", err));
//     }
//   }, [role]);

//   const handleChangePage = (event, newPage) => setPage(newPage);
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const paginatedSellers = sellers.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <Paper sx={{ p: 3, mt: 4 }}>
//       <Box textAlign="center" mb={4}>
//         <Typography variant="h4" gutterBottom>
//           Sellers List
//         </Typography>
//         <Typography
//           variant="body1"
//           color="text.secondary"
//           maxWidth="600px"
//           mx="auto"
//         >
//           Browse sellers from around the world. Hover over a card to interact.
//         </Typography>
//       </Box>

//       {/* Sellers grid */}
//       <Box display="flex" justifyContent="center">
//         <Grid container spacing={3} justifyContent="center" maxWidth="900px">
//           {paginatedSellers.map((seller, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <SellerCard name={seller.name} country={seller.country} />
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       <Box display="flex" justifyContent="center" mt={3}>
//         <TablePagination
//           component="div"
//           count={sellers.length}
//           page={page}
//           onPageChange={handleChangePage}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           rowsPerPageOptions={[6, 12, 24]}
//         />
//       </Box>

//       {/* Advertisers section (only for BUYER role) */}
//       {role === "BUYER" && (
//         <Box mt={6}>
//           <Typography variant="h4" gutterBottom textAlign="center">
//             Advertisers List
//           </Typography>
//           <Grid container spacing={3} justifyContent="center" maxWidth="900px">
//             {advertisers.map((adv, index) => (
//               <Grid item xs={12} sm={6} md={4} key={index}>
//                 <SellerCard name={adv.fullName} country={adv.country} />
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}
//     </Paper>
//   );
// }
