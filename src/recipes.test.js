import test from 'node:test';
import assert from 'node:assert/strict';
import {Group} from 'three';
import {recipes,measure} from './recipes.js';
import {makeScene} from './kitchen.js';

test('all three recipes have ten usable scenes and valid ingredient references',()=>{
  assert.equal(recipes.length,3);
  for(const recipe of recipes){
    assert.equal(recipe.steps.length,10,recipe.name);
    for(const [index,step] of recipe.steps.entries()){
      for(const id of step.used)assert.ok(recipe.ingredients.some(item=>item.id===id),id);
      const root=new Group();
      const animation=makeScene(recipe,index,root);
      assert.ok(root.children.length>1,step.title);
      const snapshot=()=>root.children.map(object=>[
        object.visible,...object.position.toArray(),...object.scale.toArray(),...object.rotation.toArray().slice(0,3)
      ]);
      animation(0);
      const start=snapshot();
      for(const t of [.6,1.15,2,3.55]){
        animation(t);
        assert.ok(snapshot().flat().slice().every(value=>typeof value==='boolean'||Number.isFinite(value)),step.title);
      }
      assert.notDeepEqual(snapshot(),start,step.title);
      animation(0);
      assert.deepEqual(snapshot(),start,step.title+' replays from the same first frame');
    }
  }
});

test('servings scale eighths, halves, ounces, and mixed numbers',()=>{
  const pasta=recipes[0].ingredients;
  assert.deepEqual([1,2,4].map(n=>measure(pasta[0],n)),['4 oz','8 oz','16 oz']);
  assert.deepEqual([1,2,4].map(n=>measure(pasta[4],n)),['⅛ cup','¼ cup','½ cup']);
  assert.equal(measure(recipes[2].ingredients.find(i=>i.id==='garlic'),1),'1 ½ cloves');
  assert.equal(measure(recipes[1].ingredients.at(-1),4),'Optional');
  for(const recipe of recipes)for(const item of recipe.ingredients)for(const n of [1,2,4])assert.ok(measure(item,n));
});
