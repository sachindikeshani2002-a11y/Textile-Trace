import {app} from './app.js';
import {connectDB} from './config/db.js';
import {env} from './config/env.js';
import mongoose from 'mongoose';
try{
 await connectDB();
 const server=app.listen(env.PORT,()=>console.log('TextileTrace API listening on port '+env.PORT));
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.close(()=>{void mongoose.disconnect().then(()=>process.exit(0));});});
}catch{console.error('Unable to start TextileTrace API. Check local MongoDB and environment configuration.');process.exit(1);}
