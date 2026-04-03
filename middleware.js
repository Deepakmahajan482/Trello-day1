const jwt=require("jsonwebtoken")
function authMiddleware(req,res,next){
  const token=req.headers.token;
  const decode=jwt.verify(token,"deepak1234");
  const userId=decode;
  if(userId){
    req.userId = decode.userId;
    next()
  }
  else{
    res.status(403).json({
      message:"the token is incorrect"
    })
  }
}

module.exports={
  authMiddleware:authMiddleware
}