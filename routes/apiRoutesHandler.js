const express = require('express');
const authController = require('../controllers/auth.js');
const config = require('../config.json');
const crypto = require('crypto');

const router = express.Router();

const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
  const { status, data } = await authController.signup(req.body);
  res.status(status).json(data);
});

userRouter.get('/findGeoUsers', async (req, res) => {
  const { status, data } = await authController.findGeoUsers(req.query);
  res.status(status).json(data);
});
router.get('/users', async (req, res) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' 'unsafe-inline' https://maps.googleapis.com (https://maps.googleapis.com/) https://maps.gstatic.com"
  );
  res.setHeader('Access-Control-Allow-Origin', '*');
  const result = await authController.findGeoUsers({
    lat: 23.155906,
    long: 87.149235,
    radius: 10000000000,
  });
  if (result.status === 200) {
    res.render('map', {
      users: result.data,
      googleApiKey: config.GOOGLE_API_KEY,
      nonce: crypto.randomBytes(16).toString('base64'),
    });
  } else {
    res.status(result.status).json(result.data);
  }
});

router.use('/users', userRouter);

module.exports = router;
