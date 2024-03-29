/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51MjdAWSGXbM43kIcOm2FBSSh47WsX2QE3QNTUbEfj3wgyU8sEX4IwYwgU3lkBJYPAVGr5cD0x9utZv2K5MzhLndW00aAaS798t'
);
export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    // console.log(session);
    // 2) create checkout form + charge credit card
    await stripe.redirectToCheckout({
        sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
