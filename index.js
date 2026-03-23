
//username,password /Users tables
//organization / ORGANIZATION TABLE
// boards /BOARDS TABLE
// issues/ ISSUES TABLE


const express=require('express')
const jwt=require('jsonwebtoken')
const {authMiddleware}=require('./middleware')

const SECRET_KEY="deepak1234"
const app=express();
app.use(express.json())
let USERS_ID=1;
let ORGANIZATION_ID=1;
let  BOARD_ID=1;
let ISSUE_ID=1;

const USERS=[{
  id:1,
  username:"Deepak",
  password:"1234"
},
{
  id:2,
  username:"Rahul",
  password:"1234"
}
];


const ORGANIZATION=[
  {
    id:1,
    title:"100xdevs",
    description:"Learning coding platform",
    admin:1,
    members:[2]
  },
  {
    id:1,
    title:"raman org",
    description:"Experimenting",
    admin:1,
    members:[]
  }
];


const BOARDS=[
  {
    id:1,
    title:"100xschool website (Frontend)",
    organizationId:1
  },

];


const ISSUES=[{
  id:1,
  title:"Add dark mode",
  boardId:1,
  state:"IN_PROGRESS"
},
{
  id:2,
  title:"Allow admin to create more courses",
  boardId:1,
  state:"DONE"
}
];


app.post("/signup",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const userExists=USERS.find(user=>user.username===username);
  if(userExists){
   return res.status(403).json({
      message:"the user is already exists"
    })
  }

  USERS.push({
    username,
    password,
    id:USERS_ID++
  })

  res.json({
    message:"user created successfully"
  })

})

app.post("/signin",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const userExists=USERS.find(user=>user.username===username && user.password===password);
  if(!userExists){
    res.status(403).json({
      message:"user is not created please created first"
    })
  }
  // create a jwt for the user
  const token=jwt.sign({userId:userExists.id},SECRET_KEY);
 res.json({
    token: token
  });
})


// Authenticated route - middleware
app.post("/organization",authMiddleware,(req,res)=>{
  const userId=req.userId;
  ORGANIZATION.push({
    id:ORGANIZATION_ID++,
    title:req.body.title,
    description:req.body.description,
    admin:userId,
    members:[]
  })
})

app.post("/add-member-to-organization",authMiddleware,(req,res)=>{
  const userId=req.userId
  const organizationId=req.body.organizationId
  const memberUserEmail=req.body.organizationId
  const organization =ORGANIZATION.find(org=>org.id===organizationId)
  if(!organization || organization.admin!=userId){
    return res.status(403).json({
      message:"either member not exist or you are not the admin"
    })
    
  }

})

app.post("/board",(req,res)=>{

})

app.post("/issue",(req,res)=>{

})


// Read backend.trello.com/boards:organizationId
app.get("/boards",(req,res)=>{

})

app.get("/issues",(req,res)=>{


})

app.get("/members",(req,res)=>{

})

// update
app.put("/issues",(req,res)=>{

})

// delete
app.delete("/members",(req,res)=>{

})
app.listen(3000,()=>{
  console.log("the server is running on http://localhost:3000/");
})

