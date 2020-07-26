const express = require('express')
const  app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const functions = require("firebase-functions")
const {login , signUp , validateUsername , getUserDetails} = require("./controllers/auth")
const {createProduct , getProducts ,getAdminProducts , updateProduct} = require("./controllers/product")
const {addCart , removeItem ,clearCart} = require("./controllers/cart")
const {isAuth}  = require("./middleware/isAuth")
const {postOrder,getOrders} = require("./controllers/order")

app.use(cors())
app.use(bodyParser.json())


app.post("/login",login)
app.post("/signUp", signUp)
app.post("/validateUsername" , validateUsername)
app.post("/user" ,isAuth, getUserDetails)


app.post("/createProduct" , isAuth , createProduct)
app.get("/getProducts" , getProducts)
app.get("/getAdminProducts",isAuth ,getAdminProducts)
app.put("/product/:id",isAuth,updateProduct)

app.post("/cart",isAuth,addCart)
app.post("/cart/remove",isAuth,removeItem)
app.get("/cart/clear",isAuth,clearCart)


app.post("/order",isAuth,postOrder)
app.get("/order",isAuth,getOrders)


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


exports.api = functions.https.onRequest(app);
