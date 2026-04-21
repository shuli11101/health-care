const mongoose = require('mongoose');

const consultationSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  messages: [
    {
      sender: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const ConsultationSession = mongoose.model('ConsultationSession', consultationSessionSchema);

module.exports = ConsultationSession;