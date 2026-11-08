import 'dotenv/config';
import {z} from 'zod';
const schema=z.object({
 PORT:z.coerce.number().int().min(1).max(65535).default(5000),
 MONGODB_URI:z.string().startsWith('mongodb'),
 JWT_SECRET:z.string().min(32).refine(v=>v!=='replace_with_a_secure_random_secret','Replace the example JWT secret'),
 JWT_EXPIRES_IN:z.enum(['15m','30m','1h','2h','8h','1d']).default('1h'),
 FRONTEND_URL:z.url().default('http://localhost:5173'),
 NODE_ENV:z.enum(['development','test','production']).default('development')
});
export const env=schema.parse(process.env);
if(env.NODE_ENV==='production'&&!env.FRONTEND_URL.startsWith('https://'))throw new Error('Production frontend must use HTTPS');
export const sessionSeconds={'15m':900,'30m':1800,'1h':3600,'2h':7200,'8h':28800,'1d':86400}[env.JWT_EXPIRES_IN];
