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

//get locations
app.get('/locations',(req,res)=>{
    db.collection('locations').find().toArray((err,result)=>{
      if(err) throw err;
      res.send(result)
    })
      
  })
//get all mealtypes
  app.get('/mealType',(req,res)=>{
  db.collection('mealType').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})

//get all menu
app.get('/restaurantMenu',(req,res)=>{
  db.collection('restaurantMenu').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})
/*
//query to get all restaurantdada
app.get('/restaurantdata',(req,res)=>{
  db.collection('restaurantdata').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})
*/

//query to get rstaurantdata with restaurantId
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

// restaurant wrt to mealId
app.get('/filter/:mealId',(req,res) => {
  var id = parseInt(req.params.mealId);
  var sort = {cost:1}
  var skip = 0;
  var limit = 1000000000000
  var query = {"mealTypes.mealtype_id":id};
  if(req.query.sortKey){
      var sortKey = req.query.sortKey
      if(sortKey>1 || sortKey<-1 || sortKey==0){
          sortKey=1
      }
      sort = {cost: Number(sortKey)}
  }
  if(req.query.skip && req.query.limit){
      skip = Number(req.query.skip)
      limit = Number(req.query.limit)
  }

  if(req.query.lcost && req.query.hcost){
      var lcost = Number(req.query.lcost);
      var hcost = Number(req.query.hcost);
  }

  if(req.query.cuisine && req.query.lcost && req.query.hcost){
      query = {$and:[{cost:{$gt:lcost,$lt:hcost}}],
              "cuisines.cuisine_id":Number(req.query.cuisine),
              "mealTypes.mealtype_id":id}
  }
  else if(req.query.cuisine){
     query = {"mealTypes.mealtype_id":id,"cuisines.cuisine_id":Number(req.query.cuisine)}
     // query = {"mealTypes.mealtype_id":id,"cuisines.cuisine_id":{$in:[2,5]}}
  }else if(req.query.lcost && req.query.hcost){
      query = {$and:[{cost:{$gt:lcost,$lt:hcost}}],"mealTypes.mealtype_id":id}
  }

  db.collection('restaurantdata').find(query).sort(sort).skip(skip).limit(limit).toArray((err,result) =>{
      if(err) throw err;
      res.send(result) 
  })
})
  
/// wrt to city_name
app.get('/restaurantdata',(req,res) => {
  var query = {};
  if(req.query.city){
      query={state_id:Number(req.query.city)}
  }
  db.collection('restaurantdata').find(query).toArray((err,result) => {
      if(err) throw err;
      res.send(result)
  })
})

//query to get menu wih Id
app.get('/restaurantMenu/:restid',(req,res)=>{
  var restid=Number(req.params.restid);
  db.collection('restaurantMenu').find({restaurant_id:restid}).toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})

//query to get menuItem
app.post('/menuItem',(req,res)=>{
  console.log(req.body);
  db.collection('restaurantMenu').find({menu_id:{$in:req.body}}).toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})

//return all orders
app.get('/orders',(req,res)=>{
  var query=req.query.email;
  db.collection('orders').find({email:query}).toArray((err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})

app.post('/placeOrder',(req,res)=>{
  console.log(req.body);
  db.collection('orders').insert(req.body,(err,result)=>{
    if(err) throw err;
    res.send("Order Placed")
  })
})

//query to delete order with id
app.delete('/deleteOrder',(req,res)=>{
  db.collection('orders').remove({_id:id},(err,result) => {
      if(err) throw err;
      res.send(result)
  })
})

//query to delete all orders record
app.delete('/deleteOrders',(req,res)=>{
  db.collection('orders').remove({},(err,result)=>{
    if(err) throw err;
    res.send(result)
  })
})

//query to update orders
app.put('/updateStatus/:id',(req,res)=>{
  var id=Number(req.params.id);
  var status=req.body.status?req.body.status:"Pending"
  db.collection('orders').updateOne(
    {id:id},
    {
      $set:{
          "date":req.body.date,
          "bank_status":req.body.bank_status,
          "Bank":req.body.Bank,
          "status":status
      }
    }
  )
  res.send("Status Updated")
})



MongoClient.connect(mongoUrl,(err,client)=>{
  if(err) console.log("Error while connectiong")
  db=client.db('Hotel')
    app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
    })
})