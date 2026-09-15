import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
} from "@mui/material";

import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Cycle through your industrial photography for the hero.
// Add more paths here — the more images, the more "dynamic" the crossfade feels.
const heroImages = ["/Banner.png", "/Foundry.png", "/Testing.png"];

// Approximate coordinates for each country you list, grouped by region.
const markers = [
  { name: "Canada", coordinates: [-106.35, 56.13], region: "North America" },
  { name: "USA", coordinates: [-95.71, 37.09], region: "North America" },
  { name: "Mexico", coordinates: [-102.55, 23.63], region: "North America" },
  { name: "UK", coordinates: [-3.44, 55.38], region: "Europe" },
  { name: "France", coordinates: [2.21, 46.23], region: "Europe" },
  { name: "Germany", coordinates: [10.45, 51.17], region: "Europe" },
  { name: "Italy", coordinates: [12.57, 41.87], region: "Europe" },
  { name: "Russia", coordinates: [60.0, 58.0], region: "Europe" },
  { name: "China", coordinates: [104.2, 35.86], region: "Asia" },
  { name: "India", coordinates: [78.96, 20.59], region: "Asia" },
  { name: "Japan", coordinates: [138.25, 36.2], region: "Asia" },
  { name: "Korea", coordinates: [127.77, 35.91], region: "Asia" },
  { name: "Saudi Arabia", coordinates: [45.08, 23.89], region: "Asia" },
  { name: "UAE", coordinates: [53.85, 23.42], region: "Asia" },
];



// Placeholder — swap for your actual head office coordinates.
const HQ = { name: "HQ", coordinates: [-87.63, 41.88] };

const regionViews = {
  All: { center: [10, 20], zoom: 1 },
  "North America": { center: [-100, 45], zoom: 2.3 },
  Europe: { center: [15, 45], zoom: 3 },
  Asia: { center: [90, 30], zoom: 1.8 },
};

function WorldReachMap({ COLORS, fontBody, fontDisplay }) {
  const [activeRegion, setActiveRegion] = useState("All");
  const [hovered, setHovered] = useState(null);
  const view = regionViews[activeRegion];

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      {/* Region tabs */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 3, flexWrap: "wrap" }}>
        {Object.keys(regionViews).map((r) => (
          <Box
            key={r}
            onClick={() => setActiveRegion(r)}
            sx={{
              cursor: "pointer",
              px: 2.5,
              py: 1,
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: "0.9rem",
              borderBottom: activeRegion === r ? `2px solid ${COLORS.accent}` : "2px solid transparent",
              color: activeRegion === r ? COLORS.graphite : "text.secondary",
              transition: "color 0.2s ease, border-color 0.2s ease",
              "&:hover": { color: COLORS.graphite },
            }}
          >
            {r === "All" ? "All regions" : r}
          </Box>
        ))}
      </Box>

      <Box sx={{ position: "relative" }}>
        <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: "100%", height: "auto" }}>
          <ZoomableGroup
            center={view.center}
            zoom={view.zoom}
            disablePanning
            transitionDuration={600}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#e8eaec"
                    stroke="#d7dbdf"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#dde1e4" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Connecting lines from HQ — the "hub" the map organizes around */}
            {markers.map((m) => {
              const isActive = activeRegion === "All" || m.region === activeRegion;
              return (
                <Line
                  key={`line-${m.name}`}
                  from={HQ.coordinates}
                  to={m.coordinates}
                  stroke={COLORS.accent}
                  strokeWidth={isActive ? 1.2 : 0.6}
                  strokeOpacity={isActive ? 0.55 : 0.12}
                  strokeLinecap="round"
                  style={
                    isActive
                      ? {
                        strokeDasharray: "4 4",
                        animation: "dashFlow 1.2s linear infinite",
                      }
                      : {}
                  }
                />
              );
            })}

            {/* HQ marker — distinct shape, sits above every other marker */}
            <Marker coordinates={HQ.coordinates}>
              <rect
                x={-6}
                y={-6}
                width={12}
                height={12}
                fill={COLORS.graphite}
                stroke="#fff"
                strokeWidth={1.5}
                transform="rotate(45)"
              />
            </Marker>

            {/* Country markers */}
            {markers.map((m) => {
              const isActive = activeRegion === "All" || m.region === activeRegion;
              return (
                <Marker
                  key={m.name}
                  coordinates={m.coordinates}
                  onMouseEnter={() => setHovered(m.name)}
                  onMouseLeave={() => setHovered(null)}
                  opacity={isActive ? 1 : 0.25}
                >
                  <circle r={5} fill={COLORS.accent} stroke="#fff" strokeWidth={1.5} style={{ cursor: "pointer" }} />
                  {isActive && (
                    <circle r={5} fill={COLORS.accent} opacity={0.5}>
                      <animate attributeName="r" from="5" to="14" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {hovered && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              bgcolor: COLORS.graphite,
              color: "#fff",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontFamily: fontBody,
              fontSize: "0.85rem",
              pointerEvents: "none",
            }}
          >
            {hovered}
          </Box>
        )}
      </Box>

      {/* Keyframes for the animated shipping-route dashes */}
      <style>{`
        @keyframes dashFlow {
          to { stroke-dashoffset: -8; }
        }
      `}</style>
    </Box>
  );
}

const HomePage = () => {
  const [heroIndex, setHeroIndex] = useState(0);

  // Load Oswald (headlines) + Inter (body) — chosen for a technical,
  // stamped-plate feel rather than a generic sans pairing.
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Rotate hero background every 6s.
  useEffect(() => {
    if (heroImages.length < 2) return;
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const fontDisplay = '"Oswald", sans-serif';
  const fontBody = '"Inter", sans-serif';

  const COLORS = {
    graphite: "#5b6168",
    panel: "#2E3338",
    steel: "#EEF0F2",
    accent: "#D4AF37",
    accentDim: "#a19f05",
    blue: "#4A6FA5",
    text: "#15181B",
  };

  const specColumns = [
    { title: "Standards", items: "ASTM / ASME / AMS / BSI / DIN / DFARS / Non-DFARS" },
    { title: "Types", items: "Seamless / Welded / Super-Duplex / Duplex" },
    { title: "Shapes", items: "Pipe / Tube / Bar / Plate / Coil" },
  ];

  const alloys = [
    { title: "Stainless steel", items: "304 / 304L / 316 / 316L / 400 Series / 904L" },
    { title: "S.S. PH grades", items: "15-5 / 17-4 / 17-7" },
    { title: "Carbon steel", items: "A53 / A106 / A333" },
    { title: "Inconel", items: "200 / 201 / 400 / 600 / 601 / 718 / 722 / 800 / 825" },
    { title: "Hastelloy", items: "C-22 / C-276 / C-2000" },
    { title: "Titanium", items: "6-4 / CP / 6-2-4-2 / 15-3-3-3" },
  ];

  const regions = [
    { title: "North America", items: "Canada, Mexico, USA" },
    { title: "Europe", items: "France, Germany, Italy, Russia, UK" },
    { title: "Asia", items: "China, India, Saudi Arabia, Japan, Korea, UAE" },
  ];

  return (
    <Box sx={{ bgcolor: COLORS.steel, fontFamily: fontBody, color: COLORS.text }}>
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          borderBottom: `2px solid ${COLORS.accent}`,
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <img
            src="/new-logo-for-site-2.png"
            alt="Krupalu Metal Inc."
            style={{ height: 64, marginRight: "auto" }}
          />
          <Button
            href="/login"
            sx={{
              color: COLORS.graphite,
              fontFamily: fontBody,
              fontWeight: 600,
              textTransform: "none",
              mr: 1,
            }}
          >
            Log in
          </Button>
          <Button
            href="/register"
            variant="contained"
            sx={{
              bgcolor: COLORS.accent,
              fontFamily: fontBody,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: COLORS.accentDim },
            }}
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "70vh", md: "88vh" },
          overflow: "hidden",
          bgcolor: COLORS.graphite,
        }}
      >
        {heroImages.map((img, i) => (
          <Box
            key={img}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('${img}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: i === heroIndex ? 1 : 0,
              transition: "opacity 1.8s ease-in-out, transform 6s ease-in-out",
              transform: i === heroIndex ? "scale(1.06)" : "scale(1)",
            }}
          />

        ))}

        {/* Overlay for legibility */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(27,30,34,0.75) 0%, rgba(27,30,34,0.45) 45%, rgba(27,30,34,0.85) 100%)",
          }}
        />

        <Container
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              letterSpacing: "0.5px",
              fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem" },
              lineHeight: 1.1,
              maxWidth: 780,
            }}
          >
            The trusted platform for metal trade.
          </Typography>
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: { xs: "1rem", md: "1.15rem" },
              maxWidth: 560,
              mt: 3,
              mb: 5,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Krupalu Metal Inc. connects buyers, sellers, and advertisers across
            ferrous and non-ferrous alloys — from raw coil to finished pipe.
          </Typography>
        </Container>
      </Box>

      {/* Quick facts strip — mill-certificate style, not icon cards */}
      <Box sx={{ bgcolor: COLORS.graphite, color: "#fff", py: { xs: 3, md: 4 } }}>
        <Container>
          <Grid container spacing={{ xs: 3, sm: 6 }} justifyContent="center">
            {[
              { n: "25+", l: "Years in global tube & alloy trade" },
              { n: "3", l: "Continents served" },
              { n: "40+", l: "Alloys & grades stocked" },
            ].map((stat, i) => (
              <Grid
                item
                xs={12}
                sm={4}
                key={stat.l}
                sx={{
                  textAlign: "center",
                  borderLeft: {
                    sm: i !== 0 ? "1px solid rgba(255,255,255,0.15)" : "none",
                  },
                  pl: { sm: i !== 0 ? 6 : 2 },
                  py: { xs: 1.5, sm: 0 },
                  cursor: "default",
                  transition: "transform 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                  "&:hover .stat-number": {
                    color: COLORS.accent,
                  },
                }}
              >
                <Typography
                  className="stat-number"
                  sx={{
                    fontFamily: fontDisplay,
                    fontSize: "2rem",
                    fontWeight: 600,
                    transition: "color 0.25s ease",
                  }}
                >
                  {stat.n}
                </Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.9rem", color: "rgba(255,255,255,0.75)" }}>
                  {stat.l}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Typography
        sx={{
          textAlign: "center",
          fontFamily: fontBody,
          fontSize: "0.75rem",
          color: "text.secondary",
          py: 1,
        }}
      >
      </Typography>

      {/* Who we are */}
      <Container sx={{
        py: { xs: 8, md: 12 }, textAlign: "center", backgroundImage: "url('/attachments/zEvjo6PCePC7EguBPxzKn.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "gray", // make text readable
        borderRadius: 2,
        overflow: "hidden",
      }}>
        <Typography
          sx={{
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: { xs: "1.8rem", md: "2.3rem" },
            mb: 2,
          }}
        >
          Who we are
        </Typography>
        <Typography
          sx={{
            fontFamily: fontBody,
            fontSize: { xs: "1.05rem", md: "1.1rem" }, // larger text
            lineHeight: 1.9,
            maxWidth: "100%", // allow full width
            px: { xs: 2, md: 6 }, // padding left/right for breathing room
            textAlign: "justify", // spreads text evenly across the line
            mb: 5,
          }}
        >
          We are one of the largest importers and exporters of ferrous and non‑ferrous alloys,
          proudly headquartered in North America. With decades of industry expertise, we have
          built strong partnerships across global markets, ensuring that every transaction is
          handled with precision and trust. Our commitment goes beyond supply — we work closely
          with clients to understand their unique requirements, delivering competitive pricing,
          uncompromising quality, and efficient logistics. Whether it’s stainless steel, carbon
          steel, titanium, or specialty alloys, we provide solutions that empower industries
          worldwide to thrive.
        </Typography>



        <Box
          sx={{
            position: "relative",
            maxWidth: 700,
            mx: "auto",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 14,
              left: 14,
              right: -14,
              bottom: -14,
              border: `2px solid ${COLORS.accent}`,
              zIndex: 0,
              transition: "top 0.3s ease, left 0.3s ease",
            },
            "&:hover::before": {
              top: 10,
              left: 10,
            },
          }}
        >
          {/* Inner wrapper clips the zoom so it doesn't spill past the image edges */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              overflow: "hidden",
              maxHeight: 380,
            }}
          >
            <Box
              component="img"
              src="Whoweare.png"
              alt="Metal foundry"
              sx={{
                width: "100%",
                display: "block",
                objectFit: "cover",
                maxHeight: 380,
                transition: "transform 0.5s ease",
                "&:hover": {
                  transform: "scale(1.06)",
                },
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* What we deal — datasheet panel, not cards */}
      <Box sx={{ bgcolor: COLORS.panel, color: "#fff", py: { xs: 8, md: 10 } }}>
        <Container sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: { xs: "1.6rem", md: "2rem" },
              mb: 5,
            }}
          >
            What do we deal?
          </Typography>
          <Grid container spacing={0} justifyContent="center">
            {specColumns.map((block, i) => (
              <Grid
                item
                xs={12}
                md={4}
                key={block.title}
                sx={{
                  borderLeft: { md: i !== 0 ? "1px solid rgba(255,255,255,0.15)" : "none" },
                  borderTop: { xs: i !== 0 ? "1px solid rgba(255,255,255,0.15)" : "none", md: "none" },
                  px: { md: 4 },
                  py: { xs: 3, md: 0 },
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(0.96)" },
                }}
              >
                <Typography sx={{ fontFamily: fontBody, fontWeight: 600, color: COLORS.accent, mb: 1 }}>
                  {block.title}
                </Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.95rem", color: "rgba(255,255,255,0.85)" }}>
                  {block.items}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Alloys & Grades — bordered grid, like sheet stock */}
      <Container sx={{ py: { xs: 8, md: 10 }, textAlign: "center" }}>
        <Typography
          sx={{
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: { xs: "1.6rem", md: "2rem" },
            mb: 5,
          }}
        >
          Alloys & grades
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" },
            border: "1px solid #d7dbdf",
            borderRight: "none",
            borderBottom: "none",
            maxWidth: 900,
            mx: "auto",
          }}
        >
          {alloys.map((alloy) => (
            <Box
              key={alloy.title}
              sx={{
                borderRight: "1px solid #d7dbdf",
                borderBottom: "1px solid #d7dbdf",
                p: 3,
                transition: "transform 0.3s ease",
                "&:hover": { transform: "scale(0.96)" },
              }}
            >
              <Typography sx={{ fontFamily: fontBody, fontWeight: 600, mb: 0.5 }}>
                {alloy.title}
              </Typography>
              <Typography sx={{ fontFamily: fontBody, fontSize: "0.9rem", color: "text.secondary" }}>
                {alloy.items}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Where we deal */}
      <Box sx={{ bgcolor: "#6492bd", py: { xs: 8, md: 10 }, borderTop: "1px solid #d7dbdf" }}>
        <Container sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: { xs: "1.6rem", md: "2rem" },
              mb: 5,
            }}
          >
            Where we deal
          </Typography>

          <WorldReachMap COLORS={COLORS} fontBody={fontBody} fontDisplay={fontDisplay} />

          <Grid container spacing={4} justifyContent="center" sx={{ mt: 6 }}>
            {regions.map((region, i) => (
              <Grid
                item
                xs={12}
                md={4}
                key={region.title}
                sx={{
                  borderLeft: { md: i !== 0 ? `1px solid #d7dbdf` : "none" },
                  pl: { md: i !== 0 ? 4 : 0 },
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "scale(0.96)" },
                }}
              >
                <Typography sx={{ fontFamily: fontBody, fontWeight: 600, color: COLORS.blue, mb: 0.5 }}>
                  {region.title}
                </Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.95rem" }}>
                  {region.items}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why us — one big number as the moment, not a bullet list */}
      <Box sx={{ bgcolor: COLORS.graphite, color: "#fff", py: { xs: 8, md: 12 } }}>
        <Container>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography sx={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: { xs: "4rem", md: "6rem" }, lineHeight: 1 }}>
                25+
              </Typography>
              <Typography sx={{ fontFamily: fontBody, fontSize: "1.1rem", color: "rgba(255,255,255,0.8)" }}>
                Years of extensive global tube industry experience
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <Typography sx={{ fontFamily: fontBody, fontSize: "1.05rem", lineHeight: 1.8, color: "rgba(255,255,255,0.85)" }}>
                We work as a partner to understand our clients' requirements,
                not just fulfil an order. That means competitive pricing,
                consistent quality, and delivery you can plan around.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#111417", color: "rgba(255,255,255,0.7)", py: 4, textAlign: "center" }}>
        <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem" }}>
          © 2026 Krupalu Metal Inc. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;