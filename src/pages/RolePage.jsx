import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Typography, Button, Box, Container } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const fontDisplay = '"Oswald", sans-serif';
const fontBody = '"Inter", sans-serif';

const COLORS = {
  graphite: "#5b6168",
  steel: "#EEF0F2",
  accent: "#D4AF37",
  accentDim: "#a19f05",
  text: "#15181B",
};

/**
 * Shared layout for the Buyers / Sellers / Advertisers pages.
 * Every page passes only its content — look and animation stay identical.
 */
export default function RolePage({
  label, // small eyebrow text, e.g. "For Buyers"
  title,
  intro,
  benefits, // array of strings
  closing,
  ctaLabel,
  ctaHref,
  Icon, // MUI icon component shown in the hero
  tint, // soft background colour for the icon badge
}) {
  // Same fonts as the home page
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
    window.scrollTo(0, 0);
    return () => document.head.removeChild(link);
  }, []);

  // The app layout leaves a gap above this page (left over from the hidden navbar).
  // Measure how far down the page starts and pull it up by that amount, so the
  // hero banner reaches the very top of the screen at any screen size.
  const rootRef = useRef(null);
  const pullUpRef = useRef(0);
  const [pullUp, setPullUp] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      // rect.top already includes the current negative margin, so add it back
      const naturalTop = Math.max(0, rect.top + window.scrollY + pullUpRef.current);
      if (Math.abs(naturalTop - pullUpRef.current) > 0.5) {
        pullUpRef.current = naturalTop;
        setPullUp(naturalTop);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <Box
      ref={rootRef}
      sx={{
        bgcolor: COLORS.steel,
        fontFamily: fontBody,
        color: COLORS.text,
        minHeight: "100vh",
        mt: `-${pullUp}px`,
      }}
    >
      {/* Animations used across the page */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        @keyframes sheen {
          0%   { transform: translateX(-120%) skewX(-20deg); }
          60%, 100% { transform: translateX(320%) skewX(-20deg); }
        }
        @keyframes drift {
          from { background-position: 0 0; }
          to   { background-position: 160px 160px; }
        }
        @keyframes pulseRing {
          0%   { transform: scale(0.9); opacity: 0.55; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          color: "#fff",
          py: { xs: 8, md: 12 },
          background: "linear-gradient(135deg, #15181b 0%, #2E3338 55%, #1b1d20 100%)",
        }}
      >
        {/* Slowly drifting grid texture */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.12,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            animation: "drift 18s linear infinite",
          }}
        />
        {/* Gold glow */}
        <Box
          sx={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(212,175,55,0) 70%)",
          }}
        />

        <Container sx={{ position: "relative" }}>
          <Button
            href="/"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              color: "rgba(255,255,255,0.75)",
              textTransform: "none",
              fontFamily: fontBody,
              fontWeight: 500,
              mb: 4,
              "&:hover": { color: COLORS.accent, bgcolor: "transparent" },
            }}
          >
            Back to home
          </Button>

          {/* Text column: capped so it never runs under the icon on the right.
              (A plain Box instead of Grid, so it doesn't depend on the MUI Grid version.) */}
          <Box sx={{ maxWidth: { md: "56%" } }}>
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  color: COLORS.accent,
                  mb: 2,
                  animation: "fadeUp 0.7s ease both",
                }}
              >
                {label}
              </Typography>
              <Typography
                component="h1"
                sx={{
                  fontFamily: fontDisplay,
                  fontWeight: 600,
                  fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4.2rem" },
                  lineHeight: 1.08,
                  letterSpacing: "0.5px",
                  animation: "fadeUp 0.7s ease 0.1s both",
                }}
              >
                {title}
              </Typography>
              <Box
                sx={{
                  width: 72,
                  height: 4,
                  bgcolor: COLORS.accent,
                  borderRadius: 2,
                  my: 3,
                  animation: "fadeUp 0.7s ease 0.2s both",
                }}
              />
              <Typography
                sx={{
                  fontFamily: fontBody,
                  fontSize: { xs: "1.02rem", md: "1.18rem" },
                  lineHeight: 1.8,
                  maxWidth: 620,
                  color: "rgba(255,255,255,0.85)",
                  animation: "fadeUp 0.7s ease 0.3s both",
                }}
              >
                {intro}
              </Typography>
          </Box>
        </Container>

        {/* Floating icon badge.
            Desktop: centered (both ways) in the free space to the right of the text.
            Mobile: sits below the text, centered. */}
        <Box
          sx={{
            position: { xs: "relative", md: "absolute" },
            top: { md: 0 },
            bottom: { md: 0 },
            right: { md: 0 },
            width: { md: "38%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: { xs: 6, md: 0 },
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: { xs: 180, md: 260 },
              height: { xs: 180, md: 260 },
              animation: "floatY 5s ease-in-out infinite",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `2px solid ${COLORS.accent}`,
                animation: "pulseRing 3s ease-out infinite",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `2px solid ${COLORS.accent}`,
                animation: "pulseRing 3s ease-out 1.5s infinite",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                bgcolor: tint,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              <Icon sx={{ fontSize: { xs: 84, md: 120 }, color: COLORS.text }} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Benefits */}
      <Container maxWidth="xl" sx={{ py: { xs: 7, md: 10 }, px: { xs: 2, md: 6 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: { xs: 2.5, md: 4 },
          }}
        >
          {benefits.map((text, i) => (
              <Box
                key={text}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: { xs: "row", md: "column" },
                  alignItems: "flex-start",
                  gap: { xs: 2, md: 1.5 },
                  p: 3,
                  bgcolor: "#fff",
                  borderRadius: 3,
                  borderLeft: `4px solid ${COLORS.accent}`,
                  boxShadow: "0 4px 18px rgba(21,24,27,0.07)",
                  animation: `fadeUp 0.7s ease ${0.35 + i * 0.12}s both`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 14px 32px rgba(21,24,27,0.16)",
                  },
                }}
              >
                <CheckCircleRoundedIcon sx={{ color: COLORS.accent, fontSize: 30, mt: "2px" }} />
                <Typography
                  sx={{ fontFamily: fontBody, fontWeight: 500, fontSize: "1.08rem", lineHeight: 1.6 }}
                >
                  {text}
                </Typography>
              </Box>
          ))}
        </Box>
      </Container>

      {/* Closing call to action */}
      <Box sx={{ bgcolor: COLORS.graphite, color: "#fff", py: { xs: 7, md: 9 }, textAlign: "center" }}>
        <Container>
          <Typography
            sx={{
              fontFamily: fontDisplay,
              fontWeight: 500,
              fontSize: { xs: "1.5rem", md: "2.1rem" },
              lineHeight: 1.3,
              maxWidth: 760,
              mx: "auto",
              mb: 4,
            }}
          >
            {closing}
          </Typography>
          <Button
            href={ctaHref}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              position: "relative",
              overflow: "hidden",
              px: 5,
              py: 1.6,
              borderRadius: 50,
              bgcolor: COLORS.accent,
              color: COLORS.text,
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: "1.05rem",
              textTransform: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease",
              "&:hover": {
                bgcolor: "#e2bf4a",
                transform: "translateY(-3px)",
                boxShadow: "0 14px 32px rgba(0,0,0,0.45)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "35%",
                height: "100%",
                background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))",
                animation: "sheen 3.5s ease-in-out infinite",
              },
            }}
          >
            {ctaLabel}
          </Button>
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
}
