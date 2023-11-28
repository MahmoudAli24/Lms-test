import mongoose from 'mongoose'
const { Schema } = mongoose;
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['teacher', 'assistant'], required: true },
});

export default mongoose.models.User || mongoose.model('User', userSchema)

