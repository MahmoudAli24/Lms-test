import mongoose from "mongoose";

const {Schema} = mongoose;

const studentSchema = new Schema({
    code: {
        type: Number, required: true, unique: true , index: true
    }, name: {
        type: String, required: true
    }, phone: {
        type: String, required: true
    }, class_id: {
        type: Schema.Types.ObjectId, ref: "Class", required: true , index: true
    }, group_id: {
        type: Schema.Types.ObjectId, ref: "Group", required: true , index: true
    }, attendance: [{
        type: Schema.Types.ObjectId, ref: "Attendance"
    }], exams: [{
        type: Schema.Types.ObjectId, ref: "Exam"
    }], homework: [{
        type: Schema.Types.ObjectId, ref: "Homework"
    }], vocabulary: [{
        type: Schema.Types.ObjectId, ref: "Vocabulary"
    }], createdAt: {
        type: Date, default: Date.now , index: true
    },
});


export default mongoose.models.Student || mongoose.model("Student", studentSchema);
