document.addEventListener('DOMContentLoaded', ()=>{
  const openCardBtn = document.getElementById('openCardBtn');
  const showMessageBtn = document.getElementById('showMessageBtn');
  const message = document.getElementById('message');
  const closeMessageBtn = document.getElementById('closeMessageBtn');
  const celebrateBtn = document.getElementById('celebrateBtn');
  const confettiCanvas = document.getElementById('confetti');
  const music = document.getElementById('music');
  const musicToggle = document.getElementById('musicToggle');
  const openGalleryBtn = document.getElementById('openGalleryBtn');
  const gallery = document.getElementById('gallery');
  const closeGalleryBtn = document.getElementById('closeGalleryBtn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const toggleVfxBtn = document.getElementById('toggleVfxBtn');
  const vfxCard = document.getElementById('vfxCard');
  const surpriseBtn = document.getElementById('surpriseBtn');
  const voiceToggle = document.getElementById('voiceToggle');
  const vfxCanvas = document.getElementById('vfxCanvas');

  // --- Background Falling Hearts System ---
  const bgHeartsCanvas = document.getElementById('bgHeartsCanvas');
  let bgHeartCtx, bgHeartW, bgHeartH, bgHearts = [], bgHeartRAF;
  
  function initBgHearts(){
    if(!bgHeartsCanvas) return;
    bgHeartCtx = bgHeartsCanvas.getContext('2d');
    resizeBgHearts();
    startBgHearts();
  }

  function resizeBgHearts(){
    if(!bgHeartsCanvas) return;
    bgHeartsCanvas.width = innerWidth;
    bgHeartsCanvas.height = innerHeight;
    bgHeartW = bgHeartsCanvas.width;
    bgHeartH = bgHeartsCanvas.height;
  }

  function createBgHeart(){
    const size = 8 + Math.random() * 24;
    bgHearts.push({
      x: Math.random() * bgHeartW,
      y: -size,
      vx: (Math.random() - 0.5) * 0.8,
      vy: 1.2 + Math.random() * 1.8,
      size: size,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.08,
      opacity: 0.3 + Math.random() * 0.5,
      hue: 330 + Math.random() * 40
    });
  }

  function drawHeart(ctx, x, y, size, rotation, hue, opacity){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = `hsla(${hue}, 90%, 65%, ${opacity})`;
    ctx.strokeStyle = `hsla(${hue}, 80%, 55%, ${opacity * 0.7})`;
    ctx.lineWidth = 0.5;
    
    // Heart shape using bezier curves
    const s = size;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.3);
    ctx.bezierCurveTo(-s * 0.6, -s * 0.8, -s, -s * 0.5, -s, 0);
    ctx.bezierCurveTo(-s, s * 0.5, -s * 0.3, s, 0, s * 1.2);
    ctx.bezierCurveTo(s * 0.3, s, s, s * 0.5, s, 0);
    ctx.bezierCurveTo(s, -s * 0.5, s * 0.6, -s * 0.8, 0, -s * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
  }

  function bgHeartLoop(){
    if(!bgHeartCtx) return;
    bgHeartCtx.clearRect(0, 0, bgHeartW, bgHeartH);
    
    for(let i = bgHearts.length - 1; i >= 0; i--){
      const h = bgHearts[i];
      h.x += h.vx;
      h.y += h.vy;
      h.rotation += h.rotationSpeed;
      
      drawHeart(bgHeartCtx, h.x, h.y, h.size, h.rotation, h.hue, h.opacity);
      
      if(h.y > bgHeartH + h.size) bgHearts.splice(i, 1);
    }
    
    // Spawn new hearts continuously
    if(bgHearts.length < 80 && Math.random() < 0.5) createBgHeart();
    
    bgHeartRAF = requestAnimationFrame(bgHeartLoop);
  }

  function startBgHearts(){ bgHeartLoop(); }
  
  function stopBgHearts(){ 
    if(bgHeartRAF) cancelAnimationFrame(bgHeartRAF); 
    if(bgHeartCtx) bgHeartCtx.clearRect(0, 0, bgHeartW, bgHeartH);
  }

  window.addEventListener('resize', ()=>{ resizeBgHearts(); });

  // Initialize background hearts on page load
  initBgHearts();


  // show/hide message
  openCardBtn?.addEventListener('click', ()=>{ message.classList.remove('hidden'); scrollTo(message); runTypewriter(); });
  showMessageBtn?.addEventListener('click', ()=>{ message.classList.toggle('hidden'); if(!message.classList.contains('hidden')) runTypewriter(); });
  closeMessageBtn?.addEventListener('click', ()=>{ message.classList.add('hidden'); });

  // gallery
  openGalleryBtn?.addEventListener('click', ()=>{ gallery.classList.remove('hidden'); scrollTo(gallery); });
  closeGalleryBtn?.addEventListener('click', ()=>{ gallery.classList.add('hidden'); });

  document.querySelectorAll('.thumb').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const src = btn.getAttribute('data-src');
      const main = document.querySelector('.main-photo');
      if(main && src) main.src = src;
    });
  });

  // gallery lightbox
  document.querySelectorAll('.gallery-grid img').forEach(img=>{
    img.addEventListener('click', ()=>{
      lightboxImg.src = img.src;
      lightbox.classList.remove('hidden');
    });
  });
  lightboxClose?.addEventListener('click', ()=>{ lightbox.classList.add('hidden'); });

  // music toggle
  musicToggle?.addEventListener('click', ()=>{
    if(!music) return alert('Music not available.');
    if(music.paused){ 
      music.play().catch(()=>{}); 
      musicToggle.textContent='Pause Music'; 
      musicToggle.setAttribute('aria-pressed','true'); 
    }
    else { 
      music.pause(); 
      musicToggle.textContent='Play Music'; 
      musicToggle.setAttribute('aria-pressed','false'); 
    }
  });

  // Try to autoplay music on page load (browsers may require gesture)
  if(music){
    music.play().catch(()=>{ 
      // Autoplay blocked, wait for user gesture
      setTimeout(()=>{ music.play().catch(()=>{}); }, 2000);
    });
    musicToggle.textContent = 'Pause Music';
    musicToggle.setAttribute('aria-pressed','true');
  }

  // celebrate -> confetti + play music
  celebrateBtn?.addEventListener('click', ()=>{ launchConfetti(); if(music) music.play().catch(()=>{}); });

  // VFX toggle
  toggleVfxBtn?.addEventListener('click', ()=>{
    if(!vfxCard) return;
    const on = vfxCard.classList.toggle('vfx-on');
    toggleVfxBtn.textContent = on ? 'VFX Off' : 'VFX On';
    toggleVfxBtn.setAttribute('aria-pressed', String(on));
    if(on) startVfx(); else stopVfx();
  });

  // Surprise: hearts + confetti + music
  surpriseBtn?.addEventListener('click', ()=>{
    spawnHearts(18); launchConfettiBig(); if(music) music.play().catch(()=>{});
  });

  // Gift Box Opening Animation
  const giftBox = document.getElementById('giftBox');
  const pendantReveal = document.getElementById('pendantReveal');
  giftBox?.addEventListener('click', ()=>{
    if(giftBox.classList.contains('open')) return;
    giftBox.classList.add('open');
    setTimeout(()=>{ pendantReveal.classList.add('show'); spawnHearts(12); launchConfetti(); }, 500);
  });


  // counters
  document.querySelectorAll('.num').forEach(el=>{
    const target = +el.getAttribute('data-count') || 0;
    let i=0; const step = Math.max(1,Math.floor(target/60));
    const t = setInterval(()=>{ i+=step; if(i>=target){ el.textContent = String(target); clearInterval(t);} else el.textContent = String(i); },20);
  });

  // small helpers
  function scrollTo(node){ node.scrollIntoView({behavior:'smooth',block:'center'}); }

  // typewriter for apology
  function runTypewriter(){
    const ap = document.querySelector('.apology');
    if(!ap) return;
    const txt = "Sorry I'm late, Vedika — please forgive me 💜";
    ap.textContent = '';
    let k=0;
    const ti = setInterval(()=>{ ap.textContent += txt[k++]||''; if(k>=txt.length) clearInterval(ti); },45);
  }

  // simple confetti
  function launchConfetti(){
    const ctx = confettiCanvas.getContext('2d');
    confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight; ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    const pieces = [];
    for(let i=0;i<120;i++){ pieces.push({x:Math.random()*confettiCanvas.width,y:Math.random()*-confettiCanvas.height*2,vy:2+Math.random()*6,rz:Math.random()*360,size:6+Math.random()*8,color:`hsl(${Math.random()*60+330},70%,60%)`}); }
    let ticks=0;
    const anim = setInterval(()=>{
      ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
      pieces.forEach(p=>{ p.y += p.vy; p.vy += 0.05; p.x += Math.sin(p.y/10); ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size*0.6); });
      ticks++; if(ticks>160){ clearInterval(anim); ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height); }
    },16);
  }

  function launchConfettiBig(){
    launchConfetti(); setTimeout(launchConfetti, 220);
  }

  function spawnHearts(n=8){
    for(let i=0;i<n;i++){
      const span = document.createElement('div'); span.className='heart-fly'; span.textContent='❤';
      span.style.left = (8 + Math.random()*84) + '%'; span.style.fontSize = (12+Math.random()*26)+'px'; span.style.color = `hsl(${330+Math.random()*40},80%,60%)`;
      document.body.appendChild(span);
      setTimeout(()=>{ span.remove(); },2600);
    }
  }

  // parallax for DALL image
  const dall = document.getElementById('dallImg');
  if(dall){
    window.addEventListener('mousemove', (e)=>{
      const cx = innerWidth/2; const cy = innerHeight/2;
      const dx = (e.clientX - cx)/cx; const dy = (e.clientY - cy)/cy;
      dall.style.transform = `translate3d(${dx*6}px,${dy*6}px,0) scale(1.01)`;
    });
  }

  // --- Text-to-Speech (TTS) / Voice ---
  let ttsEnabled = false;
  function speakText(text, opts={rate:1, pitch:1, lang:'en-US'}){
    return new Promise((resolve)=>{
      if(!('speechSynthesis' in window)) return resolve(false);
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = opts.lang; utter.rate = opts.rate; utter.pitch = opts.pitch;
      const voices = speechSynthesis.getVoices();
      if(voices && voices.length) utter.voice = voices.find(v=>/en-US|en_GB|female/i.test(v.lang)) || voices[0];
      utter.onend = ()=>{ resolve(true); };
      utter.onerror = ()=>{ resolve(false); };
      speechSynthesis.speak(utter);
    });
  }

  voiceToggle?.addEventListener('click', async ()=>{
    // user gesture to enable TTS; test speak
    const ok = await speakText('Voice enabled. This page will speak the intro.');
    ttsEnabled = !!ok;
    voiceToggle.textContent = ttsEnabled ? 'Voice Enabled' : 'Enable Voice';
    voiceToggle.setAttribute('aria-pressed', String(ttsEnabled));
    if(!ok) alert('Voice not available — please allow audio or try a different browser.');
  });

  // --- Full-screen VFX particle system ---
  let vfxCtx, vfxW, vfxH, vfxParticles=[], vfxRAF;
  function resizeVfx(){ if(!vfxCanvas) return; vfxCanvas.width = innerWidth; vfxCanvas.height = innerHeight; vfxW=vfxCanvas.width; vfxH=vfxCanvas.height; if(vfxCtx) vfxCtx.fillStyle='transparent'; }
  function startVfx(){ if(!vfxCanvas) return; vfxCtx = vfxCanvas.getContext('2d'); resizeVfx(); vfxParticles = []; for(let i=0;i<140;i++) createVfxParticle(true); if(!vfxRAF) vfxLoop(); }
  function stopVfx(){ if(vfxRAF) cancelAnimationFrame(vfxRAF); vfxRAF = null; if(vfxCtx) vfxCtx.clearRect(0,0,vfxCanvas.width,vfxCanvas.height); }
  function createVfxParticle(initial=false){ vfxParticles.push({x: Math.random()*vfxW, y: initial? Math.random()*vfxH : vfxH+20, vx:(Math.random()-0.5)*1.6, vy: -1 - Math.random()*3, size:2+Math.random()*6, hue: 320 + Math.random()*80, life: 0}); }
  function vfxLoop(){ if(!vfxCtx) return; vfxCtx.clearRect(0,0,vfxW,vfxH); for(let i=vfxParticles.length-1;i>=0;i--){ const p=vfxParticles[i]; p.x += p.vx; p.y += p.vy; p.life++; const alpha = Math.max(0,1 - p.life/220); vfxCtx.fillStyle = `hsla(${p.hue},80%,60%,${alpha})`; vfxCtx.beginPath(); vfxCtx.arc(p.x,p.y,p.size,0,Math.PI*2); vfxCtx.fill(); if(p.y < -40 || p.x < -80 || p.x>vfxW+80) vfxParticles.splice(i,1); }
    // spawn a few
    if(vfxParticles.length < 160 && Math.random() < 0.6) createVfxParticle(false);
    vfxRAF = requestAnimationFrame(vfxLoop);
  }
  window.addEventListener('resize', ()=>{ resizeVfx(); });

  // ensure VFX runs during intro automatically
  async function runIntroVfx(){ startVfx(); // small burst
    spawnHearts(10); launchConfettiBig(); await sleep(2400); stopVfx(); }

  // Intro sequence on first open: apology -> love sign -> happy birthday
  const introOverlay = document.getElementById('introOverlay');
  const introApology = document.getElementById('introApology');
  const skipIntro = document.getElementById('skipIntro');

  function sleep(ms){ return new Promise(res=>setTimeout(res, ms)); }

  async function runIntroSequence(){
    if(!introOverlay || !introApology) return;
    document.body.classList.add('intro-active');
    introOverlay.style.display = 'grid';
    introOverlay.setAttribute('aria-hidden','false');

    // type apology message (polite, on behalf of Ashutosh)
    const lines = [
      "Vedika —",
      "I am here on behalf of Ashutosh.",
      "He is very sorry for being late and feels sad about it.",
      "From his side: Sorry, and Happy Birthday Vedika ❤️"
    ];
    introApology.textContent = '';
    for(const line of lines){
      await typeText(introApology, line + '\n');
      // Speak the line if TTS is enabled (non-blocking)
      if(ttsEnabled) speakText(line, {rate:0.95, pitch:1.1});
      await sleep(550);
    }

    // reveal big birthday title
    const b = document.createElement('div'); b.className = 'intro-bday'; b.textContent = 'HAPPY BIRTHDAY VEDIKA 🎉';
    introOverlay.querySelector('.intro-inner').appendChild(b);
    await sleep(120);
    b.classList.add('show');

    // VFX: hearts + confetti + music + full-screen particles
    runIntroVfx(); if(music) music.play().catch(()=>{});

    // keep overlay for a bit then auto-hide
    await sleep(3000);
    hideIntro();
  }

  function hideIntro(){
    if(!introOverlay) return;
    introOverlay.style.display = 'none';
    introOverlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('intro-active');
  }

  function typeText(el, text, delay=30){
    return new Promise(res=>{
      let i=0; el.textContent = el.textContent || '';
      const t = setInterval(()=>{ el.textContent += text[i++]||''; if(i>=text.length){ clearInterval(t); res(); } }, delay);
    });
  }

  skipIntro?.addEventListener('click', ()=>{ hideIntro(); });

  // Auto-enable voice and run intro after 1 second on page load
  setTimeout(async ()=>{
    // Auto-enable TTS for the intro (with user gesture context)
    const ok = await speakText('');
    if(ok) ttsEnabled = true;
    // Run the intro sequence
    runIntroSequence().catch(()=>{});
  }, 1000);

});
