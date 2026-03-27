const fs=require('fs'); const path=require('path');
const roots=['src/pages','src/components','src/layout','src/features'];
function walk(d){if(!fs.existsSync(d))return[]; let o=[]; for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name); if(e.isDirectory()) o=o.concat(walk(p)); else if(/\.(tsx|ts)$/.test(e.name)) o.push(p);} return o;}
const files=roots.flatMap(walk);
const out=[];
for(const f of files){const t=fs.readFileSync(f,'utf8'); const hasUseT=/useTranslation\s*\(/.test(t); const jsxText=/(>\s*[A-Za-z][^<{]{2,80}\s*<)|(label|placeholder|title|aria-label|alt)\s*=\s*['\"][A-Za-z][^'\"]{1,80}['\"]/m.test(t); if(jsxText && !hasUseT) out.push(f.replace(/\\/g,'/'));}
console.log(JSON.stringify({count:out.length,files:out},null,2));
