const fs = require('fs');
const path = require('path');

const root = process.cwd();
const srcDirs = ['src/pages','src/components','src/layout','src/features'];
const locales = {
  en: path.join(root, 'src/locales/en'),
  id: path.join(root, 'src/locales/id')
};

function exists(p){ try{ fs.accessSync(p); return true;}catch{return false;} }

function walk(dir, exts=['.ts','.tsx','.json']){
  const out=[];
  if(!exists(dir)) return out;
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,ent.name);
    if(ent.isDirectory()) out.push(...walk(p,exts));
    else if(exts.includes(path.extname(ent.name))) out.push(p);
  }
  return out;
}

function flatten(obj, prefix=''){
  const out=[];
  if(obj && typeof obj==='object' && !Array.isArray(obj)){
    for(const [k,v] of Object.entries(obj)){
      const next = prefix ? `${prefix}.${k}` : k;
      if(v && typeof v==='object' && !Array.isArray(v)) out.push(...flatten(v,next));
      else out.push(next);
    }
  }
  return out;
}

const localeKeySet = { en:new Set(), id:new Set() };
for(const lang of ['en','id']){
  for(const file of walk(locales[lang],['.json'])){
    const ns = path.basename(file,'.json');
    const raw = fs.readFileSync(file,'utf8');
    const data = raw.trim() ? JSON.parse(raw) : {};
    for(const k of flatten(data)) localeKeySet[lang].add(`${ns}:${k}`);
  }
}

const codeFiles = srcDirs.flatMap(d=>walk(path.join(root,d),['.ts','.tsx']));
const tKeyUsage=[];
const keyRegex = /\bt\(\s*['\"]([^'\"]+)['\"]/g;
for(const file of codeFiles){
  const rel = path.relative(root,file).replace(/\\/g,'/');
  const txt = fs.readFileSync(file,'utf8');
  let m;
  while((m=keyRegex.exec(txt))){
    tKeyUsage.push({file:rel,key:m[1]});
  }
}

const missing=[];
const badFormat=[];
for(const u of tKeyUsage){
  const key=u.key;
  if(!key.includes(':')) continue;
  const [,pathKey]=key.split(':');
  const parts = pathKey.split('.');
  for(const p of parts){
    if(!/^[a-z][a-zA-Z0-9]*$/.test(p)) badFormat.push({file:u.file,key,part:p});
  }
  const inEn=localeKeySet.en.has(key);
  const inId=localeKeySet.id.has(key);
  if(!inEn || !inId) missing.push({file:u.file,key,inEn,inId});
}

const hardcoded=[];
const patterns=[
  />\s*([^<{][^<>{}]{1,120})\s*</g,
  /\b(?:label|placeholder|title|aria-label|alt)\s*=\s*['\"]([^'\"]{2,120})['\"]/g
];
const ignore=/^(\s*|true|false|none|xs|sm|md|lg|xl|row|column|outlined|contained|text|small|medium|large|left|right|center|top|bottom|primary|secondary|success|error|warning|info)$/i;
for(const file of codeFiles){
  const rel = path.relative(root,file).replace(/\\/g,'/');
  const txt = fs.readFileSync(file,'utf8');
  for(const re of patterns){
    let m;
    while((m=re.exec(txt))){
      const s=(m[1]||'').replace(/\s+/g,' ').trim();
      if(!s) continue;
      if(ignore.test(s)) continue;
      if(s.includes('{')||s.includes('}')) continue;
      if(/^[^A-Za-z]*$/.test(s)) continue;
      if(/^(https?:|\/|#|rgba?\(|[A-Za-z0-9_\-]+\.(png|svg|jpg|jpeg|webp|gif))/.test(s)) continue;
      hardcoded.push({file:rel,text:s.slice(0,160)});
    }
  }
}

function inferDomain(file){
  const f=file.toLowerCase();
  if(f.includes('/auth/')) return 'auth';
  if(f.includes('/dashboard/')||f.includes('dashboard')) return 'dashboard';
  if(f.includes('quiz')) return 'quiz';
  if(f.includes('/tasks/')||f.includes('task')) return 'tasks';
  if(f.includes('/library/')||f.includes('librarypage')) return 'library';
  if(f.includes('material')) return 'material';
  if(f.includes('folder')) return 'folder';
  if(f.includes('flashcard')) return 'flashcard';
  if(f.includes('landing')) return 'landing';
  if(f.includes('progress')) return 'progress';
  return 'unknown';
}

const nsWarn=[];
for(const u of tKeyUsage){
  if(!u.key.includes(':')) continue;
  const ns=u.key.split(':')[0];
  const domain=inferDomain(u.file);
  if(domain==='unknown') continue;
  if(ns==='common') continue;
  const allowed = new Set([domain]);
  if(domain==='library'){ allowed.add('material'); allowed.add('folder'); }
  if(domain==='material'){ allowed.add('library'); }
  if(!allowed.has(ns)) nsWarn.push({file:u.file,key:u.key,domain});
}

const out={
  totals:{ codeFiles:codeFiles.length, tKeyUsage:tKeyUsage.length, missing:missing.length, badFormat:badFormat.length, hardcodedCandidates:hardcoded.length, namespaceWarnings:nsWarn.length },
  missing,
  badFormat,
  namespaceWarnings:nsWarn,
  hardcodedCandidates:hardcoded
};

const outPath = path.join(root,'i18n-audit-report.json');
fs.writeFileSync(outPath, JSON.stringify(out,null,2));
console.log('WROTE', outPath);
console.log('TOTALS', JSON.stringify(out.totals));
