import mongoose from 'mongoose'
const { Schema } = mongoose;
const userSchema = new Schema({
  username: { type: String, required: true, index: true},
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'assistant'], required: true , index: true},
});

export default mongoose.models.User || mongoose.model('User', userSchema)

