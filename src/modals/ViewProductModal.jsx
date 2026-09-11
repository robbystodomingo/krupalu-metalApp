import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Typography
} from "@mui/material";
import React from "react";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function statusChipColor(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("approve")) return "success";
  if (normalized.includes("reject")) return "error";
  return "warning";
}

const getFullUrl = (url) => {
  if (!url) return "";

  const s = String(url).trim();

  // Already a full URL
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  // file:/// URI -> convert to path
  if (s.startsWith("file://")) {
    try {
      const u = new URL(s);
      const path = u.pathname.replace(/^\/+/, ""); // remove leading slash
      const base = process.env.REACT_APP_API_BASE_URL || window.location.origin;
      const result = `${base.replace(/\/$/, "")}/${path}`;
      console.warn("Converted file:// path to HTTP URL:", s, "->", result);
      return result;
    } catch (e) {
      const stripped = s.replace(/^file:\/+/, "");
      const base = process.env.REACT_APP_API_BASE_URL || window.location.origin;
      const result = `${base.replace(/\/$/, "")}/${stripped.replace(/^\/+/, "")}`;
      console.warn("Converted file:// (fallback) to HTTP URL:", s, "->", result);
      return result;
    }
  }

  // Windows drive path like D:\uploads\img.jpg or D:/uploads/img.jpg
  const winMatch = s.match(/^[A-Za-z]:[\\/](.+)$/);
  if (winMatch) {
    const relative = winMatch[1].replace(/\\/g, "/"); // uploads/img.jpg
    const base = process.env.REACT_APP_API_BASE_URL || window.location.origin;
    const result = `${base.replace(/\/$/, "")}/${relative.replace(/^\//, "")}`;
    console.warn("Converted Windows drive path to HTTP URL:", s, "->", result);
    return result;
  }

  // Server-relative path like /uploads/abc.jpg
  if (s.startsWith("/")) {
    const base = process.env.REACT_APP_API_BASE_URL || window.location.origin;
    return `${base.replace(/\/$/, "")}/${s.replace(/^\//, "")}`;
  }

  // Plain relative filename or unknown format -> assume uploads/<name>
  const base = process.env.REACT_APP_API_BASE_URL || window.location.origin;
  return `${base.replace(/\/$/, "")}/${s.replace(/^\//, "")}`;
};

export default function ViewProductModal({ open, onClose, item, type }) {
  const mainImageFallback =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='#f3f4f6'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='20'>Image unavailable</text></svg>`
    );

  const raw = item ? item.photoUrls || (item.imageUrl ? [item.imageUrl] : []) : [];
  const photoUrls = Array.isArray(raw) ? raw.map(getFullUrl) : [];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [mainSrc, setMainSrc] = React.useState(photoUrls[0] || mainImageFallback);

  React.useEffect(() => {
    setActiveIndex(0);
    setMainSrc(photoUrls[0] || mainImageFallback);
  }, [item?.id, photoUrls.length]);


  React.useEffect(() => {
    setMainSrc(photoUrls[activeIndex] || mainImageFallback);
  }, [activeIndex, photoUrls.length]);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (photoUrls.length ? (i - 1 + photoUrls.length) % photoUrls.length : 0));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((i) => (photoUrls.length ? (i + 1) % photoUrls.length : 0));
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, photoUrls.length]);

  if (!item) return null;

  const heading = type === "ads" ? item.title : type === "products" ? item.productName : item.fullName;
  const subheading = type === "ads" ? "Advertisement" : type === "products" ? "Product" : "Buyer Requirement";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
              {subheading}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mt: 0.25,
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {heading}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {item?.approvalStatus && (
              <Chip
                label={item.approvalStatus}
                color={statusChipColor(item.approvalStatus)}
                size="small"
              />
            )}
            <IconButton size="small" onClick={onClose} aria-label="close">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>


      <Divider sx={{ my: 1, borderColor: "grey.700", borderBottomWidth: 2 }} />


      <DialogContent sx={{ pt: 2.5 }}>
        {type === "buyers" ? (
          <Box>
            <Box
              sx={{
                backgroundColor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 1.5,
                p: 2,
                mb: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                REQUIREMENT
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {item.requirement || "No requirement available."}
              </Typography>
            </Box>

            <DetailRow label="Email" value={item.email} />
            <DetailRow label="Phone Number" value={item.phoneNumber} />
            <DetailRow label="Country" value={item.country} />
          </Box>
        ) : (

          <Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Description
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {item.description || item.requirement || "No description available."}
              </Typography>
            </Box>

            <ProductDetails
              product={item}
              activeIndex={activeIndex}
              onThumbClick={(idx) => setActiveIndex(idx)}
            />
          </Box>
        )}
      </DialogContent>


      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ProductDetails({ product, onThumbClick, activeIndex }) {
  if (!product) return null;

  const categoryValue = product.category || product.categoryName || "";
  const raw = product.photoUrls || (product.imageUrl ? [product.imageUrl] : []);
  const photoUrls = Array.isArray(raw) ? raw.map(getFullUrl) : [];

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 320,
              borderRadius: 1,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "grey.50",
            }}
          >
            {/* Main image */}
            <Box
              component="img"
              src={photoUrls[activeIndex] || photoUrls[0]}
              alt={product.productName || product.title || "Image"}
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;utf8," +
                  encodeURIComponent(
                    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='#f3f4f6'/>
                    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial' font-size='20'>Image unavailable</text></svg>`
                  );
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />


            {photoUrls.length > 1 && (
              <IconButton
                onClick={() => {
                  const prev = (activeIndex - 1 + photoUrls.length) % photoUrls.length;
                  onThumbClick(prev);
                }}
                aria-label="previous image"
                size="large"
                sx={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.85)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                  boxShadow: 1,
                }}
              >
                <KeyboardArrowLeftIcon />
              </IconButton>
            )}


            {photoUrls.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "common.white",
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  pointerEvents: "none",
                }}
              >
                <Typography variant="body2" sx={{ color: "inherit", fontWeight: 600 }}>
                  {activeIndex + 1}
                </Typography>
                <Typography variant="body2" sx={{ color: "inherit" }}>
                  /
                </Typography>
                <Typography variant="body2" sx={{ color: "inherit", opacity: 0.9 }}>
                  {photoUrls.length}
                </Typography>
              </Box>
            )}

            {photoUrls.length > 1 && (
              <IconButton
                onClick={() => {
                  const next = (activeIndex + 1) % photoUrls.length;
                  onThumbClick(next);
                }}
                aria-label="next image"
                size="large"
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(255,255,255,0.85)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                  boxShadow: 1,
                }}
              >
                <KeyboardArrowRightIcon />
              </IconButton>
            )}
          </Box>

          {photoUrls.length > 1 && (
            <Box display="flex" gap={1} mt={1} flexWrap="wrap" alignItems="center">
              {photoUrls.map((url, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={url}
                  alt={`${product.productName || product.title} ${idx + 1}`}
                  onClick={() => onThumbClick(idx)}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: (theme) => (idx === activeIndex ? `2px solid ${theme.palette.primary.main}` : "1px solid #ddd"),
                    cursor: "pointer",
                    opacity: idx === activeIndex ? 1 : 0.85,
                  }}
                  onError={(e) => {
                    e.currentTarget.style.opacity = "0.6";
                  }}
                />
              ))}
            </Box>
          )}

          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              Category
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {categoryValue || "—"}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function DetailRow({ label, value }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        py: 1,
        "&:not(:last-of-type)": {
          borderBottom: "1px solid",
          borderColor: "grey.100",
        },
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ width: 140, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value || "—"}
      </Typography>
    </Box>
  );
}



