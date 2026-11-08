import {test} from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {app} from '../src/app.js';
import {connectDB} from '../src/config/db.js';
import {env} from '../src/config/env.js';
import {User,roles} from '../src/models/User.js';
import {Organization} from '../src/models/Organization.js';
import {authenticate} from '../src/middleware/authMiddleware.js';
import {requireRole} from '../src/middleware/roleMiddleware.js';
import {errorMiddleware} from '../src/middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';

test('local MongoDB authentication integration',async t=>{
 if(env.NODE_ENV!=='development')throw new Error('Run these tests only with the development database');
 await connectDB();
 const harness=express();
 // Test-only role probe: no unrelated backend module is exposed in production.
 harness.use(cookieParser());
 harness.get('/role-probe',authenticate,requireRole('admin'),(_req,res)=>res.json({allowed:true}));
 harness.use(errorMiddleware);
 harness.use(app);
 const server=harness.listen(0,'127.0.0.1');
 await new Promise<void>(resolve=>server.once('listening',resolve));
 const base='http://127.0.0.1:'+((server.address() as any).port);
 const email='auth-test-'+crypto.randomUUID()+'@textiletrace.example';
 let organizationId:string|undefined;
 let cookie='';
 const request=async(path:string,body?:unknown,options:{cookie?:string;origin?:string}={})=>fetch(base+path,{method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{'Content-Type':'application/json'}),...(options.cookie?{Cookie:options.cookie}:{}),Origin:options.origin??env.FRONTEND_URL},body:body===undefined?undefined:JSON.stringify(body)});
 try{
  await t.test('health connects to textiletrace',async()=>{const r=await request('/api/health');assert.equal(r.status,200);assert.equal((await r.json()).database,'connected');assert.equal(mongoose.connection.name,'textiletrace');});
  await t.test('unauthenticated session rejected',async()=>assert.equal((await request('/api/auth/me')).status,401));
  const input={fullName:'Auth Integration Test',email,password:'TestSecure!2026',organizationName:'Auth Test Organization'};
  await t.test('registration validation and role injection rejected',async()=>{
   assert.equal((await request('/api/auth/register',{...input,password:'short'})).status,400);
   assert.equal((await request('/api/auth/register',{...input,role:'admin'})).status,400);
  });
  await t.test('register safe default, hash, and HttpOnly session',async()=>{
   const r=await request('/api/auth/register',input);assert.equal(r.status,201);
   const data=await r.json();organizationId=data.user.organizationId;
   assert.equal(data.user.role,'manufacturer');assert.equal(data.user.passwordHash,undefined);
   const header=r.headers.get('set-cookie')!;assert.match(header,/HttpOnly/i);assert.match(header,/SameSite=Lax/i);cookie=header.split(';')[0];
   const user=await User.findOne({email}).select('+passwordHash');assert.ok(user);assert.notEqual(user.passwordHash,input.password);assert.ok(await bcrypt.compare(input.password,String(user.passwordHash)));assert.equal(user.toJSON().passwordHash,undefined);
  });
  await t.test('duplicate email rejected',async()=>assert.equal((await request('/api/auth/register',input)).status,409));
  await t.test('session restoration',async()=>{const r=await request('/api/auth/me',undefined,{cookie});assert.equal(r.status,200);assert.equal((await r.json()).user.email,email);});
  await t.test('incorrect and unknown credentials have identical errors',async()=>{
   const r=await request('/api/auth/login',{email,password:'WrongPassword!'});assert.equal(r.status,401);
   const r2=await request('/api/auth/login',{email:'unknown@textiletrace.example',password:'WrongPassword!'});assert.equal(r2.status,401);assert.deepEqual(await r.json(),await r2.json());
  });
  await t.test('login succeeds with normalized email',async()=>{
   const r=await request('/api/auth/login',{email:email.toUpperCase(),password:input.password});assert.equal(r.status,200);cookie=r.headers.get('set-cookie')!.split(';')[0];
  });
  await t.test('all five seeded roles authenticate; only database admin passes role middleware',async()=>{
   for(const role of roles){
    const r=await request('/api/auth/login',{email:role+'@textiletrace.example',password:'TextileDemo!2026'});assert.equal(r.status,200,role);
    assert.equal((await r.json()).user.role,role);
    const c=r.headers.get('set-cookie')!.split(';')[0];
    assert.equal((await request('/role-probe',undefined,{cookie:c})).status,role==='admin'?200:403);
   }
  });
  await t.test('JWT tampering and expiration rejected',async()=>{
   assert.equal((await request('/api/auth/me',undefined,{cookie:cookie+'broken'})).status,401);
   const user=await User.findOne({email});
   const expired=jwt.sign({},env.JWT_SECRET,{subject:String(user!._id),expiresIn:-1,issuer:'textiletrace',audience:'textiletrace-web'});
   assert.equal((await request('/api/auth/me',undefined,{cookie:'textiletrace_session='+expired})).status,401);
  });
  await t.test('database deactivation and role changes take immediate effect',async()=>{
   await User.updateOne({email},{$set:{isActive:false}});
   assert.equal((await request('/api/auth/me',undefined,{cookie})).status,401);
   await User.updateOne({email},{$set:{isActive:true,role:'admin'}});
   assert.equal((await request('/role-probe',undefined,{cookie})).status,200);
  });
  await t.test('cross-origin mutation rejected; CORS restricted',async()=>{
   const r=await request('/api/auth/logout',{}, {cookie,origin:'https://untrusted.example'});assert.equal(r.status,403);assert.notEqual(r.headers.get('access-control-allow-origin'),'https://untrusted.example');
  });
  await t.test('logout expires cookie and empty cookie cannot restore session',async()=>{
   const r=await request('/api/auth/logout',{}, {cookie});assert.equal(r.status,200);assert.match(r.headers.get('set-cookie')!,/Expires=Thu, 01 Jan 1970/);
   assert.equal((await request('/api/auth/me')).status,401);
  });
  await t.test('login attempts rate limited',async()=>{
   let limited=false;for(let i=0;i<21;i++){const r=await request('/api/auth/login',{email,password:'WrongPassword!'});if(r.status===429){limited=true;break;}}
   assert.ok(limited);
  });
 }finally{
  await User.deleteOne({email});
  if(organizationId)await Organization.deleteOne({_id:organizationId});
  await new Promise<void>((resolve,reject)=>server.close(err=>err?reject(err):resolve()));
  await mongoose.disconnect();
 }
});
