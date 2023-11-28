import mongoose from "mongoose";

const {Schema} = mongoose;

const classSchema = new Schema({
  className: { type: String, required: true },
  code: { type: Number, required: true, unique: true },
  student_ids: [{ type: Number, ref: "Student" }],
  groups: [
    {
      name: { type: String, required: true },
      student_ids: [{ type: Number, ref: "Student" }],
    },
  ],
});

export default mongoose.models.Class || mongoose.model("Class", classSchema);
