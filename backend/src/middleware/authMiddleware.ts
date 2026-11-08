import type {RequestHandler} from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {env} from '../config/env.js';
import {User} from '../models/User.js';
import {ApiError} from './errorMiddleware.js';
import {safeUser} from '../services/authService.js';
declare module 'express-serve-static-core'{interface Request{user?:ReturnType<typeof safeUser>}}
export const authenticate:RequestHandler=async(req,_res,next)=>{
 let id:string;
 try{
  const payload=jwt.verify(req.cookies?.textiletrace_session??'',env.JWT_SECRET,{algorithms:['HS256'],issuer:'textiletrace',audience:'textiletrace-web'});
  if(typeof payload==='string'||!payload.sub||!mongoose.isValidObjectId(payload.sub))throw new Error();
  id=payload.sub;
 }catch{next(new ApiError(401,'Authentication required'));return;}
 try{const user=await User.findById(id);if(!user?.isActive)throw new ApiError(401,'Authentication required');req.user=safeUser(user);next();}catch(err){next(err);}
};
