(function(){
  const fmt = s => {
    s = Math.max(0, s|0);
    const m = String((s/60)|0).padStart(2,'0');
    const sec = String(s%60).padStart(2,'0');
    return `${m}:${sec}`;
  };

  function init(el){
    const startBtn = el.querySelector('.sl-start');
    const timerEl  = el.querySelector('.timer');
    const promptEl = el.querySelector('.sl-prompt');
    const reflect  = el.querySelector('.sl-reflect');
    const duration = parseInt(el.dataset.duration||'120',10);
    const prompt   = el.dataset.prompt||'Look until something you’d ignore becomes important.';
    promptEl.textContent = prompt;

    let t = null, remaining = duration;

    function tick(){
      remaining--; timerEl.textContent = fmt(remaining);
      if(remaining<=0){
        clearInterval(t); t=null; startBtn.disabled=false; timerEl.textContent='00:00';
        reflect.classList.remove('attn-hidden');
        el.dispatchEvent(new CustomEvent('slowlook:done',{detail:{elapsed: duration}}));
      }
    }

    startBtn.addEventListener('click', ()=>{
      if(t) { clearInterval(t); t=null; }
      remaining = duration; timerEl.textContent = fmt(remaining);
      startBtn.disabled = true;
      t = setInterval(tick, 1000);
      el.dispatchEvent(new CustomEvent('slowlook:start',{detail:{duration}}));
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.slowlook').forEach(init);
  });
})();
