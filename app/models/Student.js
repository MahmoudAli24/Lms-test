import mongoose from "mongoose";

const {Schema} = mongoose;

const studentSchema = new Schema({
    code: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    class_code: {type: Schema.Types.ObjectId, ref: "Class", required: true},
    group_code: {type: Schema.Types.ObjectId, ref: "Group", required: true},
    attendance: [{date: Date, status: String}],
    examGrades: [{exam_id: {type: Schema.Types.ObjectId, ref: "Exam"}},],
    homework: [{homework_id: {type: Schema.Types.ObjectId, ref: "Homework"}}],
    vocabulary: [{vocabulary_id: {type: Schema.Types.ObjectId, ref: "Vocabulary"}}],
    createdAt: {type: Date, default: Date.now},
});

export default mongoose.models.Student || mongoose.model("Student", studentSchema);
