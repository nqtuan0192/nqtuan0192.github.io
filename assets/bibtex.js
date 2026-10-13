// Lightweight BibTeX reader: nested braces, quoted values, macros, and concatenation.
export function parseBibtex(source) {
  let i = 0;
  const entries = [], macros = new Map(Object.entries({jan:'January',feb:'February',mar:'March',apr:'April',may:'May',jun:'June',jul:'July',aug:'August',sep:'September',oct:'October',nov:'November',dec:'December'}));
  const skip = () => { while(i < source.length) { if(/\s/.test(source[i])) i++; else if(source[i] === '%') { while(i < source.length && source[i] !== '\n') i++; } else break; } };
  function grouped(open, close) {
    i++; let depth = 1, result = '';
    while(i < source.length) {
      const ch = source[i++];
      if(ch === '\\' && i < source.length) { result += ch + source[i++]; continue; }
      if(ch === open) depth++;
      if(ch === close) { depth--; if(!depth) return result; }
      result += ch;
    }
    throw new Error('Unclosed BibTeX value');
  }
  function atom() {
    skip();
    if(source[i] === '{') return grouped('{','}');
    if(source[i] === '"') {
      i++; let result='', depth=0;
      while(i < source.length) {
        const ch=source[i++];
        if(ch==='\\' && i < source.length) { result+=ch+source[i++]; continue; }
        if(ch==='{') depth++;
        if(ch==='}') depth--;
        if(ch==='"' && depth===0) return result;
        result+=ch;
      }
      throw new Error('Unclosed quoted BibTeX value');
    }
    const start=i;
    while(i < source.length && !/[\s,#})]/.test(source[i])) i++;
    if(start===i) throw new Error('Expected BibTeX value');
    const token=source.slice(start,i);
    return macros.get(token.toLowerCase()) ?? token;
  }
  function value() { let result=atom(); skip(); while(source[i]==='#') { i++; result+=atom(); skip(); } return result; }
  while(i < source.length) {
    skip();
    if(source[i]!=='@') { i++; continue; }
    const start=i++;
    const match=source.slice(i).match(/^[a-zA-Z]+/);
    if(!match) throw new Error('Invalid entry type');
    const type=match[0].toLowerCase(); i+=match[0].length; skip();
    const open=source[i], close=open==='{'?'}':')';
    if(open!=='{' && open!=='(') throw new Error('Expected entry delimiter');
    if(type==='comment') { grouped(open,close); continue; }
    i++; skip();
    if(type==='preamble') { value(); skip(); if(source[i]===',') {i++;skip();} if(source[i++]!==close) throw new Error('Invalid preamble'); continue; }
    let key='';
    if(type!=='string') {
      const keyStart=i; while(i<source.length && source[i]!==',' && source[i]!==close) i++;
      key=source.slice(keyStart,i).trim();
      if(source[i]===',') i++;
    }
    const fields={};
    while(i < source.length) {
      skip(); if(source[i]===close) {i++;break;} if(source[i]===',') {i++;continue;}
      const field=source.slice(i).match(/^[\w-]+/);
      if(!field) throw new Error('Invalid field in '+(key||type));
      i+=field[0].length; skip(); if(source[i++]!=='=') throw new Error('Expected equals sign');
      fields[field[0].toLowerCase()]=value(); skip();
      if(source[i]!==',' && source[i]!==close) throw new Error('Expected field separator');
    }
    if(source[i-1]!==close) throw new Error('Unclosed BibTeX entry');
    if(type==='string') for(const [name,val] of Object.entries(fields)) macros.set(name,val);
    else entries.push({type,key,fields,raw:source.slice(start,i)});
  }
  return entries;
}
export function plainText(value='') {
  return value
    .replace(/\\(?:textit|textbf|emph|textrm|texttt|mathrm)\s*\{([^{}]*)\}/g,'$1')
    .replace(/\\([\x27"`^~=.uvHckbdtr])\s*\{?([A-Za-z])\}?/g,(_,accent,letter)=> {
      const marks={"'":'\u0301','"':'\u0308','`':'\u0300','^':'\u0302','~':'\u0303','=':'\u0304','.':'\u0307',u:'\u0306',v:'\u030c',H:'\u030b',c:'\u0327',k:'\u0328',b:'\u0331',d:'\u0323',r:'\u030a',t:'\u0361'};
      return (letter+(marks[accent]||'')).normalize('NFC');
    })
    .replace(/\\(ae|AE|oe|OE|aa|AA|ss|o|O|l|L)\b\s*/g,(_,x)=>({ae:'æ',AE:'Æ',oe:'œ',OE:'Œ',aa:'å',AA:'Å',ss:'ß',o:'ø',O:'Ø',l:'ł',L:'Ł'})[x])
    .replace(/\\([&%_$#{}])/g,'$1').replace(/[{}]/g,'').replace(/~/g,' ').replace(/---/g,'—').replace(/--/g,'–').replace(/\s+/g,' ').trim();
}
export function formatAuthors(value='') {
  const authors=[]; let depth=0,start=0;
  for(let i=0;i<value.length;i++) {
    if(value[i]==='{') depth++; if(value[i]==='}') depth--;
    const separator=depth===0 && value.slice(i).match(/^\s+and\s+/i);
    if(separator) { authors.push(value.slice(start,i)); i+=separator[0].length-1; start=i+1; }
  }
  authors.push(value.slice(start));
  return authors.filter(x=>x.trim()).map(author=>{
    if(author.trim().startsWith('{')) return plainText(author);
    const parts=author.split(',').map(x=>plainText(x));
    return parts.length===3 ? [parts[2],parts[0],parts[1]].join(' ') : parts.length===2 ? [parts[1],parts[0]].join(' ') : parts[0];
  }).join(', ');
}
export function formatVenue(entry) {
  const f=entry.fields;
  const venue=plainText(f.journal||f.booktitle||f.publisher||f.school||f.institution||f.note||'');
  const details=[];
  if(venue) details.push(venue);
  if(f.volume) details.push(plainText(f.volume)+(f.number?' ('+plainText(f.number)+')':''));
  if(f.pages) details.push('pp. '+plainText(f.pages));
  if(f.year) details.push(plainText(f.year));
  return details.join(' · ');
}
