import {createContext,useContext,useState,type ReactNode} from 'react';
import {seed,type Store,type Role} from './data';
import {toast} from 'sonner';
const KEY='threadtrace-demo-v1';
export const demoService={load():Store{try{return JSON.parse(localStorage.getItem(KEY)||'null')||structuredClone(seed)}catch{return structuredClone(seed)}},save(data:Store){localStorage.setItem(KEY,JSON.stringify(data))}};
const C=createContext<any>(null);
export function Provider({children}:{children:ReactNode}){const[data,setData]=useState<Store>(demoService.load);const[role,setRoleState]=useState<Role>((localStorage.getItem('tt-role') as Role)||'Manufacturer');const[authenticated,setAuth]=useState(localStorage.getItem('tt-auth')==='true');function change(fn:(draft:Store)=>void,action:string){const next=structuredClone(data);fn(next);next.audit.unshift({id:crypto.randomUUID(),action,actor:role,date:new Date().toISOString()});try{demoService.save(next);setData(next);toast.success(action)}catch{toast.error('Storage is full. Please use a smaller attachment.')}}function setRole(r:Role){setRoleState(r);localStorage.setItem('tt-role',r)}function login(r:Role){setRole(r);setAuth(true);localStorage.setItem('tt-auth','true')}function logout(){setAuth(false);localStorage.removeItem('tt-auth')}return <C.Provider value={{data,change,role,setRole,login,logout,authenticated}}>{children}</C.Provider>}
export function useStore():{data:Store;change:(fn:(draft:Store)=>void,action:string)=>void;role:Role;setRole:(r:Role)=>void;login:(r:Role)=>void;logout:()=>void;authenticated:boolean}{return useContext(C)}
