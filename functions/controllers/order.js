const {db} = require("../utils/admin")

exports.postOrder = (req,res,next)=>{
    let order = req.body.order;
    
    order.userId = req.user.userId

    db.collection("orders").add(order)
    .then(()=>{
        res.status(200).json({
            'message':'Order place successfully'
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

exports.getOrders = (req,res,next)=>{

    let id = req.user.userId

    db.collection('orders').where('userId','==',id).get()
    .then(data=>{
        let orders = []
        data.forEach(doc=>{
            let order={
                orderId:doc.id,
                ...doc.data()
            }
            orders.push(order)
        })

        res.status(200).json({
            orders:orders
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