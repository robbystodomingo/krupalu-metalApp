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
        `http://localhost:8082/api/v1/subscription/registerPaymentMethod?email=${encodeURIComponent(
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
        alert(error.message);
        return;
      }

      if (setupIntent.status === "succeeded") {
        alert("Payment method saved successfully!");
        onPaymentSaved(customerId); // ✅ pass customerId up
      }
    } catch (err) {
      console.error(err);
      alert("Error saving payment method. Please try again.");
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
  const [country, setCountry] = useState("");
  const [requirement, setRequirement] = useState("");
  const [paymentSaved, setPaymentSaved] = useState(false); // track payment status

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentSaved) {
      alert("Please save a payment method before registering.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8082/api/v1/auth/register",
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
        title: "Registration Successful",
        message: "Your Advertiser account has been created successfully.",
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
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
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
         <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
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

