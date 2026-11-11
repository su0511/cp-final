import { artifacts } from './data';
export function mixColors(colors: string[]) {
  if (!colors.length) return '#FFFFFF';
  return '#' + [1,3,5].map(i => Math.round(colors.reduce((n,c) => n + parseInt(c.slice(i,i+2),16),0)/colors.length).toString(16).padStart(2,'0')).join('').toUpperCase();
}
function lab(hex: string) {
  const [r,g,b] = [1,3,5].map(i => {const v = parseInt(hex.slice(i,i+2),16)/255; return v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4;});
  const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b), m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b), s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
  return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s];
}
export function colorDistance(actual: string,target: string) {
  const a=lab(actual), b=lab(target);
  return Math.hypot(...a.map((v,i)=>v-b[i]));
}
export function matchScore(actual: string,target: string, precision = 0) {
  const factor = 10 ** precision;
  return Math.round(Math.max(0,Math.min(100,100*(1-colorDistance(actual,target)/.4))) * factor) / factor;
}
// Targets are mixed from available objects: every challenge has an exact solution.
export const challenges = [
  {title:'Mist over the Nile',note:'Balance cool water with sunlit stone.',indices:[0,2,5]},
  {title:'An amber afternoon',note:'Explore earth, clay and golden light.',indices:[1,3,7]},
  {title:'The quiet gallery',note:'Bring muted tones into a delicate balance.',indices:[8,12,16]},
  {title:'Deep indigo',note:'',indices:[21,32,34]},
  {title:'Forest shade',note:'',indices:[10,38,39]},
  {title:'Burnished clay',note:'',indices:[8,19,37]},
  {title:'Pale ivory',note:'',indices:[2,7,15]},
  {title:'Lagoon green',note:'',indices:[0,4,25]},
  {title:'Golden hour',note:'',indices:[5,17,35]},
  {title:'Rosewood',note:'',indices:[6,29,31]},
  {title:'Soft sage',note:'',indices:[14,18,30]},
  {title:'Midnight stone',note:'',indices:[26,32,38]},
  {title:'Dusty lavender',note:'',indices:[2,21,34]},
  {title:'Warm sand',note:'',indices:[9,23,27]},
  {title:'Silver mist',note:'',indices:[7,16,24]},
].map(({indices,...c},id)=>({...c,id,target:mixColors(indices.map(i=>artifacts[i].hex))}));
export interface SavedMix {key:string; challengeId:number; ids:string[];}
export function readSavedMixes(raw: string|null): SavedMix[] {
  try {
    const data:unknown=JSON.parse(raw || '[]');
    if (!Array.isArray(data)) return [];
    return data.filter((v):v is SavedMix=>v && typeof v.key==='string' && Number.isInteger(v.challengeId) && challenges[v.challengeId] && Array.isArray(v.ids) && v.ids.length===3 && new Set(v.ids).size===3 && v.ids.every((id:unknown)=>artifacts.some(a=>a.id===id))).slice(0,30);
  } catch {return [];}
}
