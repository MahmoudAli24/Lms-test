import mongoose from 'mongoose';

const {Schema} = mongoose;

const attendanceSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Student', index: true,
    }, group: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Group', index: true,
    }, date: {
        type: Date, default: Date.now, index: true,
    }, status: {
        type: String, enum: ['present', 'absent' ,"late"], required: true,
    },
});

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);