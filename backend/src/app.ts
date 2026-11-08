import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import {env} from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import {ApiError,errorMiddleware} from './middleware/errorMiddleware.js';
export const app=express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({origin:env.FRONTEND_URL,credentials:true}));
app.use((req,res,next)=>{
 res.setHeader('Cache-Control','no-store');
 // JSON-only mutations and exact Origin checks also protect cookie sessions from CSRF.
 if(['POST','PUT','PATCH','DELETE'].includes(req.method)){
  if(req.headers.origin&&req.headers.origin!==env.FRONTEND_URL)return next(new ApiError(403,'Origin not allowed'));
  if(!req.is('application/json'))return next(new ApiError(415,'Use application/json'));
 }
 next();
});
app.use(express.json({limit:'16kb'}));
app.use(cookieParser());
app.get('/api/health',(_req,res)=>{const connected=mongoose.connection.readyState===1;res.status(connected?200:503).json({status:connected?'ok':'degraded',database:connected?'connected':'disconnected'});});
app.use('/api/auth',authRoutes);
app.use((_req,_res,next)=>next(new ApiError(404,'Route not found')));
app.use(errorMiddleware);
