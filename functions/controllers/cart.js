const {db} = require('../utils/admin')


exports.addCart = (req,res,next)=>{
    let user;
    let cart;
    let newItem = req.body.product;
    console.log(newItem)

    db.doc(`/users/${req.user.userId}`).get()
    .then(doc=>{
        user = doc.data()
        cart = user.cart
        let index = cart.findIndex(p=>p.productId === newItem.productId)
        let item = cart.filter(p=>p.productId === newItem.productId)


        if(item.length !==0){
            item[0].count +=1;
            cart[index] = item[0]
        }
        else{
            newItem.count = 1;
            cart.push(newItem)
        }

        return db.doc(`/users/${req.user.userId}`).update({cart:cart})
    })
    .then(()=>{
        res.status(200).json({
            message:"Successfully updated cart"
        })
    })
    .catch(err=>{
        console.error(err)
        res.status(500).json({
            error:'Something went wrong',
            message:err.message
        })
    })



}

exports.removeItem = (req,res,next)=>{
    let user;
    let cart;
    let queryItem = req.body.product

    db.doc(`/users/${req.user.userId}`).get()
    .then(doc=>{

        user = doc.data()
        cart = user.cart;
        let index = cart.findIndex(p=>p.productId === queryItem.productId)
        let item = cart[index]
        let count = item.count;

        if(count>1){
            item.count -=1;
            cart[index] = item
        }
        else{
            cart.splice(index,1)
        }

       return db.doc(`/users/${req.user.userId}`).update({cart:cart})
    })
    .then(()=>{
        res.status(200).json({
            message:'cart updated successfully'
        })
    })
    .catch(err=>{
        console.error(err)
        escape.status(500).json({
            error:'Something went wrong',
            message:err.message 
        })
    })


}

exports.clearCart = (req,res,next)=>{

    db.doc(`/users/${req.user.userId}`).get()
    .then(doc=>{
        let user = doc.data()
        let cart = user.cart;
        cart = [];

        return db.doc(`/users/${req.user.userId}`).update({cart:cart})
    })
    .then(()=>{
        res.status(200).json({
            message:'Cart cleared succesfully'
        })
    })
    .catch(err=>{
        console.error(err)
        res.status(500).json({
            error:'Something went wrong',
            message:err.message
        })
    })


}