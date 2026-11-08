import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {unlink} from 'node:fs/promises';
const memory=new Map();
globalThis.localStorage={getItem:key=>memory.get(key)||null,setItem:(key,value)=>memory.set(key,value),removeItem:key=>memory.delete(key)};
globalThis.window={location:{origin:'http://127.0.0.1:5173'}};
globalThis.location=globalThis.window.location;
await build({entryPoints:['scripts/smoke-entry.tsx'],outfile:'scripts/.smoke.cjs',bundle:true,platform:'node',format:'cjs',jsx:'automatic',logLevel:'error'});
try{
 const {renderPath}=createRequire(import.meta.url)('./.smoke.cjs');
 const routes=['/','/about','/how-it-works','/discover','/login','/register','/forgot-password','/app/overview','/app/sustainability','/app/products','/app/products/p1','/app/products/new','/app/products/p1/edit','/app/products/p1/lifecycle','/app/passports','/app/passports/p1','/app/qr','/app/supply-chain','/app/suppliers','/app/events','/app/evidence','/app/certifications','/app/evidence/e1','/app/reviews','/app/supplier','/app/requests','/app/upload','/app/retailer','/app/analytics','/app/retailer-products','/app/admin','/app/users','/app/invitations','/app/audit','/passport/p1','/passport/p1/materials','/passport/p1/certifications','/passport/p1/care','/passport/p1/circularity','/app/settings','/app/integrations','/app/profile'];
 for(const path of routes){const html=renderPath(path);if(path.startsWith('/app')){if(!html.includes('Restoring session'))throw new Error('Protected route bypassed session restoration: '+path);continue}if(html.length<500||html.includes('This thread doesn’t lead'))throw new Error(`Empty or missing screen: ${path}`)}
 console.log(`PASS: ${routes.length} routes rendered; protected routes wait for session restoration.`);
}finally{await unlink('scripts/.smoke.cjs')}
