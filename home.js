/* старые ссылки вида /#price: якоря переехали на отдельные страницы */
(function(){var h=location.hash.slice(1);if(!h||document.getElementById(h))return;
 var m={try:'kak-rabotaet.html',how:'kak-rabotaet.html',features:'kak-rabotaet.html',case:'kak-rabotaet.html',who:'dlya-kogo.html',benefits:'dlya-kogo.html',price:'tarify.html',faq:'tarify.html'};
 var p=m[h]||(h.indexOf('b-')===0?'dlya-kogo.html':'');if(p)location.replace(p+'#'+h)})();
(function(){
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var fmt=function(n){return Math.round(n).toLocaleString('ru-RU').replace(/ /g,' ')+' ₽'};
  try{$('#yr').textContent=new Date().getFullYear()}catch(e){}

try{
  /* ---------- появление блоков при прокрутке ---------- */
  var io=null;
  if(!reduce&&'IntersectionObserver' in window){
    document.documentElement.classList.add('js');
    io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('in'); io.unobserve(e.target)}
    })},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    $$('[data-reveal],#plans,#steps').forEach(function(el){io.observe(el)});
  } else $$('#plans,#steps').forEach(function(el){el.classList.add('in')});

}catch(e){}
try{
  /* ---------- счётчики ---------- */
  function countUp(el){
    var to=+el.getAttribute('data-count'), t0=null, dur=1400;
    if(reduce){el.textContent=to; return}
    function f(t){if(!t0)t0=t; var k=Math.min(1,(t-t0)/dur); k=1-Math.pow(1-k,3); el.textContent=Math.round(to*k); if(k<1)requestAnimationFrame(f)}
    el.textContent=0; requestAnimationFrame(f);
  }
  if('IntersectionObserver' in window){
    var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){countUp(e.target); co.unobserve(e.target)}})},{threshold:.6});
    $$('[data-count]').forEach(function(el){co.observe(el)});
  }

}catch(e){}
try{
  /* ---------- прогресс, меню, липкая кнопка ---------- */
  var tt=$('#totop');if(tt){tt.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});addEventListener('scroll',function(){tt.classList.toggle('on',scrollY>700)},{passive:true})}
  var prog=$('#progress'), links=$$('#nav a'), fab=$('#fab');
  var secs=links.map(function(a){var h=a.getAttribute('href')||'';return h.charAt(0)==='#'?$(h):null});
  function onScroll(){
    var h=document.documentElement, max=h.scrollHeight-innerHeight, y=scrollY;
    if(prog)prog.style.transform='scaleX('+(max>0?Math.min(1,y/max):0)+')';
    var cur=-1; secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<innerHeight*.4)cur=i});
    links.forEach(function(a,i){if(secs[i])a.classList.toggle('on',i===cur)});
    var hero=$('#heroSec')||$('.ph'); if(fab)fab.classList.toggle('on',!!hero&&hero.getBoundingClientRect().bottom<0);
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  var topBar=$('.top'); if(topBar){var ts=function(){topBar.classList.toggle('scrolled',scrollY>8)}; addEventListener('scroll',ts,{passive:true}); ts()}

}catch(e){}
try{
  /* ---------- круговая волна на кнопках ---------- */
  document.addEventListener('pointerdown',function(e){
    var b=e.target.closest&&e.target.closest('.btn'); if(!b||reduce)return;
    var r=b.getBoundingClientRect(), d=Math.max(r.width,r.height)*2, s=document.createElement('span');
    s.className='rip'; s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';
    b.appendChild(s); setTimeout(function(){s.remove()},650);
  });

}catch(e){}
try{
  /* ---------- живой мини-зал: план Ямальской филармонии ---------- */
  var NS='http://www.w3.org/2000/svg', svg=$('#mh');
  var CATS=[{n:'Партер, 2–5 ряды',p:4000},{n:'Партер, 6–9 ряды',p:3600},{n:'Амфитеатр, 10–16 ряды',p:3000},{n:'Амфитеатр, 17–21 ряды',p:2300},{n:'Верхние ряды, 22–25',p:2000}];
  var COL=['#F5A623','#EE7B30','#D9486A','#8A55D0','#4A78E0'];
  var rowPy=function(r){return r===2?134:r<=9?151+(r-3)*17.5:r<=21?283+(r-10)*17.5:502.5+(r-22)*17.5};
  var catOf=function(r){return r<=5?0:r<=9?1:r>=22?4:r<=16?2:3};
  var blocks=function(r){
    if(r===2)return [[1,14,function(n){return 149+(n-1)*17.2}],[15,28,function(n){return 424+(n-15)*17.2}]];
    if(r<=9)return [[1,16,function(n){return 114+(n-1)*17.2}],[17,32,function(n){return 424+(n-17)*17.2}]];
    var L=function(n){return 81+(n-1)*17.2},C=function(n){return 269+(n-10)*17.1},R=function(n){return 577+(n-26)*17.25};
    if(r<=20)return [[1,9,L],[10,25,C],[26,34,R]];
    if(r===21)return [[1,9,L],[10,11,C],[24,25,C],[26,34,R]];
    var last={22:14,23:10,24:8,25:6}[r],lastL={22:7,23:5,24:4,25:3}[r];
    return [[1,lastL,L],[lastL+1,last,function(n){return 715-(last-n)*17.2}]];
  };
  function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  var R0=rng(12*7919), seats=[], sel=[], filt=-1;
  for(var r=2;r<=25;r++){blocks(r).forEach(function(b){for(var n=b[0];n<=b[1];n++){
    var cat=catOf(r), w=[1.3,1.2,1,.8,.6][cat];
    seats.push({r:r,n:n,x:b[2](n),y:rowPy(r),cat:cat,sold:R0()<Math.min(.9,.45*w*.4+.1)});}})}
  function el(name,attrs,parent){var e=document.createElementNS(NS,name); for(var k in attrs)e.setAttribute(k,attrs[k]); if(parent)parent.appendChild(e); return e}
  /* сцена, подписи, двери */
  el('rect',{x:150,y:34,width:500,height:46,rx:10,fill:'#26232f',stroke:'#3a3846'},svg);
  var st=el('text',{x:400,y:62,'text-anchor':'middle','class':'stagetxt'},svg); st.textContent='СЦЕНА';
  [2,3,4,5,6,7,8,9,10,12,14,16,18,20,22,24].forEach(function(rr){[58,742].forEach(function(xx){var t=el('text',{x:xx,y:rowPy(rr)+4,'text-anchor':'middle','class':'rowlbl'},svg); t.textContent=rr})});
  var DOORS=[{n:'Вход 1',s:-1,y:134,x:22},{n:'Вход 1',s:1,y:134,x:778},{n:'Вход 2',s:-1,y:270,x:22},{n:'Вход 2',s:1,y:270,x:778}], doorEls=[];
  DOORS.forEach(function(d){var g=el('g',{'class':'door'},svg); el('rect',{x:d.s<0?22:700,y:d.y-12,width:78,height:24,rx:6},g); g.firstChild.setAttribute('x',d.s<0?24:698);
    var t=el('text',{x:d.s<0?63:737,y:d.y+4,'text-anchor':'middle'},g); t.textContent=d.n+(d.s<0?' · слева':' · справа'); doorEls.push(g)});
  var fov=el('polygon',{'class':'fov'},svg), gSeats=el('g',{},svg), gRoute=el('g',{},svg);
  var nodes=seats.map(function(s,i){
    var e=el('rect',{x:(s.x-6.5).toFixed(1),y:(s.y-6).toFixed(1),width:13,height:12,rx:3,'class':'seat c'+s.cat+(s.sold?' sold':'')},gSeats); e.dataset.i=i; return e});
  /* легенда-фильтр */
  var lg=$('#legend');
  CATS.forEach(function(c,i){var b=document.createElement('button'); b.type='button'; b.innerHTML='<i style="background:'+COL[i]+'"></i>'+c.n+' · '+fmt(c.p); b.onclick=function(){filt=filt===i?-1:i; $$('button',lg).forEach(function(x,k){x.classList.toggle('on',k===filt)}); nodes.forEach(function(nd,k){nd.classList.toggle('dim',filt>=0&&seats[k].cat!==filt)})}; lg.appendChild(b)});
  /* ближайший вход и путь */
  function doorFor(s){var left=s.x<398; return s.r<=5?(left?0:1):(left?2:3)}
  function routePts(s){
    var di=doorFor(s), d=DOORS[di], pts=[];
    if(s.r<10){
      var edge=d.s<0?98:712, dx=d.s<0?100:700;
      pts=[[dx,d.y],[edge,d.y],[edge,s.y],[s.x,s.y]];
    } else {
      var ax=s.x<398?244:551; pts=[[d.s<0?100:700,270],[ax,270],[ax,s.y],[s.x,s.y]];
    }
    return {pts:pts,door:di};
  }
  var tip=$('#tip'), box=$('.hallbox');
  svg.addEventListener('pointermove',function(e){
    var t=e.target; if(!t.dataset||t.dataset.i===undefined){tip.classList.remove('on');return}
    var s=seats[+t.dataset.i], r=box.getBoundingClientRect();
    tip.innerHTML='<b>'+(s.r<=9?'Партер':'Амфитеатр')+' · ряд '+s.r+' · место '+s.n+'</b><span>'+(s.sold?'Место занято':fmt(CATS[s.cat].p)+' · '+DOORS[doorFor(s)].n+(s.x<398?', левая сторона':', правая сторона'))+'</span>';
    tip.style.left=Math.min(e.clientX-r.left+14,r.width-200)+'px'; tip.style.top=(e.clientY-r.top+16)+'px'; tip.classList.add('on');
  });
  svg.addEventListener('pointerleave',function(){tip.classList.remove('on')});
  svg.addEventListener('click',function(e){var t=e.target; if(t.dataset&&t.dataset.i!==undefined)toggle(+t.dataset.i)});
  function toggle(i){
    var s=seats[i]; if(s.sold)return;
    var k=sel.indexOf(i); if(k>=0)sel.splice(k,1); else{ if(sel.length>=4)sel.shift(); sel.push(i)}
    draw();
  }
  var walkT=null;
  function draw(){
    nodes.forEach(function(nd,k){nd.classList.toggle('sel',sel.indexOf(k)>=0)});
    while(gRoute.firstChild)gRoute.removeChild(gRoute.firstChild);
    doorEls.forEach(function(g){g.classList.remove('on')}); fov.classList.remove('on');
    var stubs=$('#stubs'); stubs.innerHTML='';
    if(!sel.length){stubs.innerHTML='<p class="empty">Пока ничего не выбрано. Нажмите на кресло в зале.</p>'}
    var total=0;
    sel.forEach(function(i){var s=seats[i], p=CATS[s.cat].p; total+=p;
      var row=document.createElement('div'); row.className='stubrow';
      row.innerHTML='<div class="m"><b>'+(s.r<=9?'Партер':'Амфитеатр')+' · ряд '+s.r+' · место '+s.n+'</b><span class="d">'+DOORS[doorFor(s)].n+(s.x<398?', левая сторона':', правая сторона')+'</span></div><div class="p">'+fmt(p)+'</div>';
      stubs.appendChild(row);
      var pu=el('rect',{x:(s.x-6.5).toFixed(1),y:(s.y-6).toFixed(1),width:13,height:12,rx:3,'class':'pulse'},gRoute);
    });
    $('#cnt').textContent=sel.length+' '+(sel.length===1?'место':sel.length<5&&sel.length>0?'места':'мест');
    $('#sum').textContent=fmt(total);
    if(sel.length){
      var s=seats[sel[sel.length-1]], rt=routePts(s);
      doorEls[rt.door].classList.add('on');
      var d=rt.pts.map(function(p,k){return (k?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)}).join(' ');
      var path=el('path',{d:d,'class':'route'},gRoute), len=path.getTotalLength?Math.ceil(path.getTotalLength()):900;
      path.style.setProperty('--len',len);
      if(reduce){path.style.animation='none';path.style.strokeDashoffset=0}
      else {
        var w=el('circle',{r:5,'class':'walker'},gRoute), t0=null; clearTimeout(walkT);
        (function step(t){if(!w.parentNode)return; if(!t0)t0=t; var k=((t-t0)%2600)/2600, pt=path.getPointAtLength(len*k); w.setAttribute('cx',pt.x); w.setAttribute('cy',pt.y); requestAnimationFrame(step)})(performance.now());
      }
      fov.setAttribute('points',s.x.toFixed(0)+','+s.y.toFixed(0)+' 150,80 650,80'); fov.classList.add('on');
    }
  }
  $('#clear').onclick=function(){sel=[];draw()};
  $('#best').onclick=function(){
    var best=-1,bs=1e9;
    for(var i=0;i<seats.length-1;i++){var a=seats[i],b=seats[i+1];
      if(a.sold||b.sold||a.r!==b.r||Math.abs(b.x-a.x)>20)continue;
      var sc=Math.hypot((a.x+b.x)/2-398,a.y-250); if(sc<bs){bs=sc;best=i}}
    if(best>=0){sel=[best,best+1];draw()}
  };

}catch(e){}
try{
  /* ---------- калькулятор ---------- */
  var TIERS=[{n:'Малый зал',c:150000,s:36000},{n:'Средний зал',c:490000,s:60000},{n:'Большой зал',c:790000,s:96000},{n:'Арена',c:1190000,s:180000}];
  var hn=1, shown=0, tot=$('#total');
  function calc(){
    var v=$('input[name=tier]:checked').value, all, tn, html;
    if(v==='x'){
      tn='Стадион и крупные объекты'; all=0;
      html='<li><span>Площадка от 10 001 места</span><b>индивидуально</b></li><li><span>Залов</span><b>× '+hn+'</b></li>';
      calc.last={tn:tn,all:0};
      $('#break').innerHTML=html; tot.textContent='Индивидуально'; shown=0; return;
    }
    var t=TIERS[+v]; tn=t.n; all=(t.c+t.s)*hn;
    $('#break').innerHTML='<li><span>Создание, разово</span><b>'+fmt(t.c*hn)+'</b></li><li><span>Подписка на год</span><b>'+fmt(t.s*hn)+'</b></li><li><span>Залов</span><b>× '+hn+'</b></li>';
    calc.last={tn:tn,all:all};
    var from=shown, t0=null; shown=all;
    if(reduce){tot.textContent=fmt(all);return}
    requestAnimationFrame(function f(t){if(!t0)t0=t; var k=Math.min(1,(t-t0)/500); k=1-Math.pow(1-k,3); tot.textContent=fmt(from+(all-from)*k); if(k<1)requestAnimationFrame(f)});
  }
  $$('#calc input').forEach(function(i){i.addEventListener('change',calc)});
  $('#hm').onclick=function(){hn=Math.max(1,hn-1);$('#hn').textContent=hn;calc()};
  $('#hp').onclick=function(){hn=Math.min(20,hn+1);$('#hn').textContent=hn;calc()};
  $('#toForm').onclick=function(){
    var c=calc.last||{tn:'Средний зал',all:550000};
    $('#fMsg').value='Расчёт с сайта: '+c.tn+', залов: '+hn+(c.all?', ориентировочно за первый год '+fmt(c.all):', считаем индивидуально')+'.';
    $('#fSize').value=hn>1?'несколько залов':(c.tn==='Малый зал'?'до 300':c.tn==='Средний зал'?'300–800':c.tn==='Большой зал'?'800–3000':c.tn==='Арена'?'3000–10000':'от 10 000');
    $('#contact').scrollIntoView({behavior:reduce?'auto':'smooth'});
    setTimeout(function(){$('#fName').focus({preventScroll:true})},500);
  };
  shown=550000; tot.textContent=fmt(shown); calc.last={tn:'Средний зал',all:550000}; calc();

}catch(e){}
try{
  /* ---------- заявка и коммерческое предложение ---------- */
  /* Куда отправлять заявки: адрес обработчика (бот, CRM). Пока пусто — заявку можно отправить письмом из окна после отправки формы. */
  var ENDPOINT=window.RYADOM_ENDPOINT||'';
  var KP='kp/ryadom-kp.pdf';
  var f=$('#lead'), out=$('#sent');
  function check(id,eid,ok,msg){var e=document.getElementById(id),er=document.getElementById(eid);er.textContent=ok?'':msg;e.setAttribute('aria-invalid',ok?'false':'true');return ok}
  ['fName','fOrg','fPhone','fEmail'].forEach(function(id){document.getElementById(id).addEventListener('input',function(){document.getElementById('e'+id.slice(1)).textContent=''})});
  document.getElementById('fConsent').addEventListener('change',function(){document.getElementById('eConsent').textContent=''});
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var v={name:f.name.value.trim(),phone:f.phone.value.trim(),org:f.org.value.trim(),email:f.email.value.trim(),size:f.size.value,msg:f.msg.value.trim(),page:'index',consent:true,website:(f.website&&f.website.value)||''};
    var ok=check('fName','eName',v.name.length>1,'Напишите, как к вам обращаться')&
           check('fPhone','ePhone',v.phone.replace(/\D/g,'').length>=10,'Укажите телефон с кодом города')&
           check('fOrg','eOrg',v.org.length>1,'Укажите площадку')&
           check('fEmail','eEmail',/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email),'Укажите почту, например name@company.ru')&
           check('fConsent','eConsent',f.consent.checked,'Нужно согласие на обработку данных');
    if(!ok)return;
    var text='Заявка «РЯДом»\nИмя: '+v.name+'\nТелефон: '+v.phone+'\nПочта: '+v.email+'\nПлощадка: '+v.org+'\nМест в зале: '+v.size+(v.msg?'\nКомментарий: '+v.msg:'');
    function show(sent){
      out.hidden=false;
      out.innerHTML='<div class="kp"><b>Спасибо, '+esc(v.name)+'!</b><p>'+(sent?'Заявка отправлена, ответим в течение рабочего дня.':'Коммерческое предложение для вашей площадки готово.')+' В нём тарифы, состав работ, сроки и реквизиты.</p>'+
        '<a class="btn btn-gold" href="'+KP+'" download target="_blank" rel="noopener">Скачать коммерческое предложение (PDF) <span class="arr">↓</span></a>'+
        (sent?'':'<a class="btn btn-ghost" href="mailto:info@3dryad.ru?subject='+encodeURIComponent('Заявка РЯДом: '+v.org)+'&body='+encodeURIComponent(text)+'">Отправить заявку письмом</a>')+'</div>';
      out.scrollIntoView({behavior:reduce?'auto':'smooth',block:'nearest'});
    }
    if(!ENDPOINT){show(false);return}
    fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v),signal:(window.AbortController?(function(){var c=new AbortController();setTimeout(function(){c.abort()},8000);return c.signal})():undefined)})
      .then(function(r){if(!r.ok)throw 0;show(true);f.reset();window.ryadomGoal&&ryadomGoal('lead_sent',{page:'index'})})
      .catch(function(){show(false);window.ryadomGoal&&ryadomGoal('lead_fallback',{page:'index'})});
  });

  /* предзаполнение формы со страниц сегментов */
  (function(){try{var q=new URLSearchParams(location.search).get('seg');if(!q)return;var m={teatry:'Театр или филармония',kino:'Кинотеатр',sport:'Спортивный зал, арена или стадион',dk:'Дом культуры или городская площадка'};if(m[q]){var t=$('#fMsg');if(t&&!t.value)t.value='Интересует: '+m[q]+'.'}}catch(e){}})();

}catch(e){}
try{
  /* ---------- карусель площадок ---------- */
  (function(){
    var box=$('#vshow'); if(!box)return;
    var slides=$$('.vs',box), tabs=$$('.vt',box), cur=0, T=6500, timer=null, paused=false, wasT=null;
    function syncBs(s){var b=$('.vbs',s);if(b)b.setAttribute('aria-pressed',s.classList.contains('was'))}
    slides.forEach(function(s){var b=$('.vbs',s);if(b)b.addEventListener('click',function(e){e.stopPropagation();clearTimeout(wasT);s.classList.toggle('was');syncBs(s);restart()})});
    function go(i,user){
      cur=(i+slides.length)%slides.length;
      slides.forEach(function(s,k){s.classList.toggle('on',k===cur);if(k!==cur)s.classList.remove('was')});
      var cs=slides[cur];clearTimeout(wasT);if(!reduce){cs.classList.add('was');wasT=setTimeout(function(){cs.classList.remove('was');syncBs(cs)},1500)}syncBs(cs);
      tabs.forEach(function(t,k){t.classList.toggle('on',k===cur);t.setAttribute('aria-selected',k===cur);var u=t.querySelector('u');u.style.animation='none';void u.offsetWidth;u.style.animation=''});
      if(user)restart();
    }
    function restart(){}
    $('.next',box).onclick=function(){go(cur+1,true)}; $('.prev',box).onclick=function(){go(cur-1,true)};
    tabs.forEach(function(t,k){t.onclick=function(){go(k,true)}});
    ['pointerenter','focusin'].forEach(function(ev){box.addEventListener(ev,function(){paused=true;box.classList.add('hold')})});
    ['pointerleave','focusout'].forEach(function(ev){box.addEventListener(ev,function(){paused=false;box.classList.remove('hold')})});
    box.addEventListener('keydown',function(e){if(e.key==='ArrowRight')go(cur+1,true);if(e.key==='ArrowLeft')go(cur-1,true)});
    var sx=null; var st=$('.vstage',box);
    st.addEventListener('pointerdown',function(e){sx=e.clientX});
    st.addEventListener('pointerup',function(e){if(sx===null)return;var d=e.clientX-sx;sx=null;if(Math.abs(d)>50)go(cur+(d<0?1:-1),true)});
    restart();
  })();


}catch(e){}
try{
  /* ---------- сравнение «плоская схема / 3D» ---------- */
  (function(){
    var c=$('#cmp'); if(!c)return;
    var inp=$('#cmpIn'), d3=$('#cmp3'), bar=$('#cmpBar');
    function set(v){d3.style.clipPath='inset(0 0 0 '+v+'%)'; bar.style.left=v+'%'}
    inp.addEventListener('input',function(){set(+inp.value)}); set(+inp.value);
    if(!reduce&&'IntersectionObserver' in window){
      var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){o.disconnect();var t0=null;(function s(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/2400),p=52+Math.sin(k*Math.PI*2)*30*(1-k);inp.value=p;set(p);if(k<1)requestAnimationFrame(s)})(performance.now())}},{threshold:.5});
      o.observe(c);
    }
  })();
}catch(e){}
})();
(function(){
  var mq=matchMedia('(max-width:760px)');
  document.querySelectorAll('.swipe,.plans,.feat-grid,.addons').forEach(function(box){
    var n=box.children.length; if(n<2)return;
    var hint=document.createElement('p'); hint.className='swipe-hint'; hint.textContent='Листайте вбок →'; box.parentNode.insertBefore(hint,box);
    var d=document.createElement('div'); d.className='sdots'; d.setAttribute('aria-hidden','true');
    for(var i=0;i<n;i++)d.appendChild(document.createElement('i'));
    box.parentNode.insertBefore(d,box.nextSibling);
    function upd(){var w=box.children[0].getBoundingClientRect().width+12, k=Math.round(box.scrollLeft/w); if(box.scrollLeft+box.clientWidth>=box.scrollWidth-4)k=n-1; [].forEach.call(d.children,function(x,j){x.classList.toggle('on',j===k)})}
    box.addEventListener('scroll',upd,{passive:true}); upd();
  });
  var nav=document.getElementById('nav'), last=null;
  if(nav)setInterval(function(){var a=nav.querySelector('a.on'); if(a&&a!==last&&nav.scrollWidth>nav.clientWidth){last=a; nav.scrollTo({left:a.offsetLeft-(nav.clientWidth-a.offsetWidth)/2,behavior:'smooth'})}},400);
  var wl=document.getElementById('wl');
  if(wl&&matchMedia('(hover:none)').matches)wl.addEventListener('click',function(e){
    if(e.target.closest('a'))return; var li=e.target.closest('li'); if(!li)return;
    var on=li.classList.contains('act'); [].forEach.call(wl.children,function(x){x.classList.remove('act')}); if(!on)li.classList.add('act');
  });
})();
