const {db , admin} = require("../utils/admin")

exports.isAuth = (req,res,next)=>{

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token =req.headers.authorization.split(" ")[1]
    }

    else{
    console.log(token)

        return res.status(401).json({
            
            message:"Unauthorized"
        })
    }

    admin.auth().verifyIdToken(token)
    .then(decodedToken=>{

            req.user = decodedToken

            return db.doc(`/users/${req.user.uid}`).get()
        

      
    })
    .then(doc=>{


        req.user.userId = doc.data().userId
        req.user.username = doc.data().username
        req.user.admin = doc.data().admin

        next()

    })
    .catch(err=>{
        console.error(err)
        res.status(500).json({
            message:"Something went wrong",
            error:err.message
        })
    })
}