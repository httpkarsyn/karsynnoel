(() => {
  'use strict';

  const list        = document.querySelector('.project-list');
  const nameBlock   = document.querySelector('.name');

  // LEFT
  const panel       = document.querySelector('.preview-panel');
  const imgEl       = panel?.querySelector('.preview-img');
  const captionLeft = panel?.querySelector('.caption-left');
  const moreLink    = panel?.querySelector('.more-link');
  const closeLink   = panel?.querySelector('.close-link');

  // RIGHT
  const detail      = document.querySelector('.detail-panel');
  const detailClose = detail?.querySelector('.detail-close');
  const detailCredit= detail?.querySelector('.detail-credit');
  const detailGrid  = detail?.querySelector('.detail-grid');

  if (!panel || !imgEl || !captionLeft || !detail || !detailCredit || !detailGrid) return;

  // carousel state
  let images = [];
  let index = 0;
  let autoTimer = null;
  let currentKey = '';
  const AUTO_MS = 2200;

  /* ---------------- helpers ---------------- */
  function qs(sel, root = document) { return root.querySelector(sel); }
  function getTemplate(id) {
    const t = document.getElementById(id);
    return t && 'content' in t ? t.content.cloneNode(true) : null;
  }
  function stopAuto(){ if (autoTimer) clearInterval(autoTimer); autoTimer = null; }
  function startAuto(){ stopAuto(); if (images.length > 1) autoTimer = setInterval(()=>setImage(index+1), AUTO_MS); }
  function setImage(i){ if (!images.length) return; index = (i + images.length) % images.length; imgEl.src = images[index]; }

  function openPreviewFor(el){
    const key = el.getAttribute('data-key') || '';
    const urls = (el.getAttribute('data-images') || '').split(',').map(s=>s.trim()).filter(Boolean);
    if (!key || !urls.length) return;

    currentKey = key;
    images = urls;
    index = 0;
    setImage(0);

    // apply left caption from template
    const leftTpl = getTemplate(`${key}-left`);
    if (leftTpl) {
      const left = qs('.caption-left', leftTpl) || leftTpl;
      captionLeft.innerHTML = left.innerHTML;
    } else {
      captionLeft.innerHTML = `<p class="caption-title">${el.textContent.trim()}</p>`;
    }

    panel.classList.add('show');
    startAuto();
  }

  function openDetailForKey(key){
    const rightTpl = getTemplate(`${key}-right`);
    if (!rightTpl) { detail.classList.add('show'); return; }

    // credit (from template's .detail-credit)
    const creditEl = qs('.detail-credit', rightTpl);
    if (creditEl) detailCredit.innerHTML = creditEl.innerHTML;

    // grid content: collect .detail-text and .media from the template
    const scratch = document.createElement('div');
    scratch.appendChild(rightTpl);
    const pieces = scratch.querySelectorAll('.detail-text, .media');
    detailGrid.innerHTML = '';
    pieces.forEach(node => detailGrid.appendChild(node));

    detail.classList.add('show');
  }

  function closeAll(){
    panel.classList.remove('show');
    detail.classList.remove('show');
    stopAuto();
    currentKey = '';
  }

  /* --------------- interactions --------------- */

  // click a project (left opens; right via More)
  list?.addEventListener('click', (e)=>{
    const el = e.target.closest('li[data-key]');
    if (!el) return;
    e.preventDefault();

    const key = el.getAttribute('data-key');
    if (panel.classList.contains('show') && key === currentKey) {
      // toggle close if same item
      closeAll();
      return;
    }
    openPreviewFor(el);
  });

  // click name: open BOTH left + right with "about" templates
  nameBlock?.addEventListener('click', ()=>{
    openPreviewFor(nameBlock);
    openDetailForKey('about');
  });

  // More: open right for the current key
  moreLink?.addEventListener('click', (e)=>{
    e.preventDefault();
    if (!currentKey) return;
    openDetailForKey(currentKey);
  });

  // Close buttons: close both panels
  closeLink?.addEventListener('click', (e)=>{ e.preventDefault(); closeAll(); });
  detailClose?.addEventListener('click', (e)=>{ e.preventDefault(); closeAll(); });

  // Esc closes both
  window.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeAll(); });
  // clicking anywhere on the page closes both panels (except on interactive elements)
document.addEventListener('click', (e) => {
  const target = e.target;

  // don't trigger close if user clicks inside either panel or on a project/name link
  const insidePreview = panel.contains(target);
  const insideDetail = detail.contains(target);
  const clickedLink = target.closest('a, li[data-key], .name');

  if (insidePreview || insideDetail || clickedLink) return;

  // otherwise close everything
  closeAll();
});

})();
