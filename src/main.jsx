import React,{lazy,Suspense,useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {recipes,measure} from './recipes.js';
import './style.css';

const Viewer=lazy(()=>import('./Viewer.jsx'));
const base=import.meta.env.BASE_URL;
const photo=recipe=>base+'images/'+recipe.id+'.webp';
const symbols={
  brand:'M6 14a4 4 0 0 1-1-7.9 5 5 0 0 1 9-2 4 4 0 0 1 4.5 6.9V19H7v-5zm1 3h11M10 12v2m5-2v2',
  arrow:'M4 12h15m-6-6 6 6-6 6', back:'M20 12H5m6-6-6 6 6 6',
  time:'M12 8v5l3 2m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  people:'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-4M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm4-4a4 4 0 0 1 0 8',
  level:'M5 19v-4m7 4v-8m7 8V5', search:'m20 20-4-4m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  book:'M12 6v15M3 4c4-1 7 0 9 2 2-2 5-3 9-2v14c-4-1-7 0-9 3-2-3-5-4-9-3Z',
  play:'m8 5 12 7-12 7z', pause:'M9 5v14m6-14v14',
  replay:'M3 11a9 9 0 1 1 2 7m-2-7V5m0 6h6',
  star:'M12 2v20M2 12h20M5 5l14 14m0-14L5 19',
  plate:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Zm-4 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z'
};
function Icon({name,size=18}) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={symbols[name]}/></svg>;
}
function Brand(){return <a className="brand" href="#home" aria-label="Cook in 3D home"><span><Icon name="brand" size={22}/></span>Cook in <b>3D</b></a>;}
function Header({cooking}) {
  return <header className="site-header"><div className="shell header-inner">
    <Brand />
    <nav aria-label="Main navigation"><a href="#recipes" className="nav-recipes">Recipes</a><a href="#how" className="nav-how">How it works</a></nav>
    <a className="button header-button" href="#recipes">{cooking?'All Recipes':'Start Cooking'} <Icon name="arrow" size={16}/></a>
  </div></header>;
}
function Home() {
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('All recipes');
  const visible=recipes.filter(recipe=>(category==='All recipes'||category===recipe.category)&&recipe.name.toLowerCase().includes(query.trim().toLowerCase()));
  return <main id="home" className="shell home">
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><Icon name="star" size={13}/> THE INTERACTIVE COOKBOOK</p>
        <h1 id="hero-title">Cooking<br/>Made <em>Visual.</em></h1>
        <p className="hero-description">Pick a recipe. Watch it come to life.<br className="desktop-break"/> Cook along step by step.</p>
        <a href="#recipes" className="button primary hero-cta">Start Cooking <Icon name="arrow"/></a>
        <p className="tagline">See it. Make it. Love it.</p>
      </div>
      <figure className="hero-photo">
        <img src={photo(recipes[0])} alt="Tomato rigatoni with creamy burrata and fresh basil"/>
        <figcaption><span><Icon name="play" size={15}/></span><div><strong>From pan to plate</strong><small>Cook along in 3D</small></div></figcaption>
      </figure>
    </section>
    <section id="recipes" className="library" aria-labelledby="recipe-title">
      <div className="section-head">
        <div><p className="eyebrow"><Icon name="book" size={15}/> THE RECIPE LIBRARY</p><h2 id="recipe-title">Choose your recipe</h2></div>
        <label className="search"><Icon name="search"/><input aria-label="Search recipes" placeholder="Search recipes…" value={query} onChange={e=>setQuery(e.target.value)}/></label>
      </div>
      <div className="filters" role="group" aria-label="Filter recipe category">
        {['All recipes',...recipes.map(r=>r.category)].map(value=><button key={value} aria-pressed={category===value} onClick={()=>setCategory(value)}>{value}</button>)}
      </div>
      <div className="recipe-grid">
        {visible.map(recipe=><article className="recipe-card" key={recipe.id}>
          <a href={'#cook/'+recipe.id} tabIndex={-1} aria-hidden="true" className="card-image" style={{background:recipe.color}}><img src={photo(recipe)} alt=""/></a>
          <div className="card-copy">
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
            <div className="metadata"><span><Icon name="time" size={15}/>{recipe.time}</span><span><Icon name="people" size={15}/>2 servings</span><span><Icon name="level" size={15}/>Easy</span></div>
            <a className="button card-button" href={'#cook/'+recipe.id} aria-label={'Let’s cook '+recipe.name}>Let’s Cook <Icon name="arrow" size={17}/></a>
          </div>
        </article>)}
      </div>
      {!visible.length&&<p role="status" className="empty">No recipes match your search. Try another name or category.</p>}
    </section>
    <section id="how" className="how" aria-labelledby="how-title">
      <p className="eyebrow"><Icon name="star" size={14}/> FROM FIRST STEP TO FIRST BITE</p>
      <h2 id="how-title">How it works</h2>
      <div className="how-grid">
        {[['book','Pick','Choose a recipe and adjust the servings.'],['play','Watch','Play each cooking step and rotate the 3D view.'],['plate','Cook','Follow the instructions and cook at your own pace.']].map(([icon,title,copy])=><div key={title}><span><Icon name={icon} size={23}/></span><h3>{title}</h3><p>{copy}</p></div>)}
      </div>
    </section>
  </main>;
}
function Cooking({recipe}) {
  const [index,setIndex]=useState(0);
  const [servings,setServings]=useState(2);
  const [checked,setChecked]=useState({});
  const [replay,setReplay]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [done,setDone]=useState(false);
  const [ingredientsOpen,setIngredientsOpen]=useState(true);
  const total=recipe.steps.length;
  const step=recipe.steps[index];
  const change=next=>{setIndex(Math.max(0,Math.min(total-1,next)));setReplay(n=>n+1);};
  const finish=()=>{setPlaying(false);setDone(true);};
  useEffect(()=>{
    if(!playing||done)return;
    const timer=setTimeout(()=>{if(index===total-1)finish();else change(index+1);},5200);
    return ()=>clearTimeout(timer);
  },[playing,index,replay,done,total]);
  const reset=()=>{setPlaying(false);setDone(false);setChecked({});change(0);};
  return <main className="shell cooking">
    <a className="back-link" href="#recipes"><Icon name="back" size={16}/> All recipes</a>
    <div className="cooking-heading">
      <div><p className="eyebrow">{recipe.category} <span>·</span> {recipe.time} <span>·</span> Easy</p><h1>{recipe.name}</h1></div>
      <button className="button reset" onClick={reset}><Icon name="replay" size={16}/> Reset Recipe</button>
    </div>
    <div className="progress-head"><span>{done?'Recipe complete':'Step '+(index+1)+' of '+total}</span><span>{Math.round((index+1)/total*100)}%</span></div>
    <progress value={index+1} max={total} aria-label="Recipe progress"/>
    <div className="cook-grid">
      <aside className="ingredients">
        <button className="ingredient-toggle" onClick={()=>setIngredientsOpen(v=>!v)} aria-expanded={ingredientsOpen} aria-controls="ingredient-list"><span>Ingredients</span><span aria-hidden="true">{ingredientsOpen?'−':'+'}</span></button>
        {ingredientsOpen&&<div id="ingredient-list">
          <p className="serving-label">Servings</p>
          <div className="servings" role="group" aria-label="Number of servings">{[1,2,4].map(value=><button key={value} aria-pressed={value===servings} onClick={()=>{setServings(value);setChecked({});}}>{value}</button>)}</div>
          <ul className="checklist">{recipe.ingredients.map(item=><li key={item.id}><label><input type="checkbox" checked={Boolean(checked[item.id])} onChange={e=>setChecked({...checked,[item.id]:e.target.checked})}/><span><b>{measure(item,servings)}</b> {item.name}</span></label></li>)}</ul>
          <p className="ingredient-count">{Object.values(checked).filter(Boolean).length} of {recipe.ingredients.length} ready</p>
        </div>}
      </aside>
      <section className="cook-main" aria-label="Cooking lesson">
        <div className="scene" style={{'--scene-color':recipe.color}}>
          <div className="scene-label"><span/> {done?'Ready to serve':'3D cooking view'}</div>
          {done?<div className="celebration">
            <img src={photo(recipe)} alt={recipe.name}/>
            <div className="confetti" aria-hidden="true">{Array.from({length:28},(_,i)=><i key={i} style={{'--i':i,left:(i*37%100)+'%',background:['#ff675d','#ffd76d','#79be8c','#a18bc9'][i%4]}}/>)}</div>
            <div className="complete-message"><strong>You made it!</strong><span>Time to dig in.</span></div>
          </div>:<Suspense fallback={<div className="scene-loading">Loading the kitchen…</div>}><Viewer recipe={recipe} index={index} replay={replay}/></Suspense>}
        </div>
        {!done&&<div className="play-controls">
          <button className="button" onClick={()=>setReplay(n=>n+1)}><Icon name="replay" size={16}/> Replay Animation</button>
          <button className="button" onClick={()=>setPlaying(v=>!v)}><Icon name={playing?'pause':'play'} size={16}/> {playing?'Pause':'Play All'}</button>
          <span className="play-note">{playing?'Auto-advancing preview':'Cook at your own pace'}</span>
        </div>}
        <div className="instructions" aria-live="polite" aria-atomic="true">
          {done?<><p className="eyebrow">RECIPE COMPLETE</p><h2>{recipe.name}</h2><p>{recipe.description}</p></>:<>
            <div className="step-meta"><p className="eyebrow">STEP {index+1} / {total}</p><span><Icon name="time" size={15}/> {step.time}</span></div>
            <h2>{step.title}</h2><p>{step.instruction}</p>
            <div className="amounts">{(index===0?recipe.ingredients:step.used.map(id=>recipe.ingredients.find(item=>item.id===id))).map(item=><span key={item.id}><b>{measure(item,servings)}</b> {item.name}</span>)}</div>
          </>}
        </div>
        <div className="cook-navigation">
          {done?<><a className="button secondary" href="#recipes"><Icon name="back" size={17}/> All Recipes</a><button className="button primary" onClick={reset}>Cook Again <Icon name="replay" size={17}/></button></>:<>
            <button className="button secondary" disabled={index===0} onClick={()=>{setPlaying(false);change(index-1);}}><Icon name="back" size={17}/> Previous Step</button>
            <button className="button primary" onClick={()=>{setPlaying(false);if(index===total-1)finish();else change(index+1);}}>{index===total-1?'Finish Recipe':'Next Step'} <Icon name="arrow" size={17}/></button>
          </>}
        </div>
      </section>
    </div>
  </main>;
}
function App() {
  const [hash,setHash]=useState(location.hash);
  useEffect(()=>{
    const update=()=>setHash(location.hash);
    window.addEventListener('hashchange',update);
    return ()=>window.removeEventListener('hashchange',update);
  },[]);
  const recipe=recipes.find(item=>hash==='#cook/'+item.id);
  useEffect(()=>{
    document.title=recipe?recipe.name+' | Cook in 3D':'Cook in 3D — Cooking Made Visual';
    if(recipe||!hash||hash==='#home') window.scrollTo(0,0);
    else document.getElementById(hash.slice(1))?.scrollIntoView();
  },[hash,recipe]);
  return <><Header cooking={Boolean(recipe)}/>{recipe?<Cooking key={recipe.id} recipe={recipe}/>:<Home/>}
    <footer><div className="shell footer-inner"><Brand/><p>See it. Make it. Love it.</p><a href="#recipes">Explore recipes <Icon name="arrow" size={15}/></a></div></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App/>);
