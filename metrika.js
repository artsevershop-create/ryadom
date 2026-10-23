/* Яндекс Метрика и цели. Номер счётчика — window.RYADOM_YM в config.js; пока он 0, ничего не загружается.
   Цели (идентификаторы JavaScript-событий в Метрике): lead_sent, lead_fallback, form_start, click_phone, click_email, download_kp, open_demo, demo_60s */
(function(){
  var id=+window.RYADOM_YM||0;
  window.ryadomGoal=function(name,params){try{if(id&&window.ym)ym(id,'reachGoal',name,params||{})}catch(e){}};
  if(!id)return;
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();
    k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})
  (window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
  ym(id,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});

  var page=location.pathname.replace(/^.*\//,'').replace('.html','')||'index';
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]'); if(!a)return;
    var h=a.getAttribute('href')||'';
    if(h.indexOf('tel:')===0)ryadomGoal('click_phone',{page:page});
    else if(h.indexOf('mailto:')===0)ryadomGoal('click_email',{page:page});
    else if(/\.pdf(\?|$)/i.test(h)||a.hasAttribute('download'))ryadomGoal('download_kp',{page:page,file:h.replace(/^.*\//,'')});
    else if(/(^|\/)demo\//.test(h))ryadomGoal('open_demo',{page:page,demo:h.replace(/^.*demo\//,'').replace('.html','')});
  },true);
  var started=false;
  document.addEventListener('focusin',function(e){
    if(started||!e.target.closest)return;
    if(e.target.closest('#lead,#req,form')){started=true;ryadomGoal('form_start',{page:page})}
  });
  if(/\/demo\//.test(location.pathname)){
    var t=setTimeout(function(){ryadomGoal('demo_60s',{demo:page})},60000);
    document.addEventListener('visibilitychange',function(){if(document.hidden)clearTimeout(t)});
  }
})();
