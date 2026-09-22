import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Autocomplete,
  Paper,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css"; // Material-styled variant of the library
import { showConfirmation } from "../utils/ConfirmationModal";
import { countries } from "../component/Countries";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const steps = ["Account Setup", "Role Details"];

// --- Payment Form Component ---
const PaymentForm = ({ email, onPaymentSaved }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [saving, setSaving] = useState(false);
  const [cardholderName, setCardholderName] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !email) return;

    setSaving(true);
    try {
      // Step 1: ask backend for SetupIntent tied to this email
      const intentResponse = await fetch(
        `/api/v1/subscription/registerPaymentMethod?email=${encodeURIComponent(
          email
        )}`,
        { method: "POST" }
      );
      if (!intentResponse.ok) throw new Error("Failed to prepare payment setup");
      const { clientSecret, customerId } = await intentResponse.json();

      // Step 2: confirm card setup with Stripe
      const cardElement = elements.getElement(CardElement);
      const { error, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { name: cardholderName },
          },
        }
      );

      if (error) {
        await showConfirmation({
          title: "Payment Method Not Saved",
          message: error.message || "We couldn't save your payment method. Please try again.",
          confirmText: "OK",
          cancelText: null,
        });
        return;
      }

      if (setupIntent.status === "succeeded") {
        await showConfirmation({
          title: "Payment Method Saved",
          message: "Your payment method was saved successfully.",
          confirmText: "OK",
          cancelText: null,
        });
        onPaymentSaved(customerId);
      }
    } catch (err) {
      console.error(err);
      await showConfirmation({
        title: "Payment Method Not Saved",
        message: "Something went wrong while saving your payment method. Please try again.",
        confirmText: "OK",
        cancelText: null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add Payment Method
      </Typography>

      <Box sx={{ mb: 2 }}>

        <TextField
          label="Cardholder Name"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
            hidePostalCode: true,
          }}
        />
      </Box>

      <FormControlLabel
        control={<Checkbox />}
        label="Save card for future payments"
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        fullWidth
        onClick={handleSubmit}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Payment Method"}
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Your card will be charged  $60 after 6 months for the subscription.
      </Typography>
    </Paper>
  );
}; // ✅ properly closed PaymentForm

export default function AdvertiserRegistrationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email] = useState(state?.email || "");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [country, setCountry] = useState("");
  const [requirement, setRequirement] = useState("");
  const [paymentSaved, setPaymentSaved] = useState(false); // track payment status

  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const phoneHasValue = phoneNumber && phoneNumber.replace(/\D/g, "").length > 0;
  const isPhoneLabelFloating = isPhoneFocused || phoneHasValue;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber || phoneNumber.trim().length < 8) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    if (!paymentSaved) {
      alert("Please save a payment method before registering.");
      return;
    }

    try {
      const response = await fetch(
        "/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            email,
            username,
            phoneNumber,
            country,
            requirement,
            password: state?.password,
            role: "ADVERTISER",
            customerId: paymentSaved, // ✅ include Stripe customerId
          }),
        }
      );

      if (!response.ok) throw new Error("Registration failed");

      const data = await response.json();
      console.log("Advertiser registered:", data);

      const confirmed = await showConfirmation({
        title: "Advertiser Registration is for approval",
        message: "Your Advertiser account is under review by our Administrators and will get back to you shortly. Thank you!",
        confirmText: "Got it!",
        cancelText: "Back",
      });

      if (confirmed) navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  // Calculate billing date
  const today = new Date();
  const billingDate = new Date(today.setMonth(today.getMonth() + 6));
  const formattedBillingDate = billingDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 1100,
        margin: "auto",
        mt: 5,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Stepper activeStep={1} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              onClick={() => {
                if (index === 0) navigate("/register");
              }}
              sx={{ cursor: "pointer" }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={2}>
        {/* Left column: Advertiser registration */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Join as an Advertiser
          </Typography>
          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          {/* react-phone-input-2 styled to match MUI outlined TextFields */}
          <Box
            sx={{
              position: "relative",
              mb: 2,
              "& .react-tel-input .special-label": {
                display: "none",
              },
              "& .react-tel-input .form-control": {
                width: "100%",
                height: "56px",
                fontSize: "1rem",
                fontFamily: "inherit",
                borderRadius: "10px",
                borderColor: phoneError
                  ? "#d32f2f"
                  : isPhoneFocused
                    ? "#1976d2"
                    : "rgba(0, 0, 0, 0.23)",
                borderWidth: isPhoneFocused ? "2px" : "1px",
                backgroundColor: "transparent",
                "&:hover": {
                  borderColor: phoneError ? "#d32f2f" : "rgba(0, 0, 0, 0.87)",
                },
                "&:focus": {
                  boxShadow: "none",
                },
              },
              "& .react-tel-input .flag-dropdown": {
                borderColor: phoneError
                  ? "#d32f2f"
                  : isPhoneFocused
                    ? "#1976d2"
                    : "rgba(0, 0, 0, 0.23)",
                borderWidth: isPhoneFocused ? "2px" : "1px",
                borderRadius: "10px 0 0 10px",
                backgroundColor: "transparent",
              },
              "& .react-tel-input .flag-dropdown.open .selected-flag": {
                backgroundColor: "transparent",
              },
              "& .react-tel-input .selected-flag:hover, & .react-tel-input .selected-flag:focus": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <Typography
              component="label"
              sx={{
                position: "absolute",
                left: isPhoneLabelFloating ? "10px" : "96px",
                top: isPhoneLabelFloating ? "-9px" : "50%",
                transform: isPhoneLabelFloating ? "none" : "translateY(-50%)",
                fontSize: isPhoneLabelFloating ? "0.8rem" : "1rem",
                color: phoneError
                  ? "#d32f2f"
                  : isPhoneFocused
                    ? "#1976d2"
                    : "rgba(0, 0, 0, 0.6)",
                backgroundColor: isPhoneLabelFloating
                  ? (theme) => theme.palette.background.default
                  : "transparent",
                padding: isPhoneLabelFloating ? "0 4px" : 0,
                pointerEvents: "none",
                transition: "all 150ms cubic-bezier(0.0, 0, 0.2, 1)",
                zIndex: 1,
              }}
            >
              Phone Number *
            </Typography>

            <PhoneInput
              country={"us"}
              value={phoneNumber}
              onChange={(value) => {
                setPhoneNumber(value);
                if (phoneError) setPhoneError("");
              }}
              onFocus={() => setIsPhoneFocused(true)}
              onBlur={() => setIsPhoneFocused(false)}
              inputProps={{
                name: "phoneNumber",
                required: true,
              }}
            />
            {phoneError && (
              <Typography variant="caption" sx={{ color: "#d32f2f", ml: 1.5, mt: 0.5, display: "block" }}>
                {phoneError}
              </Typography>
            )}
          </Box>

          <Autocomplete
            options={countries}
            value={country}
            onChange={(event, newValue) => setCountry(newValue)}
            getOptionLabel={(option) => option || ""}
            renderInput={(params) => (
              <TextField {...params} label="Country" required fullWidth />
            )}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Requirement"
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            multiline
            rows={3}
            fullWidth
            required
          />
        </Grid>

        {/* Right column: Payment setup */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
            Payment Setup
          </Typography>
          <Elements stripe={stripePromise}>
            <PaymentForm email={email} onPaymentSaved={setPaymentSaved} />
          </Elements>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              No charges today
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Your subscription starts immediately but billing begins after 6
              months.
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              First billing date: <strong>{formattedBillingDate}</strong>
            </Typography>
            <Typography variant="h6" gutterBottom>
              How it works
            </Typography>
            <Typography variant="body2">
              • Start subscription today <br />
              • No charges for the first 6 months <br />
              • Automatic billing after 6 months <br />
              • Email reminder 7 days before billing
             </Typography>
           </Paper>
         </Grid>

         {/* Submit buttons row */}
         <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 3 }}>
           <Button variant="outlined" onClick={() => navigate("/register")}>
             Back
           </Button>
           <Button type="submit" variant="contained" disabled={!paymentSaved}>
            Register Advertiser
           </Button>
         </Grid>
      </Grid>
     </Box>
   );
 }
