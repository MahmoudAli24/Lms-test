import mongoose from 'mongoose';

const { Schema } = mongoose;

const homeworkSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Student', index: true,
  }, group: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Group', index: true,
  }, date: {
    type: Date, default: Date.now, index: true,
  }, status: {
    type: Boolean, required: true,
  },
});

export default mongoose.models.Homework || mongoose.model('Homework', homeworkSchema);