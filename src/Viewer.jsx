import React, {useEffect,useRef,useState} from 'react';
import {startKitchen} from './kitchen.js';

export default function Viewer({recipe,index,replay}) {
  const host=useRef(null);
  const kitchen=useRef(null);
  const [fallback,setFallback]=useState(false);
  useEffect(()=>{
    if(fallback)return;
    const element=host.current;
    try {kitchen.current=startKitchen(element);}
    catch {setFallback(true);}
    const lost=e=>{e.preventDefault();setFallback(true);};
    element.addEventListener('webglcontextlost',lost,true);
    return ()=>{kitchen.current?.dispose();kitchen.current=null;element.removeEventListener('webglcontextlost',lost,true);};
  },[fallback]);
  useEffect(()=>{kitchen.current?.show(recipe,index);},[recipe,index,replay]);
  return <>
    <div ref={host} className="scene-canvas" role="img" aria-label={'Cooking demonstration: '+recipe.steps[index].title} />
    {fallback && <div className="scene-fallback">
      <img src={import.meta.env.BASE_URL+'images/'+recipe.id+'.webp'} alt={recipe.name}/>
      <span>3D is unavailable on this device. You can still cook along with each step.</span>
    </div>}
    <div className="scene-guide">{fallback?'Recipe preview':'↔ Drag to rotate'}</div>
  </>;
}
