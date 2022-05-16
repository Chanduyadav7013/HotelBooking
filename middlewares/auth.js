
const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
    const authHeader=req.get("authorization");
    if(!authHeader)
    {
        req.auth=false;
        return next();
    }
    const token= authHeader.split("")[1];
    if(!token){
        req.auth=false;
        return next();
    }
    try{
        const verifiedToken=jwt.verify(token,process.env.jwt_key)
        if(verifiedToken){
            req.userId=verifiedToken.userId
            req.email=verifiedToken.email;
            req.auth=true;
            return next();
        }
        else{
            req.auth=false;
            return next();
        }
    }
    catch(err){
        res.send(err)
    }
    
}