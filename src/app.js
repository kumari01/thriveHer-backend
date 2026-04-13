const express = require('express');
const authRouter = require('./router/auth.router.js');
const CourseRouter = require('./router/course.router.js');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/courses', CourseRouter);



module.exports = app;