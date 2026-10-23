/* Форма заявки на страницах сегментов: проверка полей, отправка на сервер, затем выдача коммерческого предложения */
(function(){
  var KP='kp/ryadom-kp.pdf', EP=window.RYADOM_ENDPOINT||'';
  var f=document.getElementById('lead'), out=document.getElementById('sent'); if(!f)return;
  var $=function(id){return document.getElementById(id)};
  function check(id,ok,msg){var e=$(id),er=$('e'+id.slice(1));er.textContent=ok?'':msg;e.setAttribute('aria-invalid',ok?'false':'true');return ok}
  ['fName','fPhone','fOrg','fEmail'].forEach(function(id){$(id).addEventListener('input',function(){$('e'+id.slice(1)).textContent=''})});
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var v={name:f.name.value.trim(),phone:f.phone.value.trim(),org:f.org.value.trim(),email:f.email.value.trim(),size:'',msg:'',page:location.pathname.replace(/^.*\//,'').replace('.html','')||'index',website:f.website.value};
    var ok=check('fName',v.name.length>1,'Напишите, как к вам обращаться')&
           check('fPhone',v.phone.replace(/\D/g,'').length>=10,'Укажите телефон с кодом города')&
           check('fOrg',v.org.length>1,'Укажите площадку')&
           check('fEmail',/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email),'Укажите почту, например name@company.ru');
    if(!ok)return;
    var text='Заявка «РЯДом»\nИмя: '+v.name+'\nТелефон: '+v.phone+'\nПочта: '+v.email+'\nПлощадка: '+v.org+'\nСтраница: '+v.page;
    function show(sent){
      out.hidden=false;
      out.innerHTML='<div class="kp"><b>Спасибо, '+esc(v.name)+'!</b><p>'+(sent?'Заявка отправлена, ответим в течение рабочего дня.':'Коммерческое предложение для вашей площадки готово.')+' В нём тарифы, состав работ, сроки и реквизиты.</p>'+
        '<a class="btn btn-gold" href="'+KP+'" download target="_blank" rel="noopener">Скачать коммерческое предложение (PDF) <span class="arr">↓</span></a>'+
        (sent?'':'<a class="btn btn-ghost" href="mailto:artsevershop@gmail.com?subject='+encodeURIComponent('Заявка РЯДом: '+v.org)+'&body='+encodeURIComponent(text)+'">Отправить заявку письмом</a>')+'</div>';
      out.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
    if(!EP){show(false);return}
    var ctl=window.AbortController?new AbortController():null, t=setTimeout(function(){ctl&&ctl.abort()},8000);
    fetch(EP,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v),signal:ctl&&ctl.signal})
      .then(function(r){clearTimeout(t);if(!r.ok)throw 0;show(true);f.reset();window.ryadomGoal&&ryadomGoal('lead_sent',{page:v.page})})
      .catch(function(){clearTimeout(t);show(false);window.ryadomGoal&&ryadomGoal('lead_fallback',{page:v.page})});
  });
})();
