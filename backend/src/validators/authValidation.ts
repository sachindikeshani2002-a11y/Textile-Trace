import {z} from 'zod';
const email=z.email().trim().toLowerCase().max(254);
const password=z.string().min(8).refine(v=>Buffer.byteLength(v,'utf8')<=72,'Password must be at most 72 UTF-8 bytes');
export const loginSchema=z.object({email,password}).strict();
export const registerSchema=z.object({fullName:z.string().trim().min(2).max(120),email,password,organizationName:z.string().trim().min(2).max(160),country:z.string().trim().max(100).optional()}).strict();
