
let {db , admin} = require("../utils/admin")

exports.createProduct = (req,res,next)=>{

    if(req.user.admin){

        let newProduct = {
            name:req.body.name,
            price:req.body.price,
            imgUrl:req.body.imgUrl,
            category:req.body.category,
            quantity:req.body.quantity,
            createdBy:req.user.userId,
            createdAt:new Date().toISOString()
        }
    
        db.collection('products').add(newProduct)
        .then(doc=>{
            
            res.status(200).json({
                message:"Product created successfully",
                id:doc.id
            })
        })
    
        .catch(err=>{
            console.error(err)
            res.status(500).json({
                message:err.message,
                error:"Something went wrong"
            })
        })

    }

    else{
        res.status(400).json({
            message:"Only admins can create a product. Please create a admin account"
        })
    }
 
    

}

exports.getProducts = (req,res,next)=>{

    let products = []

    db.collection('products').get()
    .then(data=>{
        data.forEach(doc=>{
            let product = doc.data();
            product.productId = doc.id
            products.push(product)

        })

        res.status(200).json({
            products:products
        })

    })
    .catch(error=>{
        console.error(err)
        res.status(500).json({
            error:"Something went wrong",
            message:err.message
        })
    })
}

exports.getAdminProducts = (req,res,next)=>{
    let id = req.user.userId;
    let products = []

    db.collection('products').where('createdBy','==',id).orderBy("createdAt","desc").get()
    .then(data=>{
        data.forEach(doc=>{

            let product = {
                category:doc.data().category,
                productId:doc.id,
                name:doc.data().name,
                price:doc.data().price,
                quantity:doc.data().quantity
            }

            products.push(product)

        })

        return res.status(200).json({
            products:products
        })
    })
    .catch(err=>{
        console.error(err)
        res.status(500).json({
            error:"Something went wrong",
            message:error.message
        })
    })
}

exports.updateProduct = (req,res,next)=>{

    let id = req.params.id;
    let updatedProduct = req.body.product;

    db.doc(`/products/${id}`).update(updatedProduct)
    .then(()=>{
        res.status(200).json({
            message:"Successfully updated"
        })
    })
    .catch(err=>{
        console.error(err)
        res.status.json({
            message:err.message,
            message:"Something went wrong"
        })
    })

}