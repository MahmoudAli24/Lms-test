import mongoose from "mongoose";

const { Schema } = mongoose;

const classSchema = new Schema({
  className: { type: String, required: true },
  student_ids: [{ type: Number, ref: "Student" }],
  groups: [
    { type: Schema.Types.ObjectId, ref: "Group" },
  ]
});

export default mongoose.models.Class || mongoose.model("Class", classSchema);
