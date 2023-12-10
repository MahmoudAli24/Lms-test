const mongoose = require('mongoose');

const { Schema } = mongoose;

const vocabularySchema = new Schema({
  class_id: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  grades: [{
    student_id: { type: Schema.Types.ObjectId, ref: 'Student' },
    grade: { type: String, required: true, }
  }],
});

module.exports = mongoose.models.Vocabulary || mongoose.model('Vocabulary', vocabularySchema);