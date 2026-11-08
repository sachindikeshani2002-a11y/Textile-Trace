import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {env} from '../config/env.js';
import {connectDB} from '../config/db.js';
import {User,roles} from '../models/User.js';
import {Organization} from '../models/Organization.js';
if(env.NODE_ENV!=='development')throw new Error('Demo seeding is allowed only in development');
try{
 await connectDB();
 for(const role of roles){
  const email=role+'@textiletrace.example';
  if(await User.exists({email})){console.log('Already exists: '+email);continue;}
  const org=await Organization.create({name:'Demo '+role,type:role,country:'Sri Lanka'});
  try{await User.create({fullName:'Demo '+role,email,passwordHash:await bcrypt.hash('TextileDemo!2026',12),role,organizationId:org._id});}
  catch(err){await Organization.deleteOne({_id:org._id});throw err;}
  console.log('Created: '+email);
 }
}finally{await mongoose.disconnect();}
