'use client';
import { useEffect, useState } from 'react';
const KEY='ig:favorites';
export function useFavorites(){
  const [ids,setIds]=useState<string[]>([]);
  useEffect(()=>{ if(typeof window==='undefined') return; try{ const raw=localStorage.getItem(KEY); if(raw) setIds(JSON.parse(raw)); }catch{} },[]);
  useEffect(()=>{ if(typeof window==='undefined') return; try{ localStorage.setItem(KEY, JSON.stringify(ids)); }catch{} },[ids]);
  const toggle=(id:string)=> setIds(p=> p.includes(id)? p.filter(x=>x!==id): [...p,id]);
  const has=(id:string)=> ids.includes(id);
  const clear=()=> setIds([]);
  return { ids, toggle, has, clear };
}
