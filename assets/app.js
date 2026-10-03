(function(){
  var LS='pf_lang';
  var lang = localStorage.getItem(LS) || 'fa';
  if(!T[lang]) lang = 'fa';
  var $ = function(s,r){return (r||document).querySelector(s);};
  var el = function(t,c,h){var e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e;};
  var fmt = function(str){var a=arguments; return String(str).replace(/%(\d)/g,function(_,i){return a[+i];});};
  /* Persian digits for Persian view */
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
    var ph = el('div','ph','<img src="assets/img/me.jpg" alt="ایمان منصوری (Iman Mansouri)">');
    var box = el('div');
    box.appendChild(el('h1',null,t.hero.name));
    box.appendChild(el('div','role',t.hero.role));
    box.appendChild(el('p','tag',t.hero.tag));
    var meta = el('div','meta'); t.hero.chips.forEach(function(c){meta.appendChild(el('span','chip',c));});
    box.appendChild(meta);
    var cta = el('div','cta');
    cta.innerHTML = '<a class="btn primary" href="#resume">'+t.hero.cta1+'</a>'+
      '<a class="btn" href="#proj">'+t.hero.cta2+'</a>'+
      '<a class="btn" href="'+LINKS.telegram+'" target="_blank" rel="noopener">Telegram: @imanmansouri1 &#8599;</a>';
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

  /* ---------- 16-PROJECT SHOWCASE WITH CATEGORY FILTERS ---------- */
  var currentCat = 'all';
  function pageProj(t){
    var pr = t.proj, p = el('div');
    p.appendChild(el('h2','sec',pr.title+' <em>'+pr.sub+'</em>'));

    /* category filter bar */
    var frow = el('div','pfilters');
    var cats = [
      {k:'all',l:pr.filterAll},
      {k:'ai',l:pr.filterAI},
      {k:'multimodal',l:pr.filterMulti},
      {k:'enterprise',l:pr.filterEnt},
      {k:'systems',l:pr.filterSys},
      {k:'games',l:pr.filterGames}
    ];

    var listHost = el('div','plist');

    function renderList(){
      listHost.innerHTML = '';
      var filtered = pr.items.filter(function(it){
        return currentCat === 'all' || it.cat === currentCat;
      });

      filtered.forEach(function(it){
        var c = el('article','pcard');

        /* header */
        var hdr = el('div','pcard-hdr');
        var tbox = el('div');
        tbox.appendChild(el('div','pcard-title',it.name));
        tbox.appendChild(el('div','pcard-role',it.role));
        hdr.appendChild(tbox);

        if(it.badgeText){
          var bclass = it.badge || 'priv';
          hdr.appendChild(el('span','pbadge '+bclass, it.badgeText));
        }
        c.appendChild(hdr);

        /* desc */
        c.appendChild(el('p','lead',it.desc));

        /* architecture highlights */
        if(it.arch && it.arch.length){
          var abox = el('div','pcard-arch');
          abox.appendChild(el('b',null,lang==='fa'?'نکات کلیدی معماری و پیاده‌سازی:':'Key Architectural Highlights:'));
          var ul = el('ul');
          it.arch.forEach(function(a){ ul.appendChild(el('li',null,a)); });
          abox.appendChild(ul);
          c.appendChild(abox);
        }

        /* tech chips */
        if(it.tags && it.tags.length) c.appendChild(chips(it.tags));

        /* actions */
        var act = el('div','pcard-actions');
        if(it.link && LINKS[it.link]){
          var btnTxt = pr.btnLive;
          if(it.link === 'antigravity') btnTxt = pr.btnCode;
          else if(it.link === 'parsa') btnTxt = (lang==='fa' ? 'دانلود از کافه‌بازار (Cafe Bazaar)' : 'Download on Cafe Bazaar');
          var la = el('a','btn primary', btnTxt+' &#8599;');
          la.href = LINKS[it.link]; la.target='_blank'; la.rel='noopener';
          act.appendChild(la);
        }
        if(it.vsec){
          var va = videoLink(t, it.vsec);
          act.appendChild(va);
        }
        if(act.children.length) c.appendChild(act);

        /* gallery if present */
        if(it.images && it.images.length){
          c.appendChild(gallery(it.images, t.honors.caps, it.images.length>2?'g3':'g2'));
        }

        listHost.appendChild(c);
      });
      reveal();
    }

    cats.forEach(function(cat){
      var btn = el('button','pfilter-btn'+(cat.k===currentCat?' on':''), cat.l);
      btn.addEventListener('click',function(){
        currentCat = cat.k;
        frow.querySelectorAll('.pfilter-btn').forEach(function(b){ b.classList.remove('on'); });
        btn.classList.add('on');
        renderList();
      });
      frow.appendChild(btn);
    });

    p.appendChild(frow);
    p.appendChild(listHost);
    renderList();
    return p;
  }

  /* ---------- UNIVERSALSYSTEM AI FACTORY ---------- */
  function pageSys(t){
    var s = t.sys, p = el('div');
    p.appendChild(el('h2','sec',s.title+' <em>'+s.sub+'</em>'));
    p.appendChild(el('p','lead',s.intro));

    /* 6 KPIs */
    var k = el('div','kpis');
    s.kpis.forEach(function(x){ k.appendChild(el('div','kpi','<b>'+num(x[0])+'</b><span>'+x[1]+'</span>')); });
    p.appendChild(k);

    /* Real verification console screenshot */
    var f = el('figure','shot free');
    var im = el('img'); im.src='assets/img/dashboard.jpg'; im.alt=s.dashCap; im.loading='lazy';
    f.appendChild(im); f.appendChild(el('figcaption',null,s.dashCap));
    f.addEventListener('click',function(){openLB(['dashboard'],'dashboard',{dashboard:s.dashCap});});
    p.appendChild(f);

    /* 4 Microservice Clusters */
    if(s.clusters && s.clusters.length){
      p.appendChild(el('h3','sub',s.svcTitle+' &mdash; <span style="font-size:13px;font-weight:400;color:var(--tx3)">'+s.svcSub+'</span>'));
      s.clusters.forEach(function(cl){
        var cdiv = el('div','sys-cluster');
        var chdr = el('div','sys-cluster-hdr');
        chdr.appendChild(el('h4',null,cl.title));
        if(cl.sub) chdr.appendChild(el('span',null,cl.sub));
        cdiv.appendChild(chdr);

        var sgrid = el('div','sys-grid');
        cl.services.forEach(function(srv){
          var scard = el('div','sys-card');
          var stop = el('div','sys-card-top');
          stop.appendChild(el('span','sys-card-name',srv.name));
          if(srv.port) stop.appendChild(el('span','sys-card-port',srv.port));
          scard.appendChild(stop);
          if(srv.role) scard.appendChild(el('div','sys-card-role',srv.role));
          scard.appendChild(el('div','sys-card-desc',srv.desc));
          sgrid.appendChild(scard);
        });
        cdiv.appendChild(sgrid);
        p.appendChild(cdiv);
      });
    } else if(s.svc) {
      p.appendChild(el('h3','sub',s.svcTitle+' &mdash; <span style="font-size:13px;font-weight:400;color:var(--tx3)">'+s.svcSub+'</span>'));
      var g = el('div','svc');
      SVCKEYS.forEach(function(key){ if(s.svc[key]) g.appendChild(el('div',null,'<b>'+key+'</b>'+s.svc[key])); });
      p.appendChild(g);
    }

    /* Key Architectural Capabilities / Pillars */
    if(s.pillars && s.pillars.length){
      p.appendChild(el('h3','sub',s.capTitle));
      p.appendChild(mechList(s.pillars));
    } else if(s.caps && s.caps.length){
      p.appendChild(el('h3','sub',s.capTitle));
      p.appendChild(mechList(s.caps));
    }

    p.appendChild(el('div','note',s.why));
    return p;
  }

  /* ---------- MULTIMODAL HUB ---------- */
  function pageMultimodal(t){
    var m = t.multimodal, p = el('div');
    p.appendChild(el('h2','sec',m.title+' <em>'+m.sub+'</em>'));
    p.appendChild(el('p','lead',m.intro));

    /* KPIs */
    if(m.kpis && m.kpis.length){
      var mk = el('div','kpis');
      m.kpis.forEach(function(x){ mk.appendChild(el('div','kpi','<b>'+num(x[0])+'</b><span>'+x[1]+'</span>')); });
      p.appendChild(mk);
    }

    /* Multimodal Pipelines */
    if(m.pipelines && m.pipelines.length){
      m.pipelines.forEach(function(pipe){
        var c = el('div','pipe-card');
        var hdr = el('div','pipe-hdr');
        var tbox = el('div');
        tbox.appendChild(el('div','pipe-title',pipe.title));
        if(pipe.role) tbox.appendChild(el('div','pipe-role',pipe.role));
        hdr.appendChild(tbox);

        if(pipe.badges && pipe.badges.length){
          var bwrap = el('div','pipe-badges');
          pipe.badges.forEach(function(b){
            var bcls = 'pipe-badge' + (b.type ? ' '+b.type : '');
            bwrap.appendChild(el('span', bcls, b.text));
          });
          hdr.appendChild(bwrap);
        }
        c.appendChild(hdr);

        c.appendChild(el('p','lead',pipe.desc));

        /* Step-by-step Flow */
        if(pipe.steps && pipe.steps.length){
          var flow = el('div','pipe-flow');
          pipe.steps.forEach(function(st, idx){
            var sc = el('div','pipe-step');
            sc.appendChild(el('div','pipe-step-num', (lang==='fa'?'گام '+(idx+1):'Step '+(idx+1))));
            sc.appendChild(el('div','pipe-step-title', st.title));
            sc.appendChild(el('div','pipe-step-desc', st.desc));
            flow.appendChild(sc);
          });
          c.appendChild(flow);
        }

        /* Architecture highlights */
        if(pipe.arch && pipe.arch.length){
          var abox = el('div','pcard-arch');
          abox.appendChild(el('b',null,lang==='fa'?'نکات کلیدی معماری و زیرساخت:':'Architectural Highlights & Runtime Guarantees:'));
          var ul = el('ul');
          pipe.arch.forEach(function(a){ ul.appendChild(el('li',null,a)); });
          abox.appendChild(ul);
          c.appendChild(abox);
        }

        if(pipe.tags && pipe.tags.length) c.appendChild(chips(pipe.tags));

        /* Actions / Links */
        var act = el('div','pcard-actions');
        if(pipe.link && LINKS[pipe.link]){
          var la = el('a','btn primary', (lang==='fa'?'مشاهده پلتفرم زنده':'Open Live Platform')+' &#8599;');
          la.href = LINKS[pipe.link]; la.target='_blank'; la.rel='noopener';
          act.appendChild(la);
        }
        if(pipe.vsec){
          act.appendChild(videoLink(t, pipe.vsec));
        }
        if(act.children.length) c.appendChild(act);

        p.appendChild(c);
      });
    } else if(m.cards && m.cards.length){
      var grid = el('div','grid2'); grid.style.marginTop='20px';
      m.cards.forEach(function(c){
        var card = el('div','card');
        card.appendChild(el('h3',null,c.title)).style.cssText='font-size:17px;font-weight:800;color:var(--cy);margin-bottom:8px';
        card.appendChild(el('p','lead',c.desc));
        grid.appendChild(card);
      });
      p.appendChild(grid);
    }

    /* Comparison Table */
    if(m.table){
      p.appendChild(el('h3','sub',m.table.title));
      var tw = el('div','table-wrap');
      var tb = el('table','tech-table');
      var thead = el('thead');
      var trh = el('tr');
      m.table.headers.forEach(function(h){ trh.appendChild(el('th',null,h)); });
      thead.appendChild(trh);
      tb.appendChild(thead);

      var tbody = el('tbody');
      m.table.rows.forEach(function(row){
        var tr = el('tr');
        row.forEach(function(cell, ci){
          tr.appendChild(el('td',null, ci===0 ? '<b>'+cell+'</b>' : cell));
        });
        tbody.appendChild(tr);
      });
      tb.appendChild(tbody);
      tw.appendChild(tb);
      p.appendChild(tw);
    }

    return p;
  }

  /* ---------- 5-POINT EMPIRICAL VERIFICATION GATE ---------- */
  function pageGate(t){
    var g = t.gate, p = el('div');
    p.appendChild(el('h2','sec',g.title+' <em>'+g.sub+'</em>'));
    p.appendChild(el('p','lead',g.intro));

    var gw = el('div','gate-wrap');
    g.points.forEach(function(pt){
      var card = el('div','gate-card');
      card.innerHTML = '<h4><span class="gate-num">'+num(pt.num)+'</span> '+pt.t+'</h4><p>'+pt.d+'</p>';
      gw.appendChild(card);
    });
    p.appendChild(gw);
    return p;
  }

  /* ---------- NEON RUN ---------- */
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

  /* video link pointer */
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

  /* ---------- HONORS ---------- */
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

  /* ---------- RÉSUMÉ WITH 8 HIGH-RES PAGES ---------- */
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
    p.appendChild(el('p','lead',r.hint)).style.cssText='font-size:13.5px;margin-top:16px;font-weight:600';

    var name = (rdoc==='fa'?r.fa:r.en);
    var ids=[], caps={};
    for(var i=1;i<=8;i++){
      var src='assets/resume/'+rdoc+'-'+i+'.jpg';
      ids.push(src);
      caps[src]=name+' — '+num(i)+'/'+num(8);
    }
    p.appendChild(gallery(ids, caps, 'g3'));
    return p;
  }

  /* ---------- VIDEO ARCHIVE & DUAL PLAYER ---------- */
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
      if(!single) plabel.textContent = num((cur+1)+'/'+parts.length);
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

    var meta = el('div','vmeta');
    meta.innerHTML =
      '<span><b>'+t.videos.title+':</b> '+num(v.dur)+'</span>'+
      (v.bytes?'<span><b>حجم:</b> '+num(fmtMB(v.bytes))+'</span>':'');
    wrap.appendChild(meta);
    return wrap;
  }

  function pageVideos(t){
    var p = el('div');
    p.appendChild(el('h2','sec',t.videos.title+' <em>'+t.videos.sub+'</em>'));
    p.appendChild(el('p','lead',t.videos.intro));

    var jump = el('div','vjump');
    VD.forEach(function(s){
      var a = el('a',null,s.nav[lang] || s.title[lang]);
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

  /* ---------- tabs & router ---------- */
  var PAGES = {
    home: pageHome,
    proj: pageProj,
    sys: pageSys,
    multimodal: pageMultimodal,
    gate: pageGate,
    neon: pageNeon,
    honors: pageHonors,
    resume: pageResume,
    videos: pageVideos
  };
  var ICONS = {
    home: '◆',
    proj: '▤',
    sys: '⚙',
    multimodal: '⚡',
    gate: '🛡',
    neon: '▶',
    honors: '★',
    resume: '▣',
    videos: '▷'
  };
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
    document.title = (lang === 'fa' ? 'ایمان منصوری — معمار سیستم و مهندس هوش مصنوعی چندحالته' : 'Iman Mansouri — Architect & Multimodal AI Engineer');

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

    /* world-class footer with active social & platform links */
    $('#footer').innerHTML =
      '<div class="footer-socials">' +
        '<a class="fs-btn" href="'+LINKS.mail+'">✉ Email</a>' +
        '<a class="fs-btn" href="'+LINKS.telegram+'" target="_blank" rel="noopener">✈ Telegram (@imanmansouri1)</a>' +
        '<a class="fs-btn" href="'+LINKS.instagram+'" target="_blank" rel="noopener">📷 Instagram (@albert.net01)</a>' +
        '<a class="fs-btn" href="'+LINKS.github+'" target="_blank" rel="noopener">🐙 GitHub (albert392392)</a>' +
        '<a class="fs-btn" href="'+LINKS.antigravity+'" target="_blank" rel="noopener">⭐ antigravity-scroll-unpin</a>' +
      '</div>' +
      '<div>&copy; '+new Date().getFullYear()+' ایمان منصوری (Iman Mansouri) &middot; '+t.footer+'</div>';

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
    var els=document.querySelectorAll('.card,.pcard,.shot,.stat,.kpi,.quote,.note,.svc div,.vcard,.gate-card');
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
