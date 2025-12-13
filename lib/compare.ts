'use client';
import { useEffect, useState } from 'react';
const KEY='ig:compare';
export function useCompare(){
  const [ids,setIds]=useState<string[]>([]);
  useEffect(()=>{ if(typeof window==='undefined') return; try{ const raw=localStorage.getItem(KEY); if(raw) setIds(JSON.parse(raw)); }catch{} },[]);
  useEffect(()=>{ if(typeof window==='undefined') return; try{ localStorage.setItem(KEY, JSON.stringify(ids)); }catch{} },[ids]);
  const add=(id:string)=> setIds(p=> p.includes(id)? p : [...p,id]);
  const remove=(id:string)=> setIds(p=> p.filter(x=>x!==id));
  const clear=()=> setIds([]);
  return { ids, add, remove, clear };
}
