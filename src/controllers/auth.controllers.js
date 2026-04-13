const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function register(req, res) {
    try{
        const {username, email, password , role} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'username, email and password are required' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser){
            return res.status(400).json({ message: "User already exists" });
        }
        const hasedpassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username,
             email,
             password: hasedpassword ,
             role });
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.status(201).json(
            {
                message: "User registered successfully",
                user: user,
                token: token

            }
        );
    }
    catch(Err){
        console.log('register error:', Err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

async function login(req, res) {
    const {username, email, password} = req.body;
    try{
        if ((!username && !email) || !password) {
            return res.status(400).json({ message: 'Provide username or email, and password' });
        }

        const user = await userModel.findOne({
            $or:[
                {username},
                {email}
            ]
        });
        if (!user){
            return res.status(400).json({
                message: "Invalid username or email"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(400).json({
                message: "Invalid password"
            });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.status(200).json({
            message: "Login successful",
            user: user,
            token: token
        });
    }
    catch(Err){
        console.log('login error:', Err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}
async function logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Logout successful"
    })
}

module.exports = { register , login , logout};