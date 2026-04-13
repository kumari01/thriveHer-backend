const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type : String,
        required: true
    },
    purchasedCourses: {
        type : [mongoose.Schema.Types.ObjectId],
        ref: "CourseModel",
        default: []
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
})


const userModel = mongoose.model("usermodel", userSchema);

module.exports = userModel;