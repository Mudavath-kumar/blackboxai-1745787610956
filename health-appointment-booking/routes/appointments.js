const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');

// Get all appointments for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id }).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new appointment
router.post('/', auth, async (req, res) => {
  const { date, time, doctor, description } = req.body;
  try {
    const appointment = new Appointment({
      user: req.user.id,
      date,
      time,
      doctor,
      description,
    });
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointment by id
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.user.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment by id
router.put('/:id', auth, async (req, res) => {
  const { date, time, doctor, description } = req.body;
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.user.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;
    appointment.doctor = doctor || appointment.doctor;
    appointment.description = description || appointment.description;

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete appointment by id
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    if (appointment.user.toString() !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });

    await appointment.remove();
    res.json({ message: 'Appointment removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
