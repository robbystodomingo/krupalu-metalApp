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
      <Dialog open onClose={() => handleClose(false)}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={() => handleClose(false)} color="white">
            {cancelText}
          </Button> */}
          <Button onClick={() => handleClose(true)} variant="contained" color="primary">
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );

    root.render(Modal);
  });
}
