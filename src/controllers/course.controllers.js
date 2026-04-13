const CourseModel = require('../models/courses.model');
const UserModel = require('../models/user.model')
const {uploadFile} = require("../services/storage.services");

function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('File upload timed out')), ms))
    ]);
}

async function createCourse(req, res){
    try{
        const body = req.body || {};
        const title = (body.title || '').trim();
        const file = req.file;
        const cost = Number(body.cost);
        const instructor = req.user && req.user.id;
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing. Use form-data with fields: title, cost and file." });
        }

        if (!title || !file || !instructor || Number.isNaN(cost)){
            return res.status(400).json({ message: "title, file and valid cost are required" });
        }
        const result = await withTimeout(uploadFile(file.buffer.toString('base64')), 15000);
        const course = await CourseModel.create({
            title,
            uri: result.url,
            instructor: req.user.id,
            cost
        });
        res.status(201).json({
            message: "Course created successfully",
            course: course
        });
    }
    catch(Err){
        console.log('createCourse error:', Err.message);
        res.status(500).json({ message: "Internal Server Error" , error: Err.message });
    }

}

async function getCourses(req,res) {
    try{
        const courses = await CourseModel.find().populate('title instructor cost');
        res.status(200).json({
            message: "Courses retrieved successfully",
            courses: courses
        });

    }
    catch(Err){
        console.log('getCourses error:', Err.message);
        res.status(500).json({ message: "Internal Server Error", error: Err.message });
    }
}

async function UpdateCourse(req,res) {
    try{
        const Id = req.params.id;
        const {title , instructor,cost} = req.body;
        const updatedCourse = await CourseModel.findByIdAndUpdate(
            id,
            { title, instructor, cost },
            { new: true } // returns updated document
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({
            message: "Course updated successfully",
            course: updatedCourse
        });
    }
    catch(err){
        res.status(404).json({
            message : err.message
        })
    }
}

async function buyCourse(req,res){
    const userId = req.user.id;
    const CourseId = req.params.id;
    const user =  await UserModel.findOne(userId)
    const ispurchased = user.purchasedCourses.includes(CourseId);
    if (ispurchased) {
        return res.status(400).json({
            message : "Already in your courses"
        })
    }
    user.purchasedCourses.push(CourseId);
    await user.save();
    res.status(200).json({
        message : "Course purchased successfully"
    })
}



module.exports = { createCourse , getCourses, UpdateCourse, buyCourse};