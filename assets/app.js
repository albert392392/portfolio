(function(){
  var LS='pf_lang';
  var lang = localStorage.getItem(LS) || 'fa';
  if(!T[lang]) lang = 'fa';
  var $ = function(s,r){return (r||document).querySelector(s);};
  var el = function(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e;};
  var fmt = function(str){var a=arguments; return String(str).replace(/%(\d)/g,function(_,i){return a[+i];});};
  /* Persian digits, so numbers match the surrounding text */
  var num = function(v){ return lang==='fa'
    ? String(v).replace(/[0-9]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[+d];})
    : String(v); };

  /* ---------- gallery builder ---------- */
  function gallery(ids, caps, cls){
    var g = el('div','gal '+(cls||'g2'));
    ids.forEach(function(id){
      var extra='';
      if(id.indexOf('bus-')===0) extra=' tall';
      else if(id.indexOf('-profile')>0 || id==='note') extra=' free';
      else if(id.indexOf('root-')===0) extra=' p43';
      var f = el('figure','shot'+extra);
      var im = el('img'); im.src=(id.indexOf('/')>=0?id:'assets/img/'+id+'.jpg'); im.alt=(caps&&caps[id])||id; im.loading='lazy';
      f.appendChild(im);
      if(caps&&caps[id]) f.appendChild(el('figcaption',null,caps[id]));
      f.addEventListener('click',function(){openLB(ids,id,caps);});
      g.appendChild(f);
    });
    return g;
  }
  function mechList(items){
    var g = el('div','grid2');
    items.forEach(function(m){
      var c = el('div','card');
      c.appendChild(el('h4',null,'<span style="color:var(--cy)">&#9657;</span> '+m.t));
      c.appendChild(el('p',null,m.d));
      c.querySelector('h4').style.cssText='font-size:15px;font-weight:700;margin-bottom:5px';
      c.querySelector('p').style.cssText='color:var(--tx2);font-size:13.6px';
      g.appendChild(c);
    });
    return g;
  }
  function chips(arr){
    var d = el('div','tags'); arr.forEach(function(t){ d.appendChild(el('i',null,t)); }); return d;
  }

  /* ---------- pages ---------- */
  function pageHome(t){
    var p = el('div');
    var hero = el('section','hero');
    var ph = el('div','ph','<img src="assets/img/me.jpg" alt="Iman Mansouri">');
    var box = el('div');
    box.appendChild(el('h1',null,t.hero.name));
    box.appendChild(el('div','role',t.hero.role));
    box.appendChild(el('p','tag',t.hero.tag));
    var meta = el('div','meta'); t.hero.chips.forEach(function(c){meta.appendChild(el('span','chip',c));});
    box.appendChild(meta);
    var cta = el('div','cta');
    cta.innerHTML = '<a class="btn primary" href="#resume">'+t.hero.cta1+'</a>'+
      '<a class="btn" href="#videos">'+t.nav.videos+'</a>'+
      '<a class="btn" href="'+LINKS.mail+'">'+t.hero.cta3+'</a>';
    box.appendChild(cta);
    hero.appendChild(ph); hero.appendChild(box); p.appendChild(hero);

    var st = el('div','stats');
    t.stats.forEach(function(s){ st.appendChild(el('div','stat','<b>'+s[0]+'</b><span>'+s[1]+'</span>')); });
    p.appendChild(st);

    p.appendChild(el('h2','sec',t.about.title+' <em>'+t.about.sub+'</em>'));
    p.appendChild(el('p','lead',t.about.p1));
    p.appendChild(el('p','lead',t.about.p2));
    var cards = el('div','grid2'); cards.style.marginTop='16px';
    t.about.cards.forEach(function(c){
      var d = el('div','card','<h3 style="font-size:16px;font-weight:700;color:var(--cy);margin-bottom:6px">'+c.t+'</h3><p style="color:var(--tx2);font-size:14px">'+c.d+'</p>');
      cards.appendChild(d);
    });
    p.appendChild(cards);
    return p;
  }

  function pageNeon(t){
    var n = t.neon, p = el('div');
    p.appendChild(el('span','badge',n.badge));
    p.appendChild(el('h2','sec',n.title+' <em>'+n.sub+'</em>'));
    p.appendChild(el('p','lead',n.intro));
    p.appendChild(gallery(IMG.neon, n.caps, 'g2'));
    p.appendChild(videoLink(t,'neonrun'));
    p.appendChild(el('h3','sub',n.mechTitle+' &mdash; <span style="font-size:13px;font-weight:400;color:var(--tx3)">'+n.mechSub+'</span>'));
    p.appendChild(mechList(n.mech));
    var two = el('div','grid2'); two.style.marginTop='18px';
    var m1 = el('div','card','<h3 style="font-size:16px;font-weight:700;margin-bottom:6px">'+n.modesTitle+'</h3>');
    var ul = el('ul','list'); n.modes.forEach(function(x){ul.appendChild(el('li',null,x));}); m1.appendChild(ul);
    var m2 = el('div','card','<h3 style="font-size:16px;font-weight:700;margin-bottom:6px">'+n.platTitle+'</h3>');
    var ul2 = el('ul','list'); n.plat.forEach(function(x){ul2.appendChild(el('li',null,x));}); m2.appendChild(ul2);
    two.appendChild(m1); two.appendChild(m2); p.appendChild(two);
    p.appendChild(el('div','note',n.status));
    return p;
  }

  /* a single, reusable pointer into the video archive — no content is repeated */
  function videoLink(t, secId){
    var sec = null;
    VD.forEach(function(s){ if(s.id===secId) sec=s; });
    var n = sec ? sec.videos.length : 0;
    var d = el('div','vlink');
    d.innerHTML = '<span>&#9654;</span> '+t.videos.title+' &mdash; '+num(n)+'&nbsp;'+(lang==='fa'?'ویدیو':(lang==='de'?'Videos':'videos'));
    d.addEventListener('click',function(){ go('videos'); setTimeout(function(){
      var h=document.getElementById('vsec-'+secId); if(h) h.scrollIntoView({behavior:'smooth',block:'start'});
    },60); });
    return d;
  }

  function pageProj(t){
    var pr = t.proj, p = el('div');
    p.appendChild(el('h2','sec',pr.title+' <em>'+pr.sub+'</em>'));
    var VMAP = {lango:'nitrolango', archer:'commercial', bus:'commercial'};
    pr.items.forEach(function(it){
      var s = el('section','card'); s.style.marginBottom='22px';
      s.appendChild(el('h3',null,it.name));
      s.querySelector('h3').style.cssText='font-size:clamp(17px,2.4vw,22px);font-weight:800;margin-bottom:4px';
      s.appendChild(el('div',null,it.role)).style.cssText='color:var(--cy);font-size:12.8px;margin-bottom:10px';
      s.appendChild(el('p','lead',it.desc));
      if(it.tags) s.appendChild(chips(it.tags));
      if(it.link) {
        var a = el('a','btn primary',pr.linkLabel+' &#8599;'); a.href=LINKS[it.link]; a.target='_blank'; a.rel='noopener';
        a.style.marginTop='12px'; s.appendChild(a);
      }
      var ids = IMG[it.id];
      if(ids && ids.length) s.appendChild(gallery(ids, it.caps, (ids.length>2||it.id==='bus')?'g3':'g2'));
      if(VMAP[it.id]) s.appendChild(videoLink(t, VMAP[it.id]));
      s.appendChild(el('h4',null,'&#9881; '+ (t.neon.mechTitle))).style.cssText='font-size:15.5px;font-weight:700;margin:16px 0 8px';
      s.appendChild(mechList(it.mech));
      p.appendChild(s);
    });
    p.appendChild(el('div','note',pr.future));
    return p;
  }

  function pageSys(t){
    var s = t.sys, p = el('div');
    p.appendChild(el('h2','sec',s.title+' <em>'+s.sub+'</em>'));
    p.appendChild(el('p','lead',s.intro));
    var k = el('div','kpis');
    s.kpis.forEach(function(x){ k.appendChild(el('div','kpi','<b>'+x[0]+'</b><span>'+x[1]+'</span>')); });
    p.appendChild(k);
    var f = el('figure','shot free');
    var im = el('img'); im.src='assets/img/dashboard.jpg'; im.alt=s.dashCap; im.loading='lazy';
    f.appendChild(im); f.appendChild(el('figcaption',null,s.dashCap));
    f.addEventListener('click',function(){openLB(['dashboard'],'dashboard',{dashboard:s.dashCap});});
    p.appendChild(f);
    p.appendChild(el('h3','sub',s.svcTitle+' &mdash; <span style="font-size:13px;font-weight:400;color:var(--tx3)">'+s.svcSub+'</span>'));
    var g = el('div','svc');
    SVCKEYS.forEach(function(key){ g.appendChild(el('div',null,'<b>'+key+'</b>'+s.svc[key])); });
    p.appendChild(g);
    p.appendChild(el('h3','sub',s.capTitle));
    p.appendChild(mechList(s.caps));
    p.appendChild(el('div','note',s.why));
    return p;
  }

  function pageHonors(t){
    var h = t.honors, p = el('div');
    p.appendChild(el('h2','sec',h.title+' <em>'+h.sub+'</em>'));

    var c1 = el('div','card');
    c1.appendChild(el('span','badge o','Negative Five'));
    c1.appendChild(el('h3',null,h.n5t)).style.cssText='font-size:18px;font-weight:800;margin:4px 0 6px';
    c1.appendChild(el('p','lead',h.n5));
    p.appendChild(c1);
    p.appendChild(gallery(IMG.event, h.caps, 'g3'));
    p.appendChild(videoLink(t,'event'));

    p.appendChild(el('h3','sub',h.socialT));
    p.appendChild(el('div','quote', h.quote + '<small>'+h.quoteWho+'</small>'));
    var g3 = el('div','grid3'); g3.style.marginTop='14px';
    h.social.forEach(function(s){
      var d = el('div','card','<h4 style="font-size:15.5px;font-weight:700;margin-bottom:5px">'+s.t+'</h4><p style="color:var(--tx2);font-size:13.6px">'+s.d+'</p>');
      var a = el('a','btn','Instagram &#8599;'); a.href=LINKS[s.link]; a.target='_blank'; a.rel='noopener';
      a.style.cssText='margin-top:10px;font-size:12.5px;padding:8px 14px'; d.appendChild(a); g3.appendChild(d);
    });
    p.appendChild(g3);
    p.appendChild(gallery(IMG.social, h.caps, 'g3'));

    var c2 = el('div','card'); c2.style.marginTop='20px';
    c2.appendChild(el('span','badge g','Game Dojo'));
    c2.appendChild(el('h3',null,h.dojoT)).style.cssText='font-size:18px;font-weight:800;margin:4px 0 6px';
    c2.appendChild(el('p','lead',h.dojo));
    var a2 = el('a','btn','gamedojo.ir &#8599;'); a2.href=LINKS.dojo; a2.target='_blank'; a2.rel='noopener'; a2.style.marginTop='10px';
    c2.appendChild(a2);
    p.appendChild(c2);
    p.appendChild(gallery(IMG.dojo, h.caps, 'g3'));

    p.appendChild(el('h3','sub',h.kidT));
    p.appendChild(el('p','lead',h.kid));
    p.appendChild(gallery(IMG.kid, h.caps, 'g3'));
    return p;
  }

  /* ---------- résumé: one place only ---------- */
  var rdoc='fa';
  function pageResume(t){
    var r = t.resume, p = el('div');
    p.appendChild(el('h2','sec',r.title+' <em>'+r.sub+'</em>'));
    p.appendChild(el('p','lead',r.intro));

    var tabs = el('div','rtabs');
    [['fa',r.fa],['en',r.en]].forEach(function(x){
      var b=el('button',(x[0]===rdoc?'on':''),x[1]);
      b.addEventListener('click',function(){ rdoc=x[0]; render(); });
      tabs.appendChild(b);
    });
    p.appendChild(tabs);

    var file='assets/resume-'+rdoc+'.pdf';
    var row = el('div','cta'); row.style.marginTop='0';
    row.innerHTML = '<a class="btn primary" href="'+file+'" target="_blank" rel="noopener">'+r.open+' &#8599;</a>'+
                    '<a class="btn" href="'+file+'" download>'+r.dl+' &#8595;</a>';
    p.appendChild(row);

    var viewer = el('div','viewer');
    viewer.innerHTML = '<iframe title="resume" src="'+file+'#view=FitH"></iframe>';
    p.appendChild(viewer);
    p.appendChild(el('p','lead',r.hint)).style.cssText='font-size:13px;margin-top:10px';

    var name = (rdoc==='fa'?r.fa:r.en);
    var ids=[], caps={};
    for(var i=1;i<=8;i++){ var src='assets/resume/'+rdoc+'-'+i+'.jpg'; ids.push(src); caps[src]=name+' — '+i+'/8'; }
    p.appendChild(gallery(ids, caps, 'g3'));
    return p;
  }

  /* ---------- video archive ---------- */
  function fmtTime(sec){
    sec = Math.max(0, Math.floor(sec||0));
    var m = Math.floor(sec/60), s = sec%60;
    return m+':'+(s<10?'0':'')+s;
  }
  function fmtMB(b){ return (b/1048576).toFixed(0)+' MB'; }

  function buildPlayer(t, v){
    var wrap = el('div','vplayer');
    var stage = el('div','vstage');
    var a = document.createElement('video'), b = document.createElement('video');
    [a,b].forEach(function(x){
      x.playsInline=true; x.setAttribute('playsinline',''); x.preload='metadata';
      x.controls=false; x.className='vel';
    });
    a.poster = v.poster;
    stage.appendChild(a); stage.appendChild(b);
    var spin = el('div','vspin', t.videos.loading);
    stage.appendChild(spin);
    wrap.appendChild(stage);

    var single = !v.parts;
    var parts = single ? [{u:v.src, d:0}] : v.parts;
    var total = single ? 0 : v.total;
    var offs = [0];
    parts.forEach(function(p,i){ offs.push(offs[i]+p.d); });

    var cur = 0, active = a, spare = b, busy = false;

    function show(x){ a.classList.toggle('on', x===a); b.classList.toggle('on', x===b); }
    function setSpin(on){ spin.style.display = on ? 'flex' : 'none'; }

    function loadPart(i, time, autoplay){
      if(i<0||i>=parts.length) return;
      busy = true; setSpin(true);
      cur = i;
      active.src = parts[i].u;
      active.load();
      var go = function(){
        active.removeEventListener('loadedmetadata',go);
        if(time) try{ active.currentTime = time; }catch(e){}
        setSpin(false); busy=false;
        if(autoplay) active.play().catch(function(){});
        prefetchNext();
      };
      active.addEventListener('loadedmetadata',go);
    }
    function prefetchNext(){
      if(single || cur+1>=parts.length) return;
      if(spare.src !== parts[cur+1].u){ spare.preload='auto'; spare.src = parts[cur+1].u; spare.load(); }
    }
    function swapToNext(){
      if(cur+1>=parts.length){ setSpin(false); return; }
      var tmp = active; active = spare; spare = tmp;
      cur++;
      show(active);
      active.currentTime = 0;
      active.play().catch(function(){});
      spare.removeAttribute('src'); spare.load();
      prefetchNext();
      update();
    }

    /* controls */
    var bar = el('div','vbar');
    var btn = el('button','vplay','&#9654;');
    var track = el('div','vtrack','<i></i>');
    var fill = track.querySelector('i');
    var tlabel = el('span','vtime','0:00');
    var plabel = el('span','vpart','');
    var full = el('button','vfull','&#9974;');
    bar.appendChild(btn); bar.appendChild(track); bar.appendChild(tlabel);
    if(!single) bar.appendChild(plabel);
    bar.appendChild(full);
    wrap.appendChild(bar);

    function dur(){ return single ? (active.duration||0) : total; }
    function pos(){ return (single?0:offs[cur]) + (active.currentTime||0); }
    function update(){
      var d = dur()||1;
      fill.style.width = Math.min(100,(pos()/d)*100)+'%';
      tlabel.textContent = num(fmtTime(pos())+' / '+fmtTime(d));
      if(!single) plabel.textContent = num(fmt(t.videos.partOf, cur+1, parts.length));
      btn.innerHTML = active.paused ? '&#9654;' : '&#10074;&#10074;';
    }
    [a,b].forEach(function(x){
      x.addEventListener('timeupdate',update);
      x.addEventListener('play',update);
      x.addEventListener('pause',update);
      x.addEventListener('waiting',function(){ if(x===active) setSpin(true); });
      x.addEventListener('playing',function(){ if(x===active) setSpin(false); });
      x.addEventListener('ended',function(){ if(x===active && !single) swapToNext(); else if(x===active) update(); });
    });
    btn.addEventListener('click',function(){
      if(!active.src){ loadPart(0,0,true); return; }
      if(active.paused) active.play().catch(function(){}); else active.pause();
    });
    full.addEventListener('click',function(){
      var e = stage;
      if(document.fullscreenElement) document.exitFullscreen();
      else if(e.requestFullscreen) e.requestFullscreen();
      else if(active.webkitEnterFullscreen) active.webkitEnterFullscreen();
    });
    track.addEventListener('click',function(ev){
      var r = track.getBoundingClientRect();
      var x = (ev.clientX - r.left)/r.width;
      if(document.documentElement.dir==='rtl') x = 1-x;
      x = Math.max(0,Math.min(1,x));
      var target = x*(dur()||0);
      if(single){ if(active.src) active.currentTime=target; else loadPart(0,target,true); return; }
      var i=0; while(i<parts.length-1 && target>=offs[i+1]) i++;
      if(i===cur && active.src){ active.currentTime = target-offs[i]; }
      else { spare.removeAttribute('src'); loadPart(i, target-offs[i], true); show(active); }
    });
    stage.addEventListener('click',function(ev){ if(ev.target===spin) return; btn.click(); });

    show(a); setSpin(false);
    if(single){ a.src = v.src; a.preload='metadata'; }
    else { a.addEventListener('loadedmetadata',function(){},{once:true}); }
    update();

    /* meta row */
    var meta = el('div','vmeta');
    var q = single ? t.videos.origQ : num(fmt(t.videos.splitQ, parts.length));
    meta.innerHTML =
      '<span><b>'+t.videos.total+':</b> '+num(v.dur)+'</span>'+
      (v.bytes?'<span><b>'+t.videos.size+':</b> '+num(fmtMB(v.bytes))+'</span>':'')+
      '<span><b>'+t.videos.quality+':</b> '+q+'</span>';
    wrap.appendChild(meta);
    if(!single) wrap.appendChild(el('div','vnote', t.videos.partsNote));
    return wrap;
  }

  function pageVideos(t){
    var p = el('div');
    p.appendChild(el('h2','sec',t.videos.title+' <em>'+t.videos.sub+'</em>'));
    p.appendChild(el('p','lead',t.videos.intro));
    p.appendChild(el('div','note',t.videos.origNote));

    var jump = el('div','vjump');
    VD.forEach(function(s){
      var a = el('a',null,s.nav[lang]);
      a.href='#videos';
      a.addEventListener('click',function(ev){ ev.preventDefault();
        document.getElementById('vsec-'+s.id).scrollIntoView({behavior:'smooth',block:'start'}); });
      jump.appendChild(a);
    });
    p.appendChild(jump);

    VD.forEach(function(s){
      var sec = el('section','vsec'); sec.id = 'vsec-'+s.id;
      sec.appendChild(el('div','skick',s.kicker[lang]));
      sec.appendChild(el('h3','sub',s.title[lang])).style.marginTop='2px';
      sec.appendChild(el('p','lead',s.intro[lang]));
      s.videos.forEach(function(v){
        var c = el('article','vcard');
        c.appendChild(el('h4',null,v.title[lang]));
        c.appendChild(buildPlayer(t,v));
        c.appendChild(el('p','vdesc',v.desc[lang]));
        c.appendChild(chips(v.tags[lang]));
        sec.appendChild(c);
      });
      p.appendChild(sec);
    });
    return p;
  }

  function pageContact(t){
    var c = t.contact, p = el('div');
    p.appendChild(el('h2','sec',c.title+' <em>'+c.sub+'</em>'));
    p.appendChild(el('p','lead',c.text));
    var g = el('div','grid2'); g.style.marginTop='16px';
    g.innerHTML =
      '<a class="card" style="text-decoration:none;display:block" href="'+LINKS.mail+'"><div style="color:var(--tx3);font-size:12px">'+c.email+'</div><div class="en" style="font-size:clamp(15px,2.4vw,20px);font-weight:700;color:var(--tx)">iman392392@gmail.com</div></a>'+
      '<a class="card" style="text-decoration:none;display:block" href="'+LINKS.tel+'"><div style="color:var(--tx3);font-size:12px">'+c.phone+'</div><div class="en" style="font-size:clamp(15px,2.4vw,20px);font-weight:700;color:var(--tx)">+98 933 165 5416</div></a>'+
      '<div class="card"><div style="color:var(--tx3);font-size:12px">'+c.loc+'</div><div style="font-size:clamp(15px,2.4vw,20px);font-weight:700">'+c.locv+'</div></div>'+
      '<a class="card" style="text-decoration:none;display:block" href="'+LINKS.lango+'" target="_blank" rel="noopener"><div style="color:var(--tx3);font-size:12px">'+c.prod+'</div><div class="en" style="font-size:clamp(14px,2.2vw,18px);font-weight:700;color:var(--cy)">nitrolango-client.vercel.app &#8599;</div></a>';
    p.appendChild(g);
    return p;
  }

  /* ---------- lightbox ---------- */
  var lbIds=[], lbIdx=0, lbCaps={};
  function openLB(ids,id,caps){
    lbIds=ids; lbIdx=ids.indexOf(id); lbCaps=caps||{};
    renderLB(); $('#lb').classList.add('on'); document.body.style.overflow='hidden';
  }
  function lbPath(id){ return id.indexOf('/')>=0 ? id : 'assets/img/'+id+'.jpg'; }
  function renderLB(){
    var id=lbIds[lbIdx];
    $('#lb img').src=lbPath(id);
    $('#lb .cap').textContent=lbCaps[id]||'';
    $('#lb .prev').style.display = lbIds.length>1?'block':'none';
    $('#lb .next').style.display = lbIds.length>1?'block':'none';
  }
  function closeLB(){ $('#lb').classList.remove('on'); document.body.style.overflow=''; }
  function stepLB(d){ lbIdx=(lbIdx+d+lbIds.length)%lbIds.length; renderLB(); }

  /* ---------- tabs ---------- */
  var PAGES = {home:pageHome,neon:pageNeon,proj:pageProj,videos:pageVideos,sys:pageSys,honors:pageHonors,resume:pageResume,contact:pageContact};
  var ICONS = {home:'◆',neon:'▶',proj:'▤',videos:'▷',sys:'⚙',honors:'★',resume:'▣',contact:'✉'};
  var current='home';

  function stopAllVideos(){
    Array.prototype.forEach.call(document.querySelectorAll('video'),function(v){
      try{ v.pause(); v.removeAttribute('src'); v.load(); }catch(e){}
    });
  }

  function render(){
    var t=T[lang];
    document.documentElement.lang=lang;
    document.documentElement.dir=t.dir;
    document.title = (lang==='fa'?'ایمان منصوری — سازنده بازی و نرم‌افزار':'Iman Mansouri — Game & Software Developer');
    var row=$('#tabrow'); row.innerHTML='';
    Object.keys(PAGES).forEach(function(k){
      var b=el('button',(k===current?'on':''),'<i>'+ICONS[k]+'</i>'+t.nav[k]);
      b.setAttribute('data-k',k);
      b.addEventListener('click',function(){ go(k); });
      row.appendChild(b);
    });
    var host=$('#pages');
    stopAllVideos();
    host.innerHTML='';
    var pg=el('div','page on'); pg.appendChild(PAGES[current](t)); host.appendChild(pg);
    $('#footer').innerHTML = '&copy; '+new Date().getFullYear()+' Iman Mansouri &middot; <a href="'+LINKS.mail+'">iman392392@gmail.com</a> &middot; <span class="en">+98 933 165 5416</span><br>'+t.footer+
      ' &middot; <a href="https://github.com/albert392392/portfolio" target="_blank" rel="noopener">source</a>';
    Array.prototype.forEach.call(document.querySelectorAll('.langs button'),function(b){
      b.classList.toggle('on', b.getAttribute('data-l')===lang);
    });
    reveal();
  }
  function go(k){
    if(!PAGES[k]) k='home';
    var changed = (current!==k);
    current=k;
    if(location.hash.slice(1)!==k) history.replaceState(null,'','#'+k);
    render();
    if(changed) window.scrollTo({top:0,behavior:'auto'});
  }
  function setLang(l){ if(!T[l])return; lang=l; localStorage.setItem(LS,l); render(); }

  function reveal(){
    var els=document.querySelectorAll('.card,.shot,.stat,.kpi,.quote,.note,.svc div,.vcard');
    if(!('IntersectionObserver'in window)){return;}
    var io=new IntersectionObserver(function(en){
      en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{rootMargin:'300px 0px 300px 0px'});
    Array.prototype.forEach.call(els,function(e,i){ e.classList.add('reveal'); e.style.transitionDelay=Math.min(i%8*40,320)+'ms'; io.observe(e); });
    setTimeout(function(){ Array.prototype.forEach.call(els,function(e){ e.classList.add('in'); }); },900);
  }

  document.addEventListener('DOMContentLoaded',function(){
    Array.prototype.forEach.call(document.querySelectorAll('.langs button'),function(b){
      b.addEventListener('click',function(){ setLang(b.getAttribute('data-l')); });
    });
    $('#lb .x').addEventListener('click',closeLB);
    $('#lb .prev').addEventListener('click',function(){stepLB(-1);});
    $('#lb .next').addEventListener('click',function(){stepLB(1);});
    $('#lb').addEventListener('click',function(e){ if(e.target.id==='lb') closeLB(); });
    document.addEventListener('keydown',function(e){
      if(!$('#lb').classList.contains('on'))return;
      if(e.key==='Escape')closeLB(); if(e.key==='ArrowRight')stepLB(1); if(e.key==='ArrowLeft')stepLB(-1);
    });
    window.addEventListener('hashchange',function(){ go(location.hash.slice(1)||'home'); });
    go(location.hash.slice(1)||'home');
  });
})();
