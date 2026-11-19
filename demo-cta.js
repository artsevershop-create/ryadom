/* Кнопка «Хочу такое для своего зала» в 3D-демо и короткая форма заявки.
   Подключается сборкой (build.js) на все страницы /demo/. Заявка уходит на тот же адрес, что и форма сайта (window.RYADOM_ENDPOINT).
   Цели Метрики: demo_cta (открыли форму), form_start (начали заполнять), lead_sent / lead_fallback (с параметром page = demo/<имя>). */
(function(){
  if(window.__ryadomCta)return; window.__ryadomCta=1;
  var EP=window.RYADOM_ENDPOINT||'', demo=location.pathname.replace(/^.*\//,'').replace('.html','')||'demo', page='demo/'+demo;
  var goal=function(n,p){window.ryadomGoal&&ryadomGoal(n,p||{demo:demo})};
  var css=''+
  '#rdCta{position:absolute;z-index:6;top:12px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;height:38px;padding:0 16px 0 12px;border:0;border-radius:19px;'+
    'background:#F4C25B;color:#17140C;font:700 14px/1 Manrope,"Segoe UI",Arial,sans-serif;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.35);white-space:nowrap}'+
  '#rdCta:hover{background:#FFD47A}#rdCta:focus-visible{outline:3px solid #fff;outline-offset:2px}'+
  '#rdCta svg{flex:none}#rdCta .s{display:none}'+
  '@media (max-width:899px){#rdCta{left:10px;top:56px;transform:none;height:34px;font-size:13px;padding:0 12px 0 10px}#rdCta .l{display:none}#rdCta .s{display:inline}}'+
  '#rdM{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(8,7,12,.62)}'+
  '#rdM[hidden]{display:none}'+
  '#rdM .b{width:100%;max-width:420px;max-height:calc(100vh - 32px);overflow:auto;background:#17151D;color:#F2EFE8;border:1px solid #2E2A36;border-radius:16px;padding:20px 20px 18px;font:14px/1.45 Manrope,"Segoe UI",Arial,sans-serif;box-shadow:0 20px 60px rgba(0,0,0,.5)}'+
  '#rdM h2{margin:0 28px 6px 0;font-size:19px;line-height:1.25}#rdM p{margin:0 0 12px;color:#B9B3C4;font-size:13px}'+
  '#rdM .x{position:absolute;top:0;right:0;width:40px;height:40px;border:0;background:none;color:#B9B3C4;font-size:22px;cursor:pointer}'+
  '#rdM .hd{position:relative}'+
  '#rdM label{display:block;margin:0 0 9px;font-size:12px;color:#B9B3C4}'+
  '#rdM input[type=text],#rdM input[type=tel],#rdM input[type=email]{display:block;width:100%;box-sizing:border-box;margin-top:4px;height:40px;padding:0 11px;border:1px solid #3A3544;border-radius:9px;background:#0F0E13;color:#F2EFE8;font:15px Manrope,"Segoe UI",Arial,sans-serif}'+
  '#rdM input:focus{outline:2px solid #F4C25B;outline-offset:0;border-color:#F4C25B}'+
  '#rdM input[aria-invalid=true]{border-color:#E0705A}'+
  '#rdM .ck{display:flex;gap:8px;align-items:flex-start;font-size:12px;line-height:1.4}#rdM .ck input{margin-top:2px;accent-color:#F4C25B}'+
  '#rdM a{color:#F4C25B}#rdM .er{color:#F08A74;font-size:12px;min-height:16px;margin:2px 0 8px}'+
  '#rdM .go{width:100%;height:44px;border:0;border-radius:11px;background:#F4C25B;color:#17140C;font:700 15px Manrope,"Segoe UI",Arial,sans-serif;cursor:pointer}'+
  '#rdM .go:disabled{opacity:.6;cursor:wait}'+
  '#rdM .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}'+
  '#rdM .ok b{display:block;font-size:18px;margin-bottom:6px}';
  var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  var host=document.getElementById('view')||document.body;
  var btn=document.createElement('button'); btn.id='rdCta'; btn.type='button';
  btn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span class="l">Хочу такое для своего зала</span><span class="s">Хочу для своего зала</span>';
  if(host===document.body)btn.style.position='fixed';
  host.appendChild(btn);

  var m=document.createElement('div'); m.id='rdM'; m.hidden=true; m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-labelledby','rdT');
  m.innerHTML='<div class="b"><div class="hd"><h2 id="rdT">3D-схема вашего зала</h2><button class="x" type="button" aria-label="Закрыть">×</button></div>'+
    '<div class="fm"><p>Соберём бесплатное превью вашего зала по плану и фото и покажем на встрече. Ответим в течение рабочего дня.</p>'+
    '<form novalidate>'+
    '<label>Имя<input type="text" name="name" autocomplete="name" required></label>'+
    '<label>Телефон<input type="tel" name="phone" autocomplete="tel" inputmode="tel" required></label>'+
    '<label>Площадка и город<input type="text" name="org" autocomplete="organization" required></label>'+
    '<label>Почта<input type="email" name="email" autocomplete="email" required></label>'+
    '<input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'+
    '<label class="ck"><input type="checkbox" name="consent"><span>Согласен на обработку персональных данных по <a href="/privacy.html" target="_blank" rel="noopener">политике</a></span></label>'+
    '<div class="er" role="alert"></div>'+
    '<button class="go" type="submit">Отправить заявку</button></form></div>'+
    '<div class="ok" hidden></div></div>';
  document.body.appendChild(m);
  var f=m.querySelector('form'), er=m.querySelector('.er'), ok=m.querySelector('.ok'), fm=m.querySelector('.fm'), go=m.querySelector('.go'), last=null;

  ['keydown','keyup','keypress','wheel','pointerdown','mousedown','touchstart','dblclick'].forEach(function(t){m.addEventListener(t,function(e){e.stopPropagation()})});
  function open(){last=document.activeElement;m.hidden=false;goal('demo_cta');setTimeout(function(){f.name.focus()},30)}
  function close(){m.hidden=true;if(last&&last.focus)last.focus()}
  btn.addEventListener('click',open);
  m.querySelector('.x').addEventListener('click',close);
  m.addEventListener('click',function(e){if(e.target===m)close()});
  m.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
  f.addEventListener('input',function(e){e.target.removeAttribute('aria-invalid');er.textContent=''});

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var v={name:f.name.value.trim(),phone:f.phone.value.trim(),org:f.org.value.trim(),email:f.email.value.trim(),size:'',msg:'Заявка из 3D-демо: '+demo,page:page,consent:true,website:f.website.value};
    var bad=null;
    function need(el,cond,msg){if(!cond){el.setAttribute('aria-invalid','true');if(!bad){bad=el;er.textContent=msg}}}
    need(f.name,v.name.length>1,'Напишите, как к вам обращаться');
    need(f.phone,v.phone.replace(/\D/g,'').length>=10,'Укажите телефон с кодом города');
    need(f.org,v.org.length>1,'Укажите площадку и город');
    need(f.email,/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email),'Укажите почту, например name@theatre.ru');
    if(!bad&&!f.consent.checked){bad=f.consent;er.textContent='Нужно согласие на обработку данных'}
    if(bad){bad.focus();return}
    function done(sent){
      fm.hidden=true; ok.hidden=false;
      ok.innerHTML=sent?'<b>Спасибо, '+esc(v.name)+'!</b><p>Заявка отправлена. Евгений Маслов свяжется с вами в течение рабочего дня.</p><button class="go" type="button">Вернуться к демо</button>'
        :'<b>Не получилось отправить</b><p>Напишите нам на <b>info@3dryad.ru</b> или позвоните: <b>+7 916 422-32-88</b>. Ответим в течение рабочего дня.</p><button class="go" type="button">Вернуться к демо</button>';
      ok.querySelector('.go').addEventListener('click',close); ok.querySelector('.go').focus();
    }
    if(!EP){done(false);goal('lead_fallback',{page:page});return}
    go.disabled=true; go.textContent='Отправляем…';
    var ctl=window.AbortController?new AbortController():null, t=setTimeout(function(){ctl&&ctl.abort()},8000);
    fetch(EP,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v),signal:ctl&&ctl.signal})
      .then(function(r){clearTimeout(t);if(!r.ok)throw 0;done(true);goal('lead_sent',{page:page})})
      .catch(function(){clearTimeout(t);done(false);goal('lead_fallback',{page:page})})
      .then(function(){go.disabled=false;go.textContent='Отправить заявку'});
  });
})();
