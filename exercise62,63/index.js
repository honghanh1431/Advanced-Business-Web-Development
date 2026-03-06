const express = require('express');
const app = express();
const port = 3002;

const morgan=require("morgan")
app.use(morgan("combined"))

const bodyParser=require("body-parser")
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb' }));
app.use(express.json());

const cors=require("cors");
app.use(cors())

app.listen(port,()=>{
    console.log(`My Server listening on port ${port}`)
})

app.get("/",(req,res)=>{
    res.send("This Web server is processed for MongoDB")
})

const { MongoClient, ObjectId } = require('mongodb');
client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
database = client.db("FashionData");
fashionCollection = database.collection("Fashion");
userCollection = database.collection("User");
productCollection = database.collection("Product");

app.get("/fashions",cors(),async (req,res)=>{
    const result = await fashionCollection.find({}).toArray();
    res.send(result)
    }
)
app.get("/fashions/:id",cors(),async (req,res)=>{
    var o_id = new ObjectId(req.params["id"]);
    const result = await fashionCollection.find({_id:o_id}).toArray();
    res.send(result[0])
    }
)
app.post("/fashions",cors(),async(req,res)=>{
    //put json Fashion into database
    await fashionCollection.insertOne(req.body)
    //send message to client(send all database to client)
    res.send(req.body)
})

var cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get("/create-cookie",cors(),(req,res)=>{
    res.cookie("username","nguyenthihonghanh")
    res.cookie("password","123456")
    account={"username":"nguyenthihonghanh",
    "password":"123456"}
    res.cookie("account",account)
    res.send("cookies are created")
    //Expires after 360000 ms from the time it is set.
    res.cookie("infor_limit1", 'I am limited Cookie - way 1', {expires: 360000 +
    Date.now()});
    res.cookie("infor_limit2", 'I am limited Cookie - way 2', {maxAge: 360000});
})

app.get("/read-cookie",cors(),(req,res)=>{
    //cookie is stored in client, so we use req
    username=req.cookies.username
    password=req.cookies.password
    account=req.cookies.account
    infor="username = "+username+"<br/>"
    infor+="password = "+password+"<br/>"
    infor+="account.username = "+account.username+"<br/>"
    infor+="account.password = "+account.password+"<br/>"
    res.send(infor)

    //cookie is stored in client, so we use req
    username=req.cookies.username
    password=req.cookies.password
    account=req.cookies.account
    infor="username = "+username+"<br/>"
    infor+="password = "+password+"<br/>"
    if(account!=null)
    {
        infor+="account.username = "+account.username+"<br/>"
        infor+="account.password = "+account.password+"<br/>"
    }
    res.send(infor)
})

app.get("/clear-cookie",cors(),(req,res)=>{
    res.clearCookie("account")
    res.send("[account] Cookie is removed")
})

app.post("/login",cors(),async (req,res)=>{

    const username = req.body.username
    const password = req.body.password

    const user = await userCollection.findOne({
        username: username,
        password: password
    })

    if(user){
        res.cookie("username",username)
        res.cookie("password",password)

        res.send({
            message:"Login successful",
            user:user
        })
    }
    else{
        res.status(401).send({
            message:"Login failed"
        })
    }

})

app.get("/get-login-cookie",cors(),(req,res)=>{

    const username=req.cookies.username
    const password=req.cookies.password

    res.send({
        username:username,
        password:password
    })

})

var session = require('express-session');
app.use(session({secret: "Shh, its a secret!"}));

app.get("/contact",cors(),(req,res)=>{
    if(req.session.visited!=null)
    {
        req.session.visited++
        res.send("You visited this page "+req.session.visited +" times")
    }
    else
    {
        req.session.visited=1
        res.send("Welcome to this page for the first time!")
    }
})

app.get("/products",cors(),async (req,res)=>{

    const result = await productCollection.find({}).toArray();
    res.send(result)

})

app.post("/add-to-cart",cors(),async (req,res)=>{

    const productId = req.body.productId

    const product = await productCollection.findOne({
        _id:new ObjectId(productId)
    })

    if(!req.session.cart){
        req.session.cart=[]
    }

    let cart = req.session.cart

    const existing = cart.find(p=>p._id == productId)

    if(existing){
        existing.quantity += 1
    }
    else{
        cart.push({
            _id:productId,
            name:product.name,
            price:product.price,
            quantity:1
        })
    }

    req.session.cart = cart

    res.send(cart)

})

app.get("/cart",cors(),(req,res)=>{

    if(!req.session.cart){
        req.session.cart=[]
    }

    res.send(req.session.cart)

})

app.post("/update-cart",cors(),(req,res)=>{

    const {productId,quantity} = req.body

    let cart = req.session.cart || []

    cart.forEach(p=>{
        if(p._id == productId){
            p.quantity = quantity
        }
    })

    req.session.cart = cart

    res.send(cart)

})

app.post("/remove-cart",cors(),(req,res)=>{

    const productId = req.body.productId

    let cart = req.session.cart || []

    cart = cart.filter(p=>p._id != productId)

    req.session.cart = cart

    res.send(cart)

})