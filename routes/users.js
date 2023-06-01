const express = require("express");
const bcrypt=require("bcrypt");
const { UserModel, userValid, loginValid, createToken } = require("../models/userModel");
const {auth}=require("../middlewares/auth");
const jwt=require("jsonwebtoken");
const router = express.Router();
router.get("/", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 5;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await UserModel
            .find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
})
router.get("/myEmail",auth, async(req,res)=>{
  try{
    let user=await UserModel.findOne({_id:req.tokenData._id},{email:1})
    res.json(user);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"err",err})
  }
})
router.get("/myInfo",async(req,res)=>{
  let token=req.header("x-api-key");
  if(!token){
    return res.status(401).json({msg:"You need to send token to thus endpoint url"});
  }
  try{
    let tokenData=jwt.verify(token,"MonkeysSecret");
    let user=await UserModel.findOne({_id:tokenData._id},{password:0});
    res.json(user);
  }
  catch(err){
    console.log(err);
    res.status(401).json({msg:"Token not valid or expired"});
  }
})
router.post("/", async (req, res) => {
    let validateBody = userValid(req.body);
    if (validateBody.error) {
        return res.status(400).json(validateBody.error.details)
    }
    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "*****"
        res.status(201).json(user);
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(400).json({ msg: "Email already in system try login", code: 11000 })
        }
        console.log(err);
        res.status(500).json({ msg: "err", err });
    }
})

router.post("/login", async(req,res) => {
    let valdiateBody = loginValid(req.body);
    if(valdiateBody.error){
      return res.status(400).json(valdiateBody.error.details)
    }
    try{
      // לבדוק אם המייל שנשלח בכלל יש רשומה של משתמש שלו
      let user = await UserModel.findOne({email:req.body.email})
      if(!user){
        // שגיאת אבטחה שנשלחה מצד לקוח
        return res.status(401).json({msg:"User and password not match 1"})
      }
      // בדיקה הסימא אם מה שנמצא בבאדי מתאים לסיסמא המוצפנת במסד
      let validPassword = await bcrypt.compare(req.body.password, user.password);
      if(!validPassword){
        return res.status(401).json({msg:"User and password not match 2"})
      }
      // בשיעור הבא נדאג לשלוח טוקן למשתמש שיעזור לזהות אותו 
      // לאחר מכן לראוטרים מסויימים
      let newToken=createToken(user._id);
      res.json({token:newToken});
    }
    catch(err){
      
      console.log(err)
      res.status(500).json({msg:"err",err})
    }
  })
module.exports = router;