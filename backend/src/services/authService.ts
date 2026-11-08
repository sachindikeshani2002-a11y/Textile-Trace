import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../models/User.js';
import {Organization} from '../models/Organization.js';
import {ApiError} from '../middleware/errorMiddleware.js';
import {env} from '../config/env.js';
// Equal bcrypt work for unknown email and incorrect password.
const dummyHash=await bcrypt.hash('unusable-account-password',12);
export function safeUser(user:any){return {id:String(user._id),fullName:user.fullName,email:user.email,role:user.role,organizationId:String(user.organizationId),isActive:user.isActive,createdAt:user.createdAt,updatedAt:user.updatedAt};}
export function issueToken(id:string){return jwt.sign({},env.JWT_SECRET,{subject:id,algorithm:'HS256',expiresIn:env.JWT_EXPIRES_IN,issuer:'textiletrace',audience:'textiletrace-web'});}
export async function login(email:string,password:string){
 const user=await User.findOne({email}).select('+passwordHash');
 const valid=await bcrypt.compare(password,String(user?.passwordHash??dummyHash));
 if(!user||!valid||!user.isActive)throw new ApiError(401,'Invalid email or password');
 return safeUser(user);
}
export async function register(input:{fullName:string;email:string;password:string;organizationName:string;country?:string}){
 if(await User.exists({email:input.email}))throw new ApiError(409,'Unable to register with these details');
 const passwordHash=await bcrypt.hash(input.password,12);
 const organization=await Organization.create({name:input.organizationName,type:'manufacturer',country:input.country??''});
 try{
  const user=await User.create({fullName:input.fullName,email:input.email,passwordHash,role:'manufacturer',organizationId:organization._id});
  return safeUser(user);
 }catch(err){await Organization.deleteOne({_id:organization._id});throw err;}
}
