const express = require('express');
const router = express.Router();
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const User = require('../models/userModel');
const { is } = require('express/lib/request');
router.post("/signup",async(req,res)=>{
    try{
        const checkuser=await User.find({email:req.body.email})
        
        if(checkuser.length>0){
            res.send('mail already registered');
            return;
        }
        const salt=await bcrypt.genSalt();
            const password=await bcrypt.hash(req.body.password,salt);
        const data= await User.create({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:password
        })
        res.send(data);
        return;
    }
    catch(err){
        res.send(err);
    }
})
router.get("/signin", async (req,res) => {
    try{
        const mail = await User.find({email:req.body.email});
        if(mail.length == 0 ) {
            res.send("wrong email");
            return;
        }
        const password = mail[0].password;
        const checkPass = await bcrypt.compare(req.body.password,password);
        console.log(checkPass);
        if(checkPass) {
            const token = jwt.sign({
                userid: mail[0]._id,
                email: mail[0].email,
            },process.env.jwt_key,{expiresIn: "5days"});
            res.send(token);
            return;
        }
        else {
            res.send("Wrong Password")
        }
    }
    catch(err) {
        res.send(err);
    }
})

// get a list of users from db
router.get('/users', (req, res, next) => {
    if(is.Auth){
        User.find({})
    .then( user => res.send(user) );
    }
    else{
        res.send({err:"please login"})
    }
});


// add a new hotel to db
router.post('/users', (req, res, next) => {
    if(is.Auth){
        User.create(req.body)
        .then( user => {
            res.send(user);
        }).catch(next);
    }
    else{
        res.send({err:"please login"})
    }
});

//update a hotel in db
router.put('/users/:id', (req, res, next) => {
    if(is.Auth){
        User.findByIdAndUpdate({_id: req.params.id}, req.body)
        .then(() => {
            User.findOne({_id: req.params.id})
            .then( user => {
                res.send(user);
            });
        });
    }
    else{
        res.send({err:"please login"})
        
        
    }
    
});

//delete a hotel form db
router.delete('/users/:id', (req, res, next) => {
    User.findByIdAndRemove({_id: req.params.id})
    .then( user => {
        res.send(user);
    });
});

module.exports = router;