// ConfirmationModal.js
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { createRoot } from "react-dom/client";

// Same look as the dialogs on the login page.
const fontDisplay = '"Oswald", sans-serif';
const fontBody = '"Inter", sans-serif';

const COLORS = {
  accent: "#D4AF37",
  text: "#15181B",
};

const dialogPaperProps = { sx: { borderRadius: 3, m: 2 } };

const dialogPrimarySx = {
  bgcolor: COLORS.accent,
  color: COLORS.text,
  fontFamily: fontBody,
  fontWeight: 700,
  textTransform: "none",
  borderRadius: 2,
  px: 3,
  "&:hover": { bgcolor: "#e2bf4a" },
};

// This modal is rendered outside the app, so make sure the site fonts are loaded
// (pages like the dashboards may not have loaded them).
function ensureFonts() {
  if (document.getElementById("krupalu-fonts")) return;
  const link = document.createElement("link");
  link.id = "krupalu-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

export function showConfirmation({ title, message, confirmText = "Confirm", cancelText = "Cancel" }) {
  return new Promise((resolve) => {
    ensureFonts();

    const modalRoot = document.createElement("div");
    document.body.appendChild(modalRoot);

    const root = createRoot(modalRoot);

    const handleClose = (result) => {
      root.unmount();
      document.body.removeChild(modalRoot);
      resolve(result);
    };

    const Modal = (
      <Dialog
        open
        onClose={() => handleClose(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={dialogPaperProps}
      >
        <DialogTitle sx={{ fontFamily: fontDisplay, fontWeight: 600 }}>{title}</DialogTitle>
        <DialogContent sx={{ minHeight: 60 }}>
          <Typography sx={{ fontFamily: fontBody }}>{message}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => handleClose(true)} sx={dialogPrimarySx}>
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );

    root.render(Modal);
  });
}