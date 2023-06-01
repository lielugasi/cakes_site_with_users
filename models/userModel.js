const mongoose=require("mongoose");
const Joi=require("joi");
const jwt=require("jsonwebtoken");
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    date_created:{
        type:Date, default: Date.now()
    }
})
exports.UserModel=mongoose.model("users", userSchema);

exports.createToken=(user_id)=>{
    let token = jwt.sign({_id:user_id},"MonkeysSecret",{expiresIn:"60mins"});
    return token;
}
exports.userValid=(_bodyValid)=>{
    let joischema=Joi.object({
        name:Joi.string().min(2).max(50).required(),
        email:Joi.string().min(2).max(50).email().required(),
        password:Joi.string().min(6).max(50).required(),
    })
    return joischema.validate(_bodyValid);
}
exports.loginValid=(_bodyValid)=>{
    let joischema=Joi.object({
        email:Joi.string().min(2).max(100).email().required(),
        password:Joi.string().min(6).max(50).required(),
    })
    return joischema.validate(_bodyValid);
}