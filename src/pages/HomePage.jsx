import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material";

const HomePage = () => {
  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#e3f2fd' }}>
        <Toolbar>
           <img
            src="/new-logo-for-site-2.png" 
            alt="Krupalu Metal Inc."
            style={{ height: 100, marginRight: "auto" }}
          />
          {/* <Button color="inherit">Home</Button>
          <Button color="inherit">Categories</Button>
          <Button color="inherit">Buy</Button>
          <Button color="inherit">Sell</Button>
          <Button color="inherit">Advertise</Button>
          <Button color="inherit">Contact Us</Button> */}
          <Button variant="outlined" sx={{ color: '#081a3b' }} href="/login">Login</Button>
          <Button variant="outlined" href="/register" sx={{ ml: 1 , color: '#081a3b'}}>
            Register
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: "url('Banner.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          py: { xs: 6, sm: 8, md: 30 },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            fontWeight: "bold",
          }}
        >
          The Trusted Platform for Metal Trade
        </Typography>
        {/* <Typography variant="body1" sx={{ maxWidth: 600, mx: "auto", mb: 3 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Typography> */}
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            I'm a Buyer – Find quality metals
          </Button>
          <Button variant="contained" color="primary">
            I'm a Seller – List your metals
          </Button>
        </Box>
      </Box>

      {/* Categories */}
      {/* <Container sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Browse Metals by Category
        </Typography>
        <Grid container spacing={3}>
          {["Steel", "Aluminum", "Copper", "Nickel Alloy"].map((cat) => (
            <Grid item xs={12} sm={6} md={3} key={cat}>
              <Card>
                <CardContent>
                  <Typography variant="h6" align="center">
                    {cat}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container> */}

      {/* Info Boxes */}
      {/* <Container sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {["For Sellers – Lorem Ipsum", "For Buyers – Lorem Ipsum", "For Advertisers – Lorem Ipsum"].map(
            (info) => (
              <Grid item xs={12} sm={4} key={info}>
                <Card>
                  <CardContent>
                    <Typography variant="body1" align="center">
                      {info}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      </Container> */}

      {/* About Us */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" align="center" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
        <Box sx={{ py: 8, bgcolor: "#f9f9f9" }}>
      <Container>
         
       
        {/* Who We Are */}
        <Typography variant="h5" gutterBottom>
          Who We Are
        </Typography>
        <Typography variant="body1" paragraph>
          We are one of the largest Importer and Exporter of Ferrous and Non-Ferrous Alloys,
          with a registered head office in North America.
        </Typography>

        {/* What We Deal */}
        <Typography variant="h5" gutterBottom>
          What Do We Deal?
        </Typography>
        <Grid container spacing={3}>
          {[
            { title: "Standards", items: "ASTM / ASME / AMS / BSI / DIN / DFARS / Non-DFARS" },
            { title: "Types", items: "Seamless / Welded / Super-Duplex / Duplex" },
            { title: "Shapes", items: "Pipe / Tube / Bar / Plate / Coil" },
          ].map((block, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{block.title}</Typography>
                  <Typography variant="body2">{block.items}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Alloys */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Alloys & Grades
          </Typography>
          <Grid container spacing={2}>
            {[
              { title: "Stainless Steel", items: "304 / 304L / 316 / 316L / 400 Series / 904L" },
              { title: "S.S PH Grades", items: "15-5 / 17-4 / 17-7" },
              { title: "Carbon Steel", items: "A53 / A106 / A333" },
              { title: "Inconel", items: "200 / 201 / 400 / 600 / 601 / 718 / 722 / 800 / 825" },
              { title: "Hastelloy", items: "C-22 / C-276 / C-2000" },
              { title: "Titanium", items: "6-4 / CP / 6-2-4-2 / 15-3-3-3" },
            ].map((alloy, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">{alloy.title}</Typography>
                    <Typography variant="body2">{alloy.items}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Where We Deal */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Where We Deal
          </Typography>
          <Typography variant="body2">
            <strong>North America:</strong> Canada, Mexico, USA <br />
            <strong>Europe:</strong> France, Germany, Italy, Russia, UK <br />
            <strong>Asia:</strong> China, India, Saudi Arabia, Japan, Korea, UAE
          </Typography>
        </Box>

        {/* Why Us */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" gutterBottom>
            Why Us?
          </Typography>
          <ul>
            <li>25+ years of extensive global tube industries experience</li>
            <li>We work as a partner to understand our client's requirements</li>
            <li>Competitive Pricing, High Quality, Efficient Delivery</li>
          </ul>
        </Box>
      </Container>
    </Box>
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <img
            src="/images/foundry.jpg"
            alt="Metal Foundry"
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: 3, textAlign: "center" }}>
        <Typography variant="body2">
          © 2026 Krupalu Metal Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
