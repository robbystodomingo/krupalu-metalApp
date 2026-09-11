// ErrorModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { createRoot } from "react-dom/client";

export function showErrorModal({ title = "Error", message, closeText = "Close" }) {
  return new Promise((resolve) => {
    const modalRoot = document.createElement("div");
    document.body.appendChild(modalRoot);

    const root = createRoot(modalRoot);

    const handleClose = () => {
      root.unmount();
      document.body.removeChild(modalRoot);
      resolve(false); // always resolve false since it's just closing
    };

    const Modal = (
      <Dialog
        open
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 6,
          },
        }}
      >
        <DialogTitle sx={{ color: "error.main", fontWeight: "bold" }}>
          {title}
        </DialogTitle>
        <DialogContent
          sx={{
            minWidth: 100,
            minHeight: 80,
          }}
        >
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
          >
            {closeText}
          </Button>
        </DialogActions>
      </Dialog>
    );

    root.render(Modal);
  });
}
