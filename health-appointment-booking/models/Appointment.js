const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
