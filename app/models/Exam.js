const mongoose = require('mongoose');

const {Schema} = mongoose;


const examSchema = new Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Student', index: true,
    }, examName: {
        type: String, required: true,
    }, group_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Group', index: true,
    }, date: {
        type: Date, default: Date.now, index: true,
    }, grade: {
        type: Number, required: true,
    },
});

module.exports = mongoose.models.Exam || mongoose.model('Exam', examSchema);