const express = require('express');
const app = express();
const port = 3000;

// Set up WayForPay API credentials
const WAYFORPAY_API_KEY = 'YOUR_API_KEY';
const WAYFORPAY_API_SECRET = 'YOUR_API_SECRET';

app.use(express.json());

// Define a route for the payment form
app.get('/payment', (req, res) => {
  // Render the payment form template with WayForPay's JavaScript library
  const wayforpayScriptTag = '<script src="https://cdn.wayforpay.com/script.js"></script>';
  const paymentFormHTML = `
    <h1>Payment Form</h1>
    ${wayforpayScriptTag}
    <form id="payment-form">
      <!-- Your form fields here -->
      <input type="text" name="amount" value="10.00">
      <button type="submit">Pay Now!</button>
    </form>
  `;
  res.send(paymentFormHTML);
});

// Define a route to handle the payment submission
app.post('/payment', (req, res) => {
  // Get the form data from WayForPay's JavaScript library
  const formData = req.body;

  // Validate the form data
  if (!formData.amount || !formData.cardNumber || !formData.expMonth || !formData.expYear) {
    return res.status(400).send('Invalid payment information');
  }

  // Create a new payment request to WayForPay's API
  const paymentRequest = {
    amount: formData.amount,
    card_number: formData.cardNumber,
    exp_month: formData.expMonth,
    exp_year: formData.expYear,
  };

  // Make the payment request to WayForPay's API using your API key and secret
  fetch(`https://api.wayforpay.com/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentRequest),
    params: {
      api_key: WAYFORPAY_API_KEY,
      api_secret: WAYFORPAY_API_SECRET,
    },
  })
  .then(response => response.json())
  .then((paymentResponse) => {
    // Handle the payment response
    if (paymentResponse.status === 'success') {
      res.send('Payment successful!');
    } else {
      res.status(400).send(`Error: ${paymentResponse.error_message}`);
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Internal Server Error');
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});


