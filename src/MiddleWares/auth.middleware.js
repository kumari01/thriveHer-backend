const jwt = require("jsonwebtoken");
async function authMiddleware(req, res, next) {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized: token missing"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== "admin"){
           return res.status(403).json({message:"Forbidden"})
        }
        req.user = decoded; // creating property to store the decoded token in the request object for later use
       console.log(req.user)
      next();

    }
    catch(err){
        res.status(401).json({ message: "Unauthorized: invalid token" , error: err.message});
    }
}

module.exports = authMiddleware;