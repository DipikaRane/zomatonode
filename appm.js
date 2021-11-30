var express=require('express');
var app=express();
var dotenv=require('dotenv');
var mongo=require('mongodb');
var MongoClient=mongo.MongoClient;
dotenv.config();
const mongoUrl='mongodb+srv://LocationDataTest:test@cluster0.sae9v.mongodb.net/Hotel?retryWrites=true&w=majority';
var cors=require('cors')
const bodyParser=require('body-parser')
var port=8275;/*process.env.PORT||8124;*/

var db;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

//first default route
app.get('/',(req,res)=>{
    res.send("Hii from Express")
})

app.get('/location',(req,res)=>{
  db.collection('location').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
    
})

app.get('/locations',(req,res)=>{
    db.collection('locations').find().toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
    })
      
  })

  app.get('/mealType',(req,res)=>{
  db.collection('mealType').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})

app.get('/restaurantMenu',(req,res)=>{
  db.collection('restaurantMenu').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})

app.get('/restaurantdata',(req,res)=>{
  db.collection('restaurantdata').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})

app.get('/restaurantdata/:id',(req,res)=>{
  var id=parseInt(req.params.id);
  db.collection('restaurantdata').find({"restaurant_id":id}).toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
    
  })

  
app.get('/orders',(req,res)=>{
  db.collection('orders').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})

/*app.get('/',(req,res)=>{
  db.collection('').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})*/
MongoClient.connect(mongoUrl,(err,client)=>{
  if(err) console.log("Error while connectiong")
  db=client.db('Hotel')
    app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
    })
})