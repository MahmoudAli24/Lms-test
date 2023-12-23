import mongoose from 'mongoose';

const {Schema} = mongoose;

const attendanceSchema = new Schema({
    group_id: {type: Schema.Types.ObjectId, ref: 'Group', required: true},
    date: {type: Date, required: true},
    grades: [{
        student_id: {type: Schema.Types.ObjectId, ref: 'Student'},
        grade: {type: String, required: true,}
    }],
});

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);