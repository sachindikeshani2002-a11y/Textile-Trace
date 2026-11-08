import type {RequestHandler,CookieOptions,Response} from 'express';
import {env,sessionSeconds} from '../config/env.js';
import {loginSchema,registerSchema} from '../validators/authValidation.js';
import * as auth from '../services/authService.js';
export const cookieOptions:CookieOptions={httpOnly:true,secure:env.NODE_ENV==='production',sameSite:'lax',path:'/'};
function session(res:Response,user:ReturnType<typeof auth.safeUser>,status=200){res.cookie('textiletrace_session',auth.issueToken(user.id),{...cookieOptions,maxAge:sessionSeconds*1000});res.status(status).json({user});}
export const register:RequestHandler=async(req,res)=>{session(res,await auth.register(registerSchema.parse(req.body)),201);};
export const login:RequestHandler=async(req,res)=>{const input=loginSchema.parse(req.body);session(res,await auth.login(input.email,input.password));};
export const me:RequestHandler=(req,res)=>{res.json({user:req.user});};
export const logout:RequestHandler=(_req,res)=>{res.clearCookie('textiletrace_session',cookieOptions);res.json({message:'Signed out'});};
