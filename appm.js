var express=require('express');
var app=express();
var dotenv=require('dotenv');
var mongo=require('mongodb');
var MongoClient=mongo.MongoClient;
dotenv.config();
const mongoUrl='mongodb+srv://LocationDataTest:test@cluster0.sae9v.mongodb.net/Hotel?retryWrites=true&w=majority';
var cors=require('cors')
const bodyParser=require('body-parser')
var port=process.env.PORT||8124;

var db;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

//first default route
app.get('/',(req,res)=>{
    res.send("Hii from Express")
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

/*app.get('/filter/:mealId',(req,res)=>{
  var id=parseInt(req.params.mealId);
  db.collection('restaurantdata').find({"mealTypes.mealtype_id":id}).toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})*/

//query on the basis of mealId and cuisine
app.get('/filter/:mealId',(req,res)=>{
  var id=parseInt(req.params.mealId);
  var sort={cost:1}
  var query={"mealTypes.mealtype_id":id}

  if(req.query.sortKey){
    var sortKey=req.query.sortKey
    if(sortKey>1 || sortKey<-1 || sortKey==0){
        sortKey=1
    }
    sort={cost:Number(sortKey)}
  }

  if(req.query.lcost&&req.query.hcost){
    var lcost=Number(req.query.lcost);
    var hcost=Number(req.query.hcost);
  }

  if(req.query.cuisine && req.query.lcost && req.query.hcost){
    query={$and:[{cost:{$gt:lcost,$lt:hcost}}],"cuisines.cuisine_id":Number(req.query.cuisine),"mealTypes.mealtype_id":id}
  } else if(req.query.cuisine){
      query={"mealTypes.mealtype_id":id,"cuisines.cuisine_id":Number(req.query.cuisine)}
    //query={"mealTypes.mealtype_id":id,"cuisines.cuisine_id":{$in:[2,5]}}
  }
//query on basis of cost
  else if(req.query.lcost&&req.query.hcost){ 
    query={$and:[{cost:{$gt:lcost,$lt:hcost}}],"mealTypes.mealtype_id":id}
  }

  db.collection('restaurantdata').find(query).sort(sort).toArray((err,result)=>{
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

app.get('/restaurantMenu/:restid',(req,res)=>{
  var restid=Number(req.params.restid);
  db.collection('restaurantMenu').find({"restaurant_id":restid}).toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})

MongoClient.connect(mongoUrl,(err,client)=>{
  if(err) console.log("Error while connectiong")
  db=client.db('Hotel')
    app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
    })
})