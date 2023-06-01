const mongoose=require("mongoose");
const Joi=require("joi");
const cakeSchema=new mongoose.Schema({
    name:String,
    cals:Number,
    price:Number,
    user_id:String
})
exports.CakeModel=mongoose.model("cakes", cakeSchema);

exports.validateCake=(_reqBody)=>{
    let schemaJoi=Joi.object({
        name:Joi.string().min(2).max(99).required(),
        cals:Joi.number().min(1).max(9999999999).required(),
        price:Joi.number().min(1).max(3000000000000).required()
    })
    return schemaJoi.validate(_reqBody);
}