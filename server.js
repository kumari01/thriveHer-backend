require('dotenv').config()
const app = require('./src/app.js')
const connectDB = require('./src/database/db.js');

connectDB();

app.listen(3000, () =>{
    console.log("server is running at port: 3000");
})