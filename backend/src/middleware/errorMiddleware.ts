import type {ErrorRequestHandler} from 'express';
import {ZodError} from 'zod';
export class ApiError extends Error{constructor(public status:number,message:string){super(message)}}
export const errorMiddleware:ErrorRequestHandler=(err,_req,res,_next)=>{
 if(err instanceof ZodError){res.status(400).json({message:'Invalid input',errors:err.issues.map(i=>({field:i.path.join('.'),message:i.message}))});return;}
 if(err?.code===11000){res.status(409).json({message:'Unable to register with these details'});return;}
 if(err instanceof ApiError){res.status(err.status).json({message:err.message});return;}
 if(err?.type==='entity.parse.failed'){res.status(400).json({message:'Invalid JSON'});return;}
 if(err?.status===413){res.status(413).json({message:'Request too large'});return;}
 console.error('Request failed:',err?.name);
 res.status(500).json({message:'An unexpected error occurred'});
};
