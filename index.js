
//username,password /Users tables
//organization / ORGANIZATION TABLE
// boards /BOARDS TABLE
// issues/ ISSUES TABLE


const express=require('express')
const jwt=require('jsonwebtoken')
const {authMiddleware}=require('./middleware')
const {userModel,organizationModel,boardModel}=require('./models')


const SECRET_KEY="deepak1234"
const app=express();
app.use(express.json())


let ORGANIZATION_ID=3;
let  BOARD_ID=2;
let ISSUE_ID=2;



const ORGANIZATION=[
  {
    id:1,
    title:"100xdevs",
    description:"Learning coding platform",
    admin:1,
    members:[2]
  },
  {
    id:2,
    title:"mai hu doon",
    description:"Learning things",
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





app.post("/signup",async (req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const userExists=await userModel.findOne({
    username:username
  })
  if(userExists){
   return res.json({
    message:false
   })
  }

 const user=await userModel.create({
    username:username,
    password:password
  })
  res.json({
    message:"user created successfully"
  })

})

app.get("/signup",(req,res)=>{
   res.sendFile("D:/mern/caseStudies/express/Trello/frontend/signup.html")
})

app.post("/signin",async (req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const userExists=await userModel.findOne({
    username:username,
    password:password
  })
  if(!userExists){
    res.json({token:false})
    return
  }
  // create a jwt for the user
  const token=jwt.sign({userId:userExists._id},SECRET_KEY);
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
app.post("/organization",authMiddleware,async(req,res)=>{
  
  const userId=req.userId;
  const organization=await organizationModel.create({
    title:req.body.title,
    description:req.body.description,
    admin:userId,
    members:[userId]
  })
  res.json({
    message:"ORG created",
    id:organization._id
  })
})



app.post("/addmembertoorganization", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const organizationId = req.body.organizationId;
  const memberUsername = req.body.memberUserUsername;

  const organization = await organizationModel.findById(organizationId)
  // console.log("userid",userId," organizationId",organizationId," memberusername",memberUsername," organization",organization)

  if (!organization) {
    return res.status(404).json({
      message: "Organization not found"
    });
  }

    organization.members = organization.members || [];
  

  const memberUser = await userModel.findOne({
    username:memberUsername
  });

  if (!memberUser) {
    return res.status(404).json({
      message: "User not found"
    });
  }

  if (!organization.members.some(m => m && m.equals(memberUser._id)) &&
      !organization.admin.equals(memberUser._id)) {
    organization.members.push(memberUser._id);
    await organization.save();
  }
  
  res.json({
    message: "true"
  });
  
});
app.get("/org",(req,res)=>{
res.sendFile("D:/mern/caseStudies/express/Trello/frontend/organization.html")
})


app.get("/organization", authMiddleware,async (req, res) => {
  const userId = req.userId;
  const organizationId = req.query.organizationId;

  const organization =await organizationModel.findById(organizationId)
  .populate("members", "username");;

  if (!organization) {
    return res.status(404).json({
      message: "Organization not found"
    });
  }

  

  res.json({
    organization: {
      id: organization._id,
      title: organization.title,
      members: organization.members
    }
  });
});
app.post("/board",async(req,res)=>{
  const organizationId=req.body.organizationId
  const title=req.body.title
  const organization=await organizationModel.findById(organizationId)
  if(!organization){
    res.status(403).json({
      message:"organization not found"
    })
    return 
  }

  const board=await boardModel.create({
   title:title,
   organizationId:organizationId 
  })
 
  res.json({
    message:"Done"
  })
})



// Read backend.trello.com/boards:organizationId
app.get("/dashboard",(req,res)=>{
  res.sendFile("D:/mern/caseStudies/express/Trello/frontend/dashboard.html")
})
app.get("/boards",authMiddleware,async(req,res)=>{
  const UserId=req.userId;
  const organizationId=req.query.organizationId
  const BoardFind=await boardModel.find({
    organizationId:organizationId
  })
  if(BoardFind.length==0){
    res.status(403).json({
      message:"board is not there"
    })
  }
  res.json({
    Board:BoardFind
  })
})

app.get("/optionsOrg",authMiddleware,async(req,res)=>{
  const userId=req.userId
  const organization=await organizationModel.find({
    admin:userId
  })
  if(!organization){
    res.status(403).json({
      message:"not found"
    })
    return 
  }
  res.json({
    message:"found",
    organizationData:organization
  })
})


app.listen(3000,()=>{
  console.log("the server is running on http://localhost:3000/");
})

