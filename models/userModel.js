const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
        required: true,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const User = mongoose.model('User', userSchema);
module.exports = User;
