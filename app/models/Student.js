import mongoose from 'mongoose'

const { Schema } = mongoose

const studentSchema = new Schema({
  code: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  class_code: { type: Number, ref: 'Class', required: true },
  attendance: [{ date: Date, status: String }],
  examGrades: [{ exam_id: { type: Schema.Types.ObjectId, ref: 'Exam' }, grade: Number }],
  homework: [{ subject: String, content: String, due_date: Date }],
})

export default mongoose.models.Student || mongoose.model('Student', studentSchema)