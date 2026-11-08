import {Schema,model} from 'mongoose';
const schema=new Schema({name:{type:String,required:true,trim:true,maxlength:160},type:{type:String,required:true},country:{type:String,default:'',maxlength:100}},{timestamps:true});
export const Organization=model('Organization',schema);
