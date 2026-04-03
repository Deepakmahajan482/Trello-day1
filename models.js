const url='mongodb+srv://Deepak:password@trello.zj9o2t8.mongodb.net/Trello'
const mongoose=require('mongoose')
mongoose.connect(url)
const UserSchema=new mongoose.Schema({
  username:String,
  password:String
})

const organizationSchema=new mongoose.Schema({
  title:String,
    description:String,
    admin:mongoose.Types.ObjectId,
    members:[
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  }
]
})

const boardSchema=new mongoose.Schema({
    title:String,
    organizationId:mongoose.Types.ObjectId
})

const issueSchema=new mongoose.Schema({
title:String,
description:String
})

const userModel=mongoose.model('Users',UserSchema)
const organizationModel=mongoose.model('organizations',organizationSchema)
const boardModel=mongoose.model('boards',boardSchema)
const issueModel=mongoose.model('issues',issueSchema)


module.exports={
  userModel:userModel,
  organizationModel:organizationModel,
  boardModel:boardModel,
  issueModel:issueModel
}