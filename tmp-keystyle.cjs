const fs=require('fs'); const path=require('path');
function walk(d){let o=[]; for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) o=o.concat(walk(p)); else if(p.endsWith('.json')) o.push(p);} return o;}
function scan(obj,prefix=''){
  let bad=[];
  for(const [k,v] of Object.entries(obj||{})){
    const p=prefix?`${prefix}.${k}`:k;
    if(!/^[a-z][a-zA-Z0-9]*$/.test(k)) bad.push(p);
    if(v&&typeof v==='object'&&!Array.isArray(v)) bad=bad.concat(scan(v,p));
  }
  return bad;
}
const files=walk('src/locales');
const out=[];
for(const f of files){const data=JSON.parse(fs.readFileSync(f,'utf8')||'{}'); const bad=scan(data); if(bad.length) out.push({file:f.replace(/\\/g,'/'),count:bad.length,bad});}
console.log(JSON.stringify(out,null,2));
