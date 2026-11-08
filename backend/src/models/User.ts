import {Schema,model} from 'mongoose';
export const roles=['manufacturer','supplier','certification_reviewer','retailer','admin'] as const;
export type Role=typeof roles[number];
const schema=new Schema({
 fullName:{type:String,required:true,trim:true,maxlength:120},
 email:{type:String,required:true,unique:true,lowercase:true,trim:true},
 passwordHash:{type:String,required:true,select:false},
 role:{type:String,enum:roles,default:'manufacturer',required:true},
 organizationId:{type:Schema.Types.ObjectId,ref:'Organization',required:true},
 isActive:{type:Boolean,default:true}
},{timestamps:true,toJSON:{transform:(_doc,ret)=>{delete (ret as Record<string,unknown>).passwordHash;return ret;}}});
export const User=model('User',schema);
