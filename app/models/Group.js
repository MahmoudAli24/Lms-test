import mongoose from "mongoose";

const { Schema } = mongoose;

const groupSchema = new Schema({
  groupName: { type: String, required: true  , unique: true},
  student_ids: [{type: Schema.Types.ObjectId, ref: "Student", }],
  class_id: { type: Schema.Types.ObjectId, ref: "Class" }
});

export default mongoose.models.Group || mongoose.model("Group", groupSchema);
