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
import axios from "axios";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

// Cycle through your industrial photography for the hero.
// Add more paths here — the more images, the more "dynamic" the crossfade feels.
const heroImages = ["/Banner.png", "/Foundry.png", "/Testing.png"];

// Static beam layout — angle, position, width, and shine timing per beam.
// Kept outside the component so it isn't recreated on every render.
const beamConfigs = [
  { left: "-5%", width: "14%", rotate: -18, delay: 0, duration: 3.2 },
  { left: "8%", width: "10%", rotate: -18, delay: 0.6, duration: 3.6 },
  { left: "20%", width: "16%", rotate: -18, delay: 1.4, duration: 3 },
  { left: "36%", width: "11%", rotate: -18, delay: 0.2, duration: 3.8 },
  { left: "49%", width: "15%", rotate: -18, delay: 1, duration: 3.3 },
  { left: "64%", width: "10%", rotate: -18, delay: 1.8, duration: 3.5 },
  { left: "76%", width: "17%", rotate: -18, delay: 0.4, duration: 3.1 },
  { left: "92%", width: "12%", rotate: -18, delay: 1.2, duration: 3.7 },
];

function SteelBeamsBackground() {
  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", bgcolor: "#1b1d20" }}>
      {beamConfigs.map((beam, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            top: "-30%",
            left: beam.left,
            width: beam.width,
            height: "160%",
            transform: `rotate(${beam.rotate}deg)`,
            background:
              "linear-gradient(90deg, #2c2f33 0%, #5b6168 20%, #8b9096 45%, #4c5157 65%, #2c2f33 100%)",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          {/* Diagonal light sweep — the "shine" pass across the beam surface */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "-60%",
              width: "40%",
              height: "100%",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
              animation: `beamShine ${beam.duration}s ease-in-out ${beam.delay}s infinite`,
            }}
          />
        </Box>
      ))}

      <style>{`
        @keyframes beamShine {
          0% { transform: translateX(0%); }
          100% { transform: translateX(260%); }
        }
      `}</style>
    </Box>
  );
}

function VisitorCounter({ COLORS, fontBody, fontDisplay }) {
  const [count, setCount] = useState(null);
  const [displayCount, setDisplayCount] = useState(0);
  const hasIncremented = React.useRef(false);

  useEffect(() => {
    if (hasIncremented.current) return;
    hasIncremented.current = true;

    axios
      .post("/api/v1/visitors/increment")
      .then((res) => setCount(res.data.count))
      .catch((err) => console.error("Error fetching visitor count:", err));
  }, []);

  // Animate the number counting up to its target once it arrives.
  useEffect(() => {
    if (count === null) return;

    const duration = 900; // ms
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayCount(Math.round(eased * count));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [count]);

  return (
    <Box sx={{ bgcolor: "transparent", py: { xs: 4, md: 5 } }}>
      <Container sx={{ textAlign: "center" }}>
        <Box
          sx={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0.5,
            opacity: count !== null ? 1 : 0,
            transform: count !== null ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <PeopleAltOutlinedIcon sx={{ fontSize: 28, color: COLORS.accent, mb: 0.5 }} />

          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: { xs: "2.4rem", md: "3rem" },
              color: COLORS.graphite,
              lineHeight: 1,
              letterSpacing: "0.5px",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {displayCount.toLocaleString()}
          </Typography>

          <Box
            sx={{
              width: 40,
              height: 2,
              bgcolor: COLORS.accent,
              my: 1,
              borderRadius: 1,
            }}
          />

          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            Visitors to this site
          </Typography>
        </Box>
      </Container>
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

      <VisitorCounter COLORS={COLORS} fontBody={fontBody} fontDisplay={fontDisplay} />

      {/* Who we are — animated CSS steel-beam background with a dark overlay for legible text */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 8, md: 12 },
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <SteelBeamsBackground />

        {/* Overlay for legibility, on top of the beams */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(21,24,27,0.72) 0%, rgba(21,24,27,0.6) 50%, rgba(21,24,27,0.75) 100%)",
          }}
        />

        <Container sx={{ position: "relative" }}>
          <Typography
            sx={{
              display: "inline-block",
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: { xs: "1.8rem", md: "2.3rem" },
              color: "#fff",
              mb: 2,
              letterSpacing: "0.5px",
              cursor: "default",
              transition: "letter-spacing 0.35s ease, color 0.35s ease",
              "&:hover": {
                letterSpacing: "2.5px",
                color: COLORS.accent,
              },
            }}
          >
            Who we are
          </Typography>
          <Typography
            sx={{
              fontFamily: fontBody,
              fontSize: { xs: "1.05rem", md: "1.1rem" },
              lineHeight: 1.9,
              width: "100%",
              px: { xs: 2, md: 4 },
              textAlign: "justify",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            Krupalu Metal Inc. is a sister company of Krupalu Inc. USA, a North American-based
            company dedicated to providing innovative solutions for the global metal trading industry.

            We provide an online platform that connects buyers and sellers of metals worldwide,
            making it easier, faster, and more convenient to trade steel and other metal products
            online—regardless of location.

            By registering with Krupalu Metal Inc., businesses can showcase their products, expand
            their market reach, and connect with potential buyers and sellers through our platform.
            Our goal is to help organizations maximize their sales and marketing opportunities
            within the global metals marketplace.

            From listing products to connecting with interested buyers and sellers, we provide
            support throughout the trading process to make every transaction as seamless as possible.

            Krupalu Metal Inc. offers a unique digital platform designed to simplify the way
            businesses buy and sell metals worldwide.
          </Typography>
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
