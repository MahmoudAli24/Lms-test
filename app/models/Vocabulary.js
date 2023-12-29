const mongoose = require('mongoose');

const {Schema} = mongoose;

const vocabularySchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Student', index: true,
    }, group: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Group', index: true,
    }, date: {
        type: Date, default: Date.now, index: true,
    }, status: {
        type: String, enum: ["good" ,"very good" , "weak" ,"excellent"], required: true,
    },
});

export default mongoose.models.Vocabulary || mongoose.model('Vocabulary', vocabularySchema);