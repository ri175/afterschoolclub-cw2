// require express version 4
let express = require("express");
let app = express();
let cors = require("cors");
 
// created a port for our server
let port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

app.use(cors());

const logger = (req, res, next) => {
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    console.log(`APP DETAILS: METHOD : ${method}, API ENDPOINT : ${url}, STATUS : ${status}`);
    next();
  };

app.use(logger);

//used dotenv to store database password and connection string
let dotenv = require("dotenv");
dotenv.config({path:"./config.env"});

//used mongodb client for database connection to mongodb atlas
const {MongoClient} = require('mongodb');
const { json } = require("express");
//created a 
let collections;

let sortedData ;
let mySort = {id:-1}; //object to sort data in descending order

// this blow function with connect our app to the mondodb atlas
async function main(){
    const client = new MongoClient(process.env.DATABASE);
     try {
        await client.connect(); 
        collections = await client.db("vueproject").collection("lessons").find().toArray();
        sortedData = await client.db("vueproject").collection("lessons").find().sort(mySort).toArray();  

    } catch (e) {
       console.error(e);
     } 
}

    main()
    .then((con)=> console.log("DB CONNECTED!"))
    .catch(console.error);

//get all the lessons from the server
// this is the REST API END POINT to get all the data from the server we hit this endpoint
app.get("/api/lessons", (req,res)=>{
    //setting the status 200 which means success
    const data = collections;
    if(req.query.sort == "des"){
        if(sortedData){
            res.status(200).json(sortedData);
        }
    }
    else{
        res.status(200).json(data);
    }
    
});

app.post("/api/lessons", (req,res)=>{
    console.log(req.body);
    res.send(req.body);
});

app.put("/api/lessons/:id", (req,res)=>{
    console.log(req.body);

});
// started the server 
app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});