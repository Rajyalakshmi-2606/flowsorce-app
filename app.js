const express = require ('express');
const app = express();

const connectDatabase = require('./config/database');

// setting  up config.env file variables

const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'});

//connecting to database
connectDatabase();

//creating middleware to parse JSON
const middleware = (req, res, next)=>{
   console.log("Hello from middleware");
   //setting up user variable globally
   req.user="Rajyalakshmi";
   console.log(`${req.method} request made to ${req.url}`);
   next();
}

app.use(middleware);

//importing routes
const jobs = require('./routes/jobs');
app.use('/', jobs);

//setting up the server
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT} in a ${process.env.NODE_ENV} mode`);
})

