const express=require("express");
const {CakeModel, validateCake} =require("../models/cakeModel");
const router=express.Router();
const {auth}=require("../middlewares/auth");

router.get("/",async(req,res)=>{
    let perPage=Math.min(req.query.perPage,20)||5;
    let page= req.query.page||1;
    let sort=req.query.sort||"_id";
    let reverse=req.query.reverse=="yes"?-1:1;

    try{
        let data=await CakeModel
        .find({})
        .limit(perPage)
        .skip((page-1)*perPage)
        .sort({[sort]:reverse})
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"err",err});
    }
})

router.post("/", auth, async(req,res)=>{
    let validatBody=validateCake(req.body);
    if(validatBody.error){
        return res.status(400).json(validatBody.error.details)
    }
    try{
        let cake=new CakeModel(req.body);
        cake.user_id=req.tokenData._id;
        await cake.save();
        res.status(201).json(cake);
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"err",err});
    }
})

router.put("/:idEdit",auth, async(req,res)=>{
    let validateBody=validateCake(req.body);
    if(validateBody.error){
        return res.status(400).json(validateBody.error.details)
    }
    try{
        let idEdit=req.params.idEdit;
        let data= await CakeModel.updateOne({_id:idEdit,user_id:req.tokenData._id}, req.body)
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"err",err});
    }
})
router.delete("/:idDel",auth, async(req,res)=>{
    try{
        let idDel=req.params.idDel;
        let data= await CakeModel.deleteOne({_id:idDel, user_id:req.tokenData._id})
        res.status(201).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"err",err});
    }
})
module.exports=router;