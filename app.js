var express=require('express');
var app=express();
var dotenv=require('dotenv');
var mongo=require('mongodb');
var MongoClient=mongo.MongoClient;
const mongoUrl=process.env.MongoUrl
dotenv.config();
var port=process.env.PORT||8124

var db;

app.get('/',(req,res)=>{
    res.send("Hii from Express")
})

app.get('/location',(req,res)=>{
  res.send("Hii from location url")
})

MongoClient.connect(mongoUrl,(err,client)=>{
  if(err) console.log("Error while connectiong")
  db=client.db('augintern')
  app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})

})

/*var location=[
    {
        "location_id": 1,
        "location_name": "Ashok Vihar Phase 3, New Delhi",
        "state_id": 1,
        "state": "Delhi",
        "country_name": "India"
      },
      {
        "location_id": 4,
        "location_name": "Bibvewadi, Pune",
        "state_id": 2,
        "state": "Maharashtra",
        "country_name": "India"
      },
      {
        "location_id": 8,
        "location_name": "Jeevan Bhima Nagar, Bangalore",
        "state_id": 3,
        "state": "Karnataka",
        "country_name": "India"
      },
      {
        "location_id": 13,
        "location_name": "Sector 40, Chandigarh",
        "state_id": 4,
        "state": "Punjab",
        "country_name": "India"
      }
]*/