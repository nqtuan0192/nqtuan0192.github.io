import {savedLanguage, translate} from './i18n.js';
let language = savedLanguage();
const t = (key, values) => translate(language, key, values);
import {parseBibtex,plainText,formatAuthors,formatVenue} from './bibtex.js';
const themeButton=document.querySelector('#theme-toggle');
function syncTheme() {
  const dark=document.documentElement.dataset.theme==='dark';
  themeButton.setAttribute('aria-pressed',String(dark));
  themeButton.setAttribute('aria-label',t(dark?'switchLight':'switchDark'));
  document.querySelector('#theme-icon').textContent=t(dark?'dark':'light');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#000000':'#f6f5f4');
}
syncTheme();
themeButton.addEventListener('click',()=>{
  const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem('profile-theme',theme)}catch{}
  syncTheme();
});
document.querySelector('#year').textContent=new Date().getFullYear();
const list=document.querySelector('#publication-list'),count=document.querySelector('#publication-count'),search=document.querySelector('#publication-search');
let publications=[],filter='all',loaded=false,loadFailed=false;
function el(tag,className,text) {const node=document.createElement(tag);if(className)node.className=className;if(text)node.textContent=text;return node;}
function safeUrl(value) { try {const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:null;} catch{return null;} }
function render() {
  if(!loaded) {
    count.textContent=t(loadFailed?'loadError':'loading');
    if(loadFailed)list.replaceChildren(el('p','empty',t('loadErrorDetail')));
    return;
  }
  const query=search.value.trim().toLocaleLowerCase();
  const selected=publications.filter(entry=>{
    const category=['article','inproceedings'].includes(entry.type)?entry.type:'other';
    return (filter==='all'||filter===category)&&plainText(Object.values(entry.fields).join(' ')).toLocaleLowerCase().includes(query);
  });
  list.replaceChildren();
  count.textContent=t(selected.length===1?'countOne':'countMany',{count:selected.length});
  if(!selected.length)list.append(el('p','empty',t('empty')));
  for(const entry of selected) {
    const f=entry.fields,row=el('article','publication'),content=el('div','pub-content'),actions=el('div','pub-actions');
    row.append(el('span','pub-year',plainText(f.year)||t('noYear')));
    content.append(el('h3','',plainText(f.title)||t('untitled')));
    content.append(el('p','pub-authors',formatAuthors(f.author)||t('noAuthor')));
    const venue=el('p','pub-venue',formatVenue(entry));
    venue.append(el('span','pub-type pub-type-'+entry.type,t(({article:'typeArticle',inproceedings:'typeConference',book:'typeBook',phdthesis:'typeThesis',mastersthesis:'typeThesis'})[entry.type]||'typeOther')));
    content.append(venue);row.append(content);
    const doi=f.doi?plainText(f.doi).replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,''):null;
    const link=safeUrl(doi?'https://doi.org/'+doi:plainText(f.url));
    if(link){const a=el('a','',doi?'DOI ↗':t('read'));a.href=link;a.target='_blank';a.rel='noopener noreferrer';actions.append(a);}
    const bib=el('button','','BibTeX ↓');bib.type='button';bib.setAttribute('aria-label',t('downloadBib',{title:plainText(f.title)}));bib.addEventListener('click',()=>{
      const url=URL.createObjectURL(new Blob([entry.raw+'\n'],{type:'text/plain;charset=utf-8'}));
      const a=document.createElement('a');a.href=url;a.download=entry.key.replace(/[^a-zA-Z0-9_-]/g,'_')+'.bib';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });actions.append(bib);row.append(actions);list.append(row);
  }
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
  render();
}));
search.addEventListener('input',render);

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t('title');
  document.querySelectorAll('[data-i18n]').forEach(node => {
    node.textContent = t(node.dataset.i18n);
  });
  for (const attribute of ['aria-label', 'placeholder', 'alt', 'content', 'href', 'title']) {
    document.querySelectorAll('[data-i18n-' + attribute + ']').forEach(node => {
      node.setAttribute(attribute, t(node.getAttribute('data-i18n-' + attribute)));
    });
  }
  const button = document.querySelector('#language-toggle');
  button.setAttribute('aria-pressed', String(language === 'vi'));
  button.setAttribute('aria-label', t('switchLanguage'));
  button.setAttribute('title', t('switchLanguage'));
  syncTheme();
  render();
}
document.querySelector('#language-toggle').addEventListener('click', () => {
  language = language === 'en' ? 'vi' : 'en';
  try { localStorage.setItem('profile-language', language); } catch {}
  applyLanguage();
});
applyLanguage();

try {
  const response=await fetch(new URL('../publications.bib',import.meta.url));
  if(!response.ok)throw new Error('HTTP '+response.status);
  publications=parseBibtex(await response.text()).sort((a,b)=>(Number(b.fields.year)||0)-(Number(a.fields.year)||0)||plainText(a.fields.title).localeCompare(plainText(b.fields.title)));
  loaded=true;render();
} catch(error) {
  loadFailed=true;
  render();
  console.error('Publication loading failed:',error);
}

// Keep the i3-style workspace indicator in sync with the visible section.
if (typeof IntersectionObserver === "function") {
  const workspaces = document.querySelectorAll(".workspace");
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      workspaces.forEach(link => {
        const active = link.getAttribute("href") === "#" + entry.target.id;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
  }, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
  document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
}
