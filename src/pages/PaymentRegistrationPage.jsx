import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
} from "@mui/material";
import {loadStripe} from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51U654fRrP8vTwa4UwwB33rqh29DDLv984j8u9m1fB05t8v9AUGSB9ojec9t7HldqI0NjT9MDdhNS307XHmXCKHq000E5czXE3l");



// --- Payment Form Component ---
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    // Create PaymentMethod via Stripe.js
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name: "Test User", // you can collect this separately
      },
    });

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      console.log("PaymentMethod ID:", paymentMethod.id);
      alert(`Saved card with ID: ${paymentMethod.id}`);

      // 👉 Send paymentMethod.id to your backend (Spring Boot)
      // fetch("/api/payments/save", { method:"POST", body: JSON.stringify({paymentMethodId: paymentMethod.id}) })
    }
  };

  return (
    <Paper sx={{p: 4}}>
      <Typography variant="h5" gutterBottom>
        Add Payment Method
      </Typography>

      <Box sx={{mb: 2}}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {color: "#aab7c4"},
              },
              invalid: {color: "#9e2146"},
            },
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
        sx={{mt: 2}}
        fullWidth
        onClick={handleSubmit}
      >
        Save Payment Method
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{mt: 2}}>
        Your card will be charged after 6 months for the subscription.
      </Typography>
    </Paper>
  );
};

    const today = new Date();
    const billingDate = new Date(today.setMonth(today.getMonth() + 6));

    // Format to something readable (e.g., Aug 21, 2026)
    const formattedBillingDate = billingDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
// --- Main Page ---
const PaymentRegistrationPage = () => {
  return (
    
    <Box sx={{display: "flex", minHeight: "100vh"}}>

      {/* Main Content */}
      <Box component="main" sx={{flexGrow: 1, p: 4}}>
        <Grid container spacing={4}>
          {/* Payment Form */}
          <Grid item xs={12} md={7}>
            <Elements stripe={stripePromise}>
              <PaymentForm />
            </Elements>
          </Grid>

          {/* Info Panel */}
          <Grid item xs={12} md={5}>
            <Paper sx={{p: 4}}>
              <Typography variant="h6" gutterBottom>
                No charges today
              </Typography>
              <Typography variant="body1" sx={{mb: 2}}>
                Your subscription starts immediately but billing begins after 6
                months.
              </Typography>
              <Typography variant="body2" sx={{mb: 2}}>
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
        </Grid>
      </Box>
    </Box>
  );
};

export default PaymentRegistrationPage;
