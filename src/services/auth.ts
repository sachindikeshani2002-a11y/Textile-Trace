import type {Role} from '../data';
export type AuthUser={id:string;fullName:string;email:string;role:'manufacturer'|'supplier'|'certification_reviewer'|'retailer'|'admin';organizationId:string;isActive:boolean};
export const displayRole:Record<AuthUser['role'],Role>={manufacturer:'Manufacturer',supplier:'Supplier',certification_reviewer:'Reviewer',retailer:'Retailer',admin:'Administrator'};
export const dashboard:Record<Role,string>={Manufacturer:'/app/overview',Supplier:'/app/supplier',Reviewer:'/app/evidence',Retailer:'/app/retailer',Administrator:'/app/admin'};
export class AuthError extends Error{constructor(message:string,public status:number){super(message)}}
export async function authRequest(path:string,body?:unknown):Promise<{user:AuthUser}>{
 let response:Response;
 try{response=await fetch('/api/auth/'+path,{method:body===undefined?'GET':'POST',credentials:'include',headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});}
 catch{throw new AuthError('Unable to reach TextileTrace. Check that the backend is running.',0);}
 const data=await response.json().catch(()=>({message:'Unexpected API response'}));
 if(!response.ok)throw new AuthError(data.message||'Authentication failed',response.status);
 return data;
}
