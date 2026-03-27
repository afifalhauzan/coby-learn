const fs = require('fs');
const path = require('path');
const root = process.cwd();
function walk(dir){
  const out=[]; for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,ent.name); if(ent.isDirectory()) out.push(...walk(p)); else if(p.endsWith('.json')) out.push(p);
  } return out;
}
function flatten(obj,prefix=''){
  const out={};
  for(const [k,v] of Object.entries(obj||{})){
    const n = prefix?`${prefix}.${k}`:k;
    if(v && typeof v==='object' && !Array.isArray(v)) Object.assign(out, flatten(v,n));
    else out[n]=String(v);
  }
  return out;
}
const ph = s => [...new Set((s.match(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g)||[]).map(x=>x.replace(/\{|\}|\s/g,'')))].sort();
const enDir=path.join(root,'src/locales/en'); const idDir=path.join(root,'src/locales/id');
const issues=[];
for(const enFile of walk(enDir)){
  const rel=path.basename(enFile);
  const idFile=path.join(idDir,rel);
  if(!fs.existsSync(idFile)) continue;
  const en = flatten(JSON.parse(fs.readFileSync(enFile,'utf8')||'{}'));
  const id = flatten(JSON.parse(fs.readFileSync(idFile,'utf8')||'{}'));
  const keys = new Set([...Object.keys(en),...Object.keys(id)]);
  for(const k of keys){
    const ev=en[k], iv=id[k];
    if(ev===undefined||iv===undefined) continue;
    const eP=ph(ev), iP=ph(iv);
    if(JSON.stringify(eP)!==JSON.stringify(iP)) issues.push({namespace:path.basename(rel,'.json'),key:k,en:eP,id:iP,enValue:ev,idValue:iv});
    if(iv==='') issues.push({namespace:path.basename(rel,'.json'),key:k,type:'emptyIdValue',enValue:ev});
  }
}
const outPath=path.join(root,'i18n-placeholder-report.json');
fs.writeFileSync(outPath, JSON.stringify(issues,null,2));
console.log('WROTE',outPath,'COUNT',issues.length);
