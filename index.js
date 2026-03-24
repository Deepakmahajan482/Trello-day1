
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

let USERS_ID=2;
let ORGANIZATION_ID=2;
let  BOARD_ID=2;
let ISSUE_ID=2;

const USERS=[{
  id:1,
  username:"Deepak",
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
  }
];


const BOARDS=[
  {
    id:1,
    title:"100xschool website (Frontend)",
    organizationId:1
  }
];


const ISSUES=[{
  id:1,
  title:"Add dark mode",
  boardId:1,
  state:"IN_PROGRESS"
}
];


app.post("/signup",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const userExists=USERS.find(user=>user.username===username);
  if(userExists){
   return res.json({
    message:false
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

app.get("/signup",(req,res)=>{
   res.sendFile("D:/mern/caseStudies/express/Trello/frontend/signup.html")
})

app.post("/signin",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const userExists=USERS.find(user=>user.username===username && user.password===password);
  if(!userExists){
    res.json({token:false})
    return
  }



  // create a jwt for the user
  const token=jwt.sign({userId:userExists.id},SECRET_KEY);
 res.json({
    token: token
  });
})


  app.get("/signin",(req,res)=>{
    res.sendFile("D:/mern/caseStudies/express/Trello/frontend/signin.html")
  })

app.get("/onboarding",(req,res)=>{
  res.sendFile("D:/mern/caseStudies/express/Trello/frontend/onboarding.html")
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
  res.json({
    message:"ORG created",
    id:ORGANIZATION_ID-1 
  })
})



app.post("/addmembertoorganization", authMiddleware, (req, res) => {
  const userId = req.userId;
  const organizationId = req.body.organizationId;
  const memberUsername = req.body.memberUserUsername;

  const organization = ORGANIZATION.find(org => org.id == organizationId);
  // console.log("userid",userId," organizationId",organizationId," memberusername",memberUsername," organization",organization)

  if (!organization) {
    return res.status(404).json({
      message: "Organization not found"
    });
  }

  if (organization.admin != userId) {
    return res.status(403).json({
      message: "You are not the admin"
    });
  }

  const memberUser = USERS.find(u => u.username == memberUsername);

  if (!memberUser) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  if(!organization.members.includes(memberUser.id)){
  organization.members.push(memberUser.id);
  }

  res.json({
    message: "true"
  });
  
});
app.get("/org",(req,res)=>{
res.sendFile("D:/mern/caseStudies/express/Trello/frontend/organization.html")
})


app.get("/organization", authMiddleware, (req, res) => {
  const userId = req.userId;
  const organizationId = req.query.organizationId;

  const organization = ORGANIZATION.find(org => org.id == organizationId);

  if (!organization) {
    return res.status(404).json({
      message: "Organization not found"
    });
  }

  // admin ya member hi dekh sakta
  if (organization.admin != userId && !organization.members.includes(userId)) {
    return res.status(403).json({
      message: "Not authorized"
    });
  }

  const members = organization.members.map(memberId => {
    const user = USERS.find(u => u.id == memberId);
    return {
      id: user.id,
      username: user.username
    };
  });

  res.json({
    organization: {
      id: organization.id,
      title: organization.title,
      members: members
    }
  });
});
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
app.delete("/members",authMiddleware,(req,res)=>{
  const userId=req.userId
  const organizationId=req.body.organizationId
  const memerUsername=req.body.memberUserUsername

  const organization =ORGANIZATION.find(org=>org.id==organizationId)
  if(!organization || organization.admin!=userId){
     res.status(411).json({
      message:"either member not exist or you are not the admin"
    })
    return  
  }
  const memberUser=USERS.find(u=>u.username===memerUsername);
  if(!memerUsername){
    res.status(411).json({
      message:"No user with this username exists in our db"
    })
  }

  organization.members=organization.members.filter(user=>user.id!==memberUser.id);
  res.json({
    message:"user added to organization"
  })
})
app.listen(3000,()=>{
  console.log("the server is running on http://localhost:3000/");
})

