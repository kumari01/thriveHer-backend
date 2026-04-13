const jwt = require("jsonwebtoken");

async function UserauthMiddleware(req, res, next) {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized: token missing"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // creating property to store the decoded token in the request object for later use
        console.log(req.user)
        next();

    }
    catch(Err){
        res.status(401).json({ message: "Unauthorized: invalid token" , error: Err.message});
    }
}

module.exports = UserauthMiddleware;