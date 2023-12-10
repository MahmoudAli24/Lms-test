const mongoose = require('mongoose');

const { Schema } = mongoose;


const examSchema = new Schema({
  class_id: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  grades: [
    {
      student_id: { type: Schema.Types.ObjectId, ref: 'Student' },
      grade: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.models.Exam || mongoose.model('Exam', examSchema);