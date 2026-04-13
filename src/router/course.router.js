const express = require('express');
const multer = require('multer');
const courseController = require('../controllers/course.controllers');
const authMiddleware = require('../MiddleWares/auth.middleware');
const UserauthMiddleware = require('../MiddleWares/userAuth.middleware');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create', authMiddleware, upload.single('file'), courseController.createCourse);

router.get('/allCourses', courseController.getCourses);

router.put('/update/:id', authMiddleware, upload.single('file'), courseController.UpdateCourse);

router.put('/buyCourse/:id', UserauthMiddleware, courseController.buyCourse);

module.exports = router;
