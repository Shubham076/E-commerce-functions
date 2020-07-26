const {db , admin} = require("../utils/admin")
const firebase = require("firebase")
const config = require("../utils/config")

firebase.initializeApp(config)


exports.login = (req,res,next)=>{


    let email = req.body.email
    let password = req.body.password
    let user

    user = db.collection('users').where('email','==',email)
    let token;

    firebase.auth().signInWithEmailAndPassword(email , password)
    .then(data=>{
        return data.user.getIdToken();
    })
    .then(idToken=>{
        token = idToken
     return user.get()
    })
    .then(foundUser=>{
        let data = foundUser.docs[0].data()
        
        res.status(201).json({
            message:"Successsfully signed in",
            token:token,
            username:data.username,
            admin:data.admin

        })
    })

    .catch(err=>{
        console.error(err)
        res.status(500).json({
            error:"Something went wrong",
            message:err.message

        })
    })


}

exports.validateUsername = (req,res,next)=>{

    const username = req.body.username;

    let user = db.collection('users').where('username',"==",username)


        user.get()
        .then(data=>{
            if(data.empty){
                return res.status(200).json({
                    message:"No user found",
                    found:false
                })
            }

            else{
                return res.status(200).json({
                    message:"user exists",
                    found:true
                })
            }
                
            
    
          
        })
        .catch(error=>{
            console.error(error)
            res.status(500).json({
                error:"Something went wrong",
                message:error.message
            })
        })

    
 

  
}



exports.signUp = (req,res,next)=>{

    const newUser = {
        admin : req.body.admin,
        email : req.body.email,
         password : req.body.password,
         username : req.body.username

    }
   

    let token;
    let userId;
    let user = db.collection('users').where('username','==',newUser.username)
    let userdata

        user.get()
        .then(data=>{
            if(!data.empty){
                return res.status(400).json({
                    message:"user Already exists"
                })
            }
            else{

                return firebase.auth().createUserWithEmailAndPassword(newUser.email ,newUser.password)
        
            }
        })
        .then(data=>{
            userId=data.user.uid
            return data.user.getIdToken();
        })
        .then(idToken=>{

            token = idToken;

            const userCredentials = {
                username:newUser.username,
                userId:userId,
                createdAt:new Date().toISOString(),
                email:newUser.email,
                admin:newUser.admin,
                cart:[]
            }

            userdata = userCredentials
        
            db.doc(`/users/${userId}`).set(userCredentials)
                
            



        })
        .then(()=>{
            res.status(200).json({
                message:"user created successfully",
                token:token,
                admin:userdata.admin,
                username:userdata.username

            })
        })

        .catch(err=>{
            console.error(err)
            return res.status(500).json({
                message:err.message,
                error:'Something went wrong'
            })
        })




}

exports.getUserDetails = (req,res,next)=>{
    let username = req.body.username;

  

    db.collection('users').where('username','==',username).limit(1).get()
    .then(data=>{

        if(!data.empty){
            let user = data.docs[0].data();
            return res.status(200).json({
                userData:user
            })
        }

        return res.staus(404).json({
            message:"User not found"
        })


    })

    .catch(err=>{
        console.error(err)
        res.status(500).json({
            error:"Something went wrong",
            message:err.message
        })
    })
}
