const step = (title, instruction, time, scene, action, used = []) => ({ title, instruction, time, scene, action, used });
const ingredient = (id, name, amount, unit = '') => ({ id, name, amount, unit });
const prep = step('Gather your ingredients', 'Measure the ingredients and check them off as you go.', '3–5 min', 'board', 'gather');
export const recipes = [
  { id:'pasta', name:'Creamy Tomato & Burrata Pasta', category:'Pasta', time:'30 min', color:'#f6b39d', description:'Silky tomato cream sauce, tender pasta and a cloud of burrata.',
    ingredients:[
      ingredient('pasta','pasta',8,'oz'), ingredient('oil','olive oil',1,'tbsp'), ingredient('garlic','garlic, minced',2,'clove'),
      ingredient('tomato','tomato sauce',1,'cup'), ingredient('cream','heavy cream',.25,'cup'), ingredient('cheese','grated Parmesan',.25,'cup'),
      ingredient('burrata','burrata',1,'ball'), ingredient('basil','fresh basil',null), ingredient('season','salt and pepper',null)
    ],
    steps:[prep,
      step('Bring water to a boil','Fill a pot with enough water to cover the pasta generously. Salt it and bring to a rolling boil.','5–10 min','pot','water',['season']),
      step('Cook the pasta','Add pasta, stir, and boil until al dente using the package timing. Drain.','8–12 min','pot','pasta',['pasta']),
      step('Warm the olive oil','Pour olive oil into a skillet over medium heat. Heat until it shimmers.','1 min','pan','oil',['oil']),
      step('Sauté the garlic','Stir the minced garlic in the oil just until fragrant.','30 sec','pan','garlic',['garlic']),
      step('Make the sauce','Pour in tomato sauce and cream. Stir and bring to a gentle simmer.','3–4 min','pan','sauce',['tomato','cream']),
      step('Stir in Parmesan','Turn the heat to low and stir in the Parmesan until melted. Season to taste.','1 min','pan','cheese',['cheese','season']),
      step('Toss the pasta','Add the drained pasta and toss until coated with sauce.','1 min','pan','toss',['pasta']),
      step('Plate with burrata','Divide the pasta among plates. Tear the burrata and share it evenly.','1 min','plate','platePasta',['burrata']),
      step('Finish with basil','Tear fresh basil over the pasta and serve warm.','1 min','plate','basil',['basil'])
    ]
  },
  { id:'beef', name:'Teriyaki Beef Rice Bowl', category:'Rice bowls', time:'35 min', color:'#e8c979', description:'Glossy teriyaki beef, colorful vegetables and fluffy rice.',
    ingredients:[
      ingredient('beef','ground beef',.5,'lb'),ingredient('rice','uncooked rice',1,'cup'),ingredient('pepper','bell pepper',1),
      ingredient('carrot','carrot',1),ingredient('onion','onion',.5),ingredient('garlic','garlic, minced',2,'clove'),
      ingredient('teriyaki','teriyaki sauce',.25,'cup'),ingredient('oil','cooking oil',1,'tbsp'),ingredient('herbs','parsley or green onions',null)
    ],
    steps:[prep,
      step('Cook the rice','Add rinsed rice and the water specified on its package. Cover, simmer and rest as directed.','15–25 min','pot','rice',['rice']),
      step('Chop the vegetables','Dice the pepper and onion, and thinly slice the carrot on a stable cutting board.','5 min','board','chop',['pepper','carrot','onion']),
      step('Warm the oil','Pour cooking oil into a skillet over medium-high heat.','1 min','pan','oil',['oil']),
      step('Stir-fry the vegetables','Add pepper, carrot and onion. Stir until crisp-tender.','3–5 min','pan','veg',['pepper','carrot','onion']),
      step('Add garlic','Stir in minced garlic and cook until fragrant.','30 sec','pan','garlic',['garlic']),
      step('Brown the beef','Add the beef and break it into crumbles with a spatula. Cook to 160°F (71°C), checked with a food thermometer.','5–8 min','pan','beef',['beef']),
      step('Pour in teriyaki','Add teriyaki sauce and let it bubble briefly.','1 min','pan','teriyaki',['teriyaki']),
      step('Coat the beef and vegetables','Stir until everything is glossy and evenly coated.','1 min','pan','stir'),
      step('Assemble the bowls','Divide the rice among bowls. Top with teriyaki beef and vegetables, then add optional garnish.','2 min','bowl','bowlBeef',['rice','herbs'])
    ]
  },
  { id:'shrimp', name:'Garlic Butter Shrimp', category:'Seafood', time:'15 min', color:'#c7b6e6', description:'Juicy shrimp, golden garlic butter and a bright squeeze of lemon.',
    ingredients:[
      ingredient('shrimp','medium raw shrimp, peeled and deveined',12),ingredient('butter','butter',2,'tbsp'),
      ingredient('garlic','garlic, minced',3,'clove'),ingredient('oil','olive oil',1,'tbsp'),ingredient('lemon','lemon',.5),
      ingredient('parsley','fresh parsley',1,'tbsp'),ingredient('season','salt and pepper',null)
    ],
    steps:[prep,
      step('Pat the shrimp dry','Blot the peeled, deveined shrimp with paper towels. Discard the towels, then wash hands and clean the prep surface. Season the shrimp.','2 min','board','dry',['shrimp','season']),
      step('Heat oil and butter','Warm oil over medium heat. Add butter and let it melt and foam.','1 min','pan','butter',['oil','butter']),
      step('Add garlic','Stir the minced garlic briefly, just until fragrant.','20–30 sec','pan','garlic',['garlic']),
      step('Add the shrimp','Lay the shrimp in one layer with a little space between them. Work in batches if needed.','30 sec','pan','shrimp',['shrimp']),
      step('Sear the first side','Cook until the underside turns pink and the flesh begins turning opaque.','1–2 min','pan','sear'),
      step('Flip and finish cooking','Flip each shrimp. Cook until the flesh is pearly and opaque throughout and reaches 145°F (63°C).','1–2 min','pan','flip'),
      step('Squeeze the lemon','Take the pan off the heat and squeeze lemon juice over the shrimp.','30 sec','pan','lemon',['lemon']),
      step('Sprinkle parsley','Scatter chopped fresh parsley over the shrimp.','30 sec','pan','parsley',['parsley']),
      step('Plate and serve','Transfer the shrimp to clean plates and spoon the garlic butter over them.','1 min','plate','plateShrimp')
    ]
  }
];
export function measure(item, servings) {
  if (item.amount === null) return item.id === 'herbs' ? 'Optional' : 'To taste';
  const value = item.amount * servings / 2;
  const whole = Math.floor(value);
  const fractions = { 1:'⅛', 2:'¼', 3:'⅜', 4:'½', 5:'⅝', 6:'¾', 7:'⅞' };
  const number = [whole || '', fractions[Math.round((value - whole) * 8)]].filter(Boolean).join(' ');
  const unit = ['cup','clove','ball'].includes(item.unit) && value > 1 ? item.unit + 's' : item.unit;
  return [number,unit].filter(Boolean).join(' ');
}
