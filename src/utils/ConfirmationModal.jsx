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
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2, 
            boxShadow: 6,  
          },
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent
          sx={{
            minWidth: 80,
            minHeight: 60,
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
