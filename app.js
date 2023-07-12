const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const https = require("https");
//const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

const apikey = "b2a360cb86cf75df106423329f2b5625-us21";
const audienceKey = "f3983ca694";
app.post("/", (req, res)=>{
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var email = req.body.email

    var data = {
        members : [
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/f3983ca694";
    const options = {
        method : "POST",
        auth : "bobba:b2a360cb86cf75df106423329f2b5625-us21"
    }
    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.write("<h1> Thank you for Signing up, " + firstName + "</h1>");
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/success.html", (req, res)=>{
    res.sendFile(__dirname + "/signup.html")
});

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log("listening on port 3000");
});