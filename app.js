const menu=document.querySelector('.menu');
const nav=document.querySelector('#nav');
function setMenu(open){
 menu?.setAttribute('aria-expanded',String(open));
 if(menu)menu.textContent=open?'Close':'Menu';
 nav?.classList.toggle('open',open);
}
menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav?.classList.contains('open')){setMenu(false);menu.focus()}});
document.addEventListener('click',event=>{if(!event.target.closest('header')&&nav?.classList.contains('open'))setMenu(false)});
document.addEventListener('site:navigate',()=>setMenu(false));
const search=document.querySelector('#search');search?.addEventListener('input',()=>{let count=0;document.querySelectorAll('.searchable .card').forEach(card=>{card.hidden=!card.textContent.toLowerCase().includes(search.value.toLowerCase().trim());if(!card.hidden)count++});document.querySelector('.search-status').textContent=count?`${count} results`:'No results. Try another search.'});
const resumeZoom=document.querySelector('.resume-zoom');resumeZoom?.addEventListener('click',()=>{const enlarged=resumeZoom.getAttribute('aria-pressed')!=='true';resumeZoom.setAttribute('aria-pressed',String(enlarged));resumeZoom.textContent=enlarged?'Fit pages to screen':'Enlarge pages';document.querySelector('#resume-viewer').classList.toggle('enlarged',enlarged)});
