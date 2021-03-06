const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1)GET the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create Checkout Session
  // create returns a PROMISE
  const session = await stripe.checkout.sessions.create({
    // PAYMENT METHOD - card - CREDIT CARD
    payment_method_types: ['card'],
    // SUCCESS URL - URL called as soon as the purchase was successful
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    // CANCEL URL
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    // Custom field: client reference id - to pass in some data about the session we are currently creating
    // Once the purchase was success, we will get access to session object again
    // By then we have to create new booking in our database
    // To create a new booking in our database
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        // Live images - images hosted on internet
        // Stripe uploads this image on their server
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price,
        currency: 'inr',
        quantity: 1,
      },
    ],
  });

  // 3) Create Session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only temporary bcoz it is unsecure, everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
