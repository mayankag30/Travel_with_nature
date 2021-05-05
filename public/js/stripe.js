/* eslint-disable */

import axios from 'axios';
// import Stripe from 'stripe';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51ImkS7SG7iYnCZqllaJzyokTcgEUQAl2s2BKQdwVltpoYqV0y4niE2JXnXsldnNTavM5tiP0ZaGkqWE9YDInmY1O00US4fZKcP'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Actually get session from server by using endpoint to get checout session
    // Get Checkout Session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/users/bookings/checkout-session/${tourId}`
    );

    // 2) Use Stripe Object to create a checkout form + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
