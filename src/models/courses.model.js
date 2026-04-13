const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    uri:{
        type: String,
        required: true,
        unique: true
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    cost:{
        type: Number,
        required: true
    }
});

const courseModel = mongoose.model("coursemodel", courseSchema);

module.exports = courseModel;