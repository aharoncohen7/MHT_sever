const mongoose = require('mongoose')


const QuestionSchema = new mongoose.Schema(
  {
    subject: { type: String },
    content: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'answered', 'closed'],
      default: 'pending'
    },
    isActive: { type: Boolean, default: true },
    contactDetails: {
      contactBy: {
        type: String,
        required: true,
        enum: ['email', 'sms', 'whatsapp']
      },
      email: {
        type: String,
        required: function () { return this.contactDetails.contactBy === 'email'; },
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
      },
      phone: {
        type: String,
        required: function () { return ['sms', 'whatsapp'].includes(this.contactDetails.contactBy); },
        match: [/^\d{10}$/, 'Phone number must be 10 digits']
      }
    }
  },
  { timestamps: true }
);

const QuestionModel = mongoose.models["question"] || mongoose.model("question", QuestionSchema);


module.exports = {QuestionModel}