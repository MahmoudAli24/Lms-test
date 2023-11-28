const mongoose = require('mongoose');

const { Schema } = mongoose;

const homeworkSchema = new Schema({
  class_id: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  grades: [{ student_id: { type: Schema.Types.ObjectId, ref: 'Student' }, grade: String  }],
});
  
module.exports = mongoose.models.Homework || mongoose.model('Homework', homeworkSchema);