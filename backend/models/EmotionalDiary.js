const mongoose = require('mongoose');

const emotionalDiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  moodScore: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const EmotionalDiary = mongoose.model('EmotionalDiary', emotionalDiarySchema);

module.exports = EmotionalDiary;