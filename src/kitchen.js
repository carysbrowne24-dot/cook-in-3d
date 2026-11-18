import * as T from 'three';

const colors = {pasta:0xf48a38, garlic:0xffe3a0, cheese:0xffedb2, pepper:0xf64036, onion:0xe9b5de, carrot:0xff7e24, beef:0x8b4327, rice:0xfff7df, shrimp:0xff885c, herbs:0x35984d, oil:0xe9be47, butter:0xffd665, tomato:0xdf4e33, cream:0xfff4dc, teriyaki:0x80381b, lemon:0xffd740, burrata:0xfff9ed, water:0x83d8ed, towel:0xfffaf3, season:0xcfc2b2};
const geometry = {
  sphere:new T.SphereGeometry(1,16,12),
  box:new T.BoxGeometry(1,1,1),
  cylinder:new T.CylinderGeometry(1,1,1,64),
  torus:new T.TorusGeometry(1,.12,10,48),
  tube:new T.CylinderGeometry(.13,.13,.48,12,1,true),
  curl:new T.TorusGeometry(.25,.095,12,24,Math.PI*1.53)
};
const mats = new Map();
function material(color) {
  if (!mats.has(color)) mats.set(color,new T.MeshStandardMaterial({color,roughness:.46,side:T.DoubleSide}));
  return mats.get(color);
}
function mesh(parent, shape, color, x,y,z, sx,sy,sz) {
  const m = new T.Mesh(geometry[shape],material(color));
  m.position.set(x,y,z);
  m.scale.set(sx,sy,sz);
  parent.add(m);
  return m;
}
function food(parent, kind, x,y,z, angle = 0) {
  const g = new T.Group();
  parent.add(g);
  g.position.set(x,y,z);
  g.rotation.y=angle;
  const c = colors[kind];
  if (kind==='pasta') {
    mesh(g,'tube',c,0,0,0,1,1,1).rotation.z=Math.PI/2;
    for (const end of [-.24,.24]) {
      mesh(g,'torus',0xffa953,end,0,0,.125,.125,.125).rotation.y=Math.PI/2;
      mesh(g,'sphere',0x953d20,end*.98,0,0,.004,.096,.096);
    }
  } else if (kind==='shrimp') {
    const curl=mesh(g,'curl',c,0,0,0,1.15,1,.76);
    curl.rotation.x=Math.PI/2;
    for (let i=0;i<4;i++) {
      const a=.55+i*.85;
      mesh(g,'sphere',0xffb78f,.27*Math.cos(a),.053,.245*Math.sin(a),.075,.045,.074);
    }
    mesh(g,'sphere',0xe76347,.045,.012,-.29,.15,.044,.077).rotation.y=.42;
  } else if (kind==='burrata') {
    mesh(g,'sphere',c,0,.21,0,.54,.35,.51);
    mesh(g,'sphere',c,-.06,.5,.04,.19,.14,.16);
  } else if (kind==='lemon') {
    mesh(g,'sphere',0xf3b625,0,0,0,.34,.13,.27);
    mesh(g,'sphere',c,0,.065,0,.31,.09,.24);
  } else if (kind==='herbs') {
    mesh(g,'sphere',c,0,0,0,.17,.027,.081);
    mesh(g,'sphere',0x7cab54,0,.023,0,.11,.009,.012);
  } else {
    const size = {rice:.069,beef:.15,garlic:.065,cheese:.056,pepper:.16,carrot:.125,onion:.14,butter:.25}[kind] || .13;
    mesh(g,kind==='rice'||kind==='beef'?'sphere':'box',c,0,0,0,size*1.4,size*.68,size);
  }
  return g;
}
function vessel(root, scene) {
  if (scene==='board') {
    mesh(root,'box',0xe0aa74,0,.105,0,4.8,.19,3.3);
    return .27;
  }
  const pot=scene==='pot', pan=scene==='pan', bowl=scene==='bowl';
  if (pot||pan) mesh(root,'cylinder',0x455452,0,.07,0,2.2,.14,2.2);
  const y=pot?.45:.28, radius=pot?1.62:1.88, height=pot?1.15:pan?.40:bowl?.44:.13;
  const c=pot?0x6ca794:pan?0x386d5f:0xfff7e5;
  const profile=[[0,y],[radius*.83,y],[radius*.95,y+height*.35],[radius,y+height],[radius-.09,y+height],[radius*.86,y+.10],[0,y+.10]];
  const body=new T.Mesh(new T.LatheGeometry(profile.map(([a,b])=>new T.Vector2(a,b)),64),material(c));
  root.add(body);
  if (pan) {
    mesh(root,'box',0x375951,2.28,y+.23,0,1.47,.16,.28).rotation.z=.13;
    mesh(root,'box',0xbd8058,2.82,y+.3,0,.85,.18,.32).rotation.z=.13;
  }
  if (pot) for (const x of [-1.8,1.8]) mesh(root,'box',0x375951,x,1.32,0,.55,.17,.40);
  return pot?1.3:y+.16;
}

export function makeScene(recipe, index, root) {
  const {scene,action}=recipe.steps[index];
  const y=vessel(root,scene);
  const motions=[];
  const add = (kind,count,{drop=false,stir=false,spread=1.29,offset=[0,0],lift=0,change=null,flip=false, scale=1, delay=0, holdColor=false, transfer=false}={}) => {
    for(let i=0;i<count;i++) {
      const a=i*2.39996, r=Math.sqrt((i+.4)/count)*spread;
      const x=Math.cos(a)*r+offset[0], z=Math.sin(a)*r+offset[1];
      const g=food(root,kind,x,y+lift,z,a);
      g.scale.setScalar(scale);
      const changing = change ? g.children[0] : null;
      if (changing) changing.material=changing.material.clone();
      const from=change ? new T.Color(change) : null;
      const to=change ? new T.Color(colors[kind]) : null;
      motions.push(t=>{
        const p=T.MathUtils.smoothstep(t-delay-i*.034,.28,1.22);
        const turn=stir?Math.sin(T.MathUtils.smoothstep(t,1.05,2.85)*Math.PI)*.53:0;
        g.position.set(Math.cos(a+turn)*r+offset[0]+(drop?(1-p)*(transfer?-2.65:-.7):0),y+lift+(drop?(transfer?(1-p)*.48+Math.sin(p*Math.PI)*1.1:(1-p)*2.8):0)+(flip?Math.sin(p*Math.PI)*.48:0),Math.sin(a+turn)*r+offset[1]);
        g.visible=t>=delay;
        g.rotation.x=flip?p*Math.PI:drop?(1-p)*.72:0;
        if(changing) changing.material.color.copy(from).lerp(to,holdColor?0:T.MathUtils.smoothstep(t,1.3,2.9));
        if(kind==='shrimp' && change) g.children.slice(1).forEach(part=>{part.visible=!holdColor&&t>1.8;});
        if(kind==='butter' && drop) g.scale.setScalar(scale*(1-.94*T.MathUtils.smoothstep(t,1.1,2.4)));
      });
    }
  };
  const liquid=(kind, size, height=y-.04, appear=false, delay=0)=>{
    const m=mesh(root,'cylinder',colors[kind],0,height,0,size,.035,size);
    if(appear) motions.push(t=>{const p=.03+.97*T.MathUtils.smoothstep(t-delay,.55,1.9);m.scale.set(size*p,.035,size*p);});
    return m;
  };
  const pour=(kind, offset=0, delay=0)=>{
    const prop=new T.Group(); root.add(prop);
    const bottle=kind==='oil';
    mesh(prop,'cylinder',bottle?0x548656:0xfff4e2,0,.02,0,.24,.58,.24);
    mesh(prop,'cylinder',colors[kind],0,.33,0,bottle?.10:.235,.025,bottle?.10:.235);
    if(kind==='lemon'){prop.clear();food(prop,'lemon',0,.15,0);}
    if(bottle) mesh(prop,'cylinder',0xf9da69,0,.39,0,.10,.15,.10);
    const stream=mesh(root,'cylinder',colors[kind],offset,y+1,0,.048,1.8,.048);
    motions.push(t=>{
      const u=t-delay, tip=T.MathUtils.smoothstep(u,0,.62);
      const out=T.MathUtils.smoothstep(u,1.55,2.25);
      prop.position.set(offset+.33+out*2,y+2.04+out,0);
      prop.rotation.z=tip*(1-out)*1.85;
      prop.visible=u>=0&&out<1;
      stream.visible=u>.53&&u<1.58;
      stream.scale.x=.042+Math.sin(t*20)*.008;
    });
  };
  const steam=()=>{
    for(let i=0;i<10;i++){
      const m=mesh(root,'sphere',0xffffff,0,y,0,.085,.1,.085);
      m.material=m.material.clone();
      m.material.transparent=true;
      m.material.depthWrite=false;
      motions.push(t=>{
        const p=(t*.63+i*.163)%1;
        m.position.set(Math.sin(i*9)*1.05+Math.sin(p*5)*.14,y+p*1.55,Math.cos(i*11)*.88);
        m.scale.setScalar(.045+p*.11);
        m.material.opacity=Math.sin(p*Math.PI)*.38*T.MathUtils.smoothstep(t,.5,1.5);
      });
    }
  };
  const transferPan=()=>{
    const g=new T.Group();root.add(g);vessel(g,'pan');
    g.scale.setScalar(.54);g.position.set(-2.76,.5,0);g.rotation.z=-.36;
    motions.push(t=>{g.rotation.z=-.27-T.MathUtils.smoothstep(t,.2,1.24)*.35;g.position.x=-2.72-T.MathUtils.smoothstep(t,1.2,2.2)*2;g.visible=t<2.2;});
  };
  const utensil=(chop=false)=>{
    const g=new T.Group();root.add(g);
    const blade=mesh(g,'box',chop?0xc8d8da:0xfacb76,0,0,-.47,chop?.14:.34,.077,.68);
    if(chop) blade.rotation.z=Math.PI/2;
    mesh(g,'box',0xae7750,0,0,.33,.14,.12,1.13);
    motions.push(t=>{
      g.visible=t<3.2;
      const a=t*3;
      g.position.set(chop?.6+Math.sin(a)*.3:Math.sin(a)*.88,y+.36+(chop?Math.abs(Math.sin(t*8))*.51:0),chop?0:Math.cos(a)*.46);
      g.rotation.set(chop?.03:.25,chop?-.35:a,.15);
    });
  };
  const veg=(drop,stir=false)=>['pepper','carrot','onion'].forEach((k,i)=>add(k,13,{drop,stir,offset:[(i-1)*.22,(i-1)*.12],lift:.045}));
  const shrimp=(opts={})=>add('shrimp',11,{spread:1.39,lift:.08,...opts});
  if(action==='gather'){
    const items=recipe.id==='pasta'?['pasta','oil','garlic','tomato','cream','cheese','burrata','herbs','season']:
      recipe.id==='beef'?['beef','rice','pepper','carrot','onion','garlic','teriyaki','oil','herbs']:['shrimp','butter','garlic','oil','lemon','herbs','season'];
    items.forEach((kind,i)=>{
      const x=(i%3-1)*1.42,z=(Math.floor(i/3)-1)*.99;
      mesh(root,'cylinder',0xfff1d6,x,y-.028,z,.44,.10,.44);
      if(['oil','tomato','cream','teriyaki'].includes(kind)) mesh(root,'cylinder',colors[kind],x,y+.032,z,.38,.04,.38);
      else add(kind,['burrata','lemon','shrimp','butter'].includes(kind)?1:7,{drop:true,spread:kind==='burrata'?0:.25,lift:.105,offset:[x,z],scale:kind==='burrata'?.64:1});
    });
  }
  if(['water','pasta','rice'].includes(action)){
    liquid('water',1.41,y,action==='water');
    if(action==='water'||action==='rice') pour('water',action==='rice'?.48:0);
    if(action==='pasta') add('pasta',21,{drop:true,lift:.04});
    if(action==='rice') add('rice',68,{drop:true,lift:.04,spread:1.29});
    steam();
  }
  if(scene==='pan') {
    liquid('oil',1.42,y-.025,action==='oil'||action==='butter');
    if(action==='oil'||action==='butter') pour('oil',action==='butter'?.52:0);
    if(action==='butter') add('butter',3,{drop:true,spread:.62});
    if(index>3||action==='garlic') add('garlic',17,{drop:action==='garlic',stir:action==='garlic',lift:.06});
    if(action==='garlic') utensil();
  }
  if(recipe.id==='pasta'){
    if(index>=5&&index<=7){
      const base=liquid('tomato',1.55,y,action==='sauce');
      base.material=base.material.clone();
      const tomato=new T.Color(colors.tomato);
      const creamy=new T.Color(0xef7753);
      if(action==='sauce'){
        pour('tomato',-.38);
        pour('cream',.55,.75);
        const swirl=liquid('cream',.57,y+.015,true,.75);
        motions.push(t=>{
          const mixed=T.MathUtils.smoothstep(t,1.65,3.05);
          swirl.position.x=Math.cos(t*4)*.42;
          swirl.position.z=Math.sin(t*4)*.42;
          swirl.scale.multiplyScalar(1-mixed);
          base.material.color.copy(tomato).lerp(creamy,mixed);
        });
      }else base.material.color.copy(creamy);
      if(action==='cheese') add('cheese',26,{drop:true,stir:true,lift:.06});
      if(action==='toss') add('pasta',30,{drop:true,stir:true,lift:.12});
      utensil();
      steam();
    }
    if(index===8) transferPan();
    if(index>=8){add('pasta',38,{drop:index===8,transfer:true,lift:.11});add('burrata',1,{drop:index===8,delay:index===8?1.05:0,spread:0,lift:.17});}
    if(action==='basil') add('herbs',11,{drop:true,spread:1,lift:.23});
  }
  if(recipe.id==='beef'){
    if(action==='chop'){
      ['pepper','carrot','onion'].forEach((kind,i)=>{
        const x=(i-1)*1.33;
        const whole=mesh(root,'sphere',colors[kind],x,y+.21,0,kind==='carrot'?.51:.34,.23,kind==='carrot'?.13:.31);
        const delay=.32+i*.28;
        motions.push(t=>{whole.scale.y=.23*(1-T.MathUtils.smoothstep(t,delay,delay+.85));whole.visible=t<delay+.85;});
        add(kind,14,{drop:true,delay:delay+.45,spread:.53,offset:[x,0]});
      });
      utensil(true);
    }
    if(index>=4){
      const bowl=action==='bowlBeef';
      if(bowl) transferPan();
      if(bowl) add('rice',110,{drop:true,spread:1.43,scale:1.65,offset:[-.21,0],lift:.04});
      veg(action==='veg'||bowl,true);
      if(index>=6) add('beef',42,{drop:action==='beef'||bowl,stir:!bowl,lift:.14,transfer:bowl,delay:bowl?.48:0,change:action==='beef'?0xcf6159:null,spread:bowl?1.1:1.42,offset:bowl?[.33,0]:[0,0]});
      if(action==='teriyaki') pour('teriyaki');
      if(action==='stir'||action==='teriyaki') liquid('teriyaki',1.47,y+.006,action==='teriyaki');
      if(bowl) add('herbs',16,{drop:true,lift:.27});
      else if(action!=='garlic'){utensil();steam();}
    }
  }
  if(recipe.id==='shrimp'){
    if(action==='dry'){
      shrimp({change:0xb5a69b,holdColor:true});
      const towel=mesh(root,'box',colors.towel,0,y+.35,0,3.1,.035,2.65);
      motions.push(t=>{towel.position.y=y+.28+Math.abs(Math.sin(t*3))*.64;towel.position.x=2.4*T.MathUtils.smoothstep(t,1.5,2.3);towel.visible=t<2.3;});
    }
    if(index>=4){
      if(action==='plateShrimp') transferPan();
      shrimp({drop:action==='shrimp'||action==='plateShrimp',change:action==='shrimp'?0xb5a69b:action==='sear'||action==='flip'?0xd2aa9c:null,flip:action==='flip',holdColor:action==='shrimp',transfer:action==='plateShrimp'});
      if(index>=7){
        add('lemon',1,{drop:action==='lemon',spread:0,offset:[1.04,.7],lift:.12});
        if(action==='lemon') pour('lemon',.15);
      }
      if(index>=8) add('herbs',24,{drop:action==='parsley',lift:.16,scale:.65});
      if(index>=5&&index<9) steam();
    }
  }
  return time=>motions.forEach(fn=>fn(time));
}

export function startKitchen(host) {
  const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));
  renderer.setClearColor(0xffffff,0);
  renderer.outputColorSpace=T.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden','true');
  host.append(renderer.domElement);
  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(33,1,.1,80);
  const target=new T.Vector3(0,.55,0);
  let angle=.26;
  const updateCamera=()=>{camera.position.set(Math.sin(angle)*8.3,6.6,Math.cos(angle)*8.3);camera.lookAt(target);};
  updateCamera();
  scene.add(new T.HemisphereLight(0xfff5e4,0xb09488,2.35));
  const light=new T.DirectionalLight(0xfff4da,2.5);
  light.position.set(-3,7,4);scene.add(light);
  mesh(scene,'cylinder',0xeaa68e,0,-.18,0,4.48,.28,3.39);
  mesh(scene,'cylinder',0xc48473,0,-.041,0,2.47,.028,2.10);
  let root;
  let animate=()=>{};
  let start=performance.now();
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clearStep(){
    if(!root)return;
    root.traverse(m=>{
      if(!m.isMesh)return;
      if(!Object.values(geometry).includes(m.geometry))m.geometry.dispose();
      if(![...mats.values()].includes(m.material))m.material.dispose();
    });
    scene.remove(root);
  }
  const show=(recipe,index)=>{
    clearStep();
    root=new T.Group();
    scene.add(root);
    animate=makeScene(recipe,index,root);
    start=performance.now();
  };
  const view=new ResizeObserver(()=>{
    const {clientWidth:w,clientHeight:h}=host;
    if(!w||!h)return;
    renderer.setSize(w,h);
    camera.aspect=w/h;
    camera.fov=w/h<1.25?43:34;
    camera.updateProjectionMatrix();
  });view.observe(host);
  let drag=null;
  const down=e=>{drag=e.clientX;host.setPointerCapture(e.pointerId);};
  const move=e=>{if(drag!==null){angle-=(e.clientX-drag)*.009;drag=e.clientX;updateCamera();}};
  const up=()=>{drag=null;};
  host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('lostpointercapture',up);
  let frame;
  const draw=now=>{
    animate(reducedMotion?3.55:Math.min(3.55,(now-start)/1000));
    renderer.render(scene,camera);
    frame=requestAnimationFrame(draw);
  };frame=requestAnimationFrame(draw);
  const dispose=()=>{
    cancelAnimationFrame(frame);view.disconnect();
    host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('lostpointercapture',up);
    clearStep();
    renderer.dispose();renderer.domElement.remove();
  };
  return {show,dispose};
}
