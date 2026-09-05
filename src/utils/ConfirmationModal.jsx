// ConfirmationModal.js
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { createRoot } from "react-dom/client";

export function showConfirmation({ title, message, confirmText = "Confirm", cancelText = "Cancel" }) {
  return new Promise((resolve) => {
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
        fullWidth          // 👈 makes dialog stretch to maxWidth
        maxWidth="sm"      // 👈 options: 'xs', 'sm', 'md', 'lg', 'xl'
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent
          sx={{
            minWidth: 150,   // 👈 force a minimum width
            minHeight: 80,  // 👈 optional: add some height
          }}
        >
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose(true)}
            variant="contained"
            color="primary"
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );


    root.render(Modal);
  });
}
