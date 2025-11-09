(() => {
  'use strict';

  const list = document.querySelector('.project-list');
  const nameBlock = document.querySelector('.name');

  // LEFT (preview)
  const panel = document.querySelector('.preview-panel');
  const captionLeft = panel?.querySelector('.caption-left');
  const moreLink = panel?.querySelector('.more-link');
  const closeLink = panel?.querySelector('.close-link');

  // RIGHT (detail)
  const detail = document.querySelector('.detail-panel');
  const detailClose = detail?.querySelector('.detail-close');
  const detailCredit = detail?.querySelector('.detail-credit');
  const detailTextEl = detail?.querySelector('.detail-text');
  const detailGrid = detail?.querySelector('.detail-grid');

  if (!panel || !captionLeft || !detail || !detailCredit || !detailTextEl || !detailGrid) return;

  // carousel state (LEFT)
  let images = [];
  let index = 0;
  let autoTimer = null;
  let currentKey = '';
  const AUTO_MS = 2200;

  /* ---------------- helpers ---------------- */
  const qs = (sel, root = document) => root.querySelector(sel);

  function getTemplate(id) {
    const t = document.getElementById(id);
    return t && 'content' in t ? t.content.cloneNode(true) : null;
  }

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  function startAuto() {
    stopAuto();
    if (images.length > 1) autoTimer = setInterval(() => setMedia(index + 1), AUTO_MS);
  }

  function isVideo(url = '') {
    return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
  }

  function removeExistingPreviewMedia() {
    const prev = panel.querySelector('.preview-img, .preview-video');
    if (!prev) return;
    if (prev.tagName === 'VIDEO') {
      prev.pause();
      prev.removeAttribute('src');
      prev.load(); // stop network
    }
    prev.remove();
  }

  function mountMedia(url) {
    removeExistingPreviewMedia();

    let el;
    if (isVideo(url)) {
      el = document.createElement('video');
      el.className = 'preview-video';
      el.src = url;
      el.autoplay = true;
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      el.setAttribute('playsinline', '');
      el.setAttribute('muted', '');
    } else {
      el = document.createElement('img');
      el.className = 'preview-img';
      el.alt = '';
      el.src = url;
    }

    const inner = panel.querySelector('.preview-inner');
    const caption = panel.querySelector('.caption');
    inner.insertBefore(el, caption);
  }

  function setMedia(i) {
    if (!images.length) return;
    index = (i + images.length) % images.length;
    mountMedia(images[index]);
  }

  function resetLeftPanel() {
    stopAuto();
    removeExistingPreviewMedia();
    captionLeft.innerHTML = '';
    panel.classList.remove('show');
    panel.removeAttribute('data-key');
  }

  /* ---------------- openers ---------------- */
  // LEFT opener for non-about projects
  function openPreviewFor(el) {
    const key = el.getAttribute('data-key') || '';
    const urls = (el.getAttribute('data-images') || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (!key) return;

    // ABOUT uses no left panel
    if (key === 'about') {
      resetLeftPanel();
      openDetailForKey('about');
      currentKey = 'about';
      return;
    }

    if (!urls.length) return;

    currentKey = key;
    images = urls;
    index = 0;

    // caption from template
    const leftTpl = getTemplate(`${key}-left`);
    if (leftTpl) {
      const left = qs('.caption-left', leftTpl) || leftTpl;
      captionLeft.innerHTML = left.innerHTML;
    } else {
      captionLeft.innerHTML = `<p class="caption-title">${el.textContent.trim()}</p>`;
    }

    // show first media & start
    panel.setAttribute('data-key', key);
    setMedia(0);
    panel.classList.add('show');
    startAuto();
  }

  // RIGHT opener
  function openDetailForKey(key) {
    const rightTpl = getTemplate(`${key}-right`);
    detail.setAttribute('data-key', key);

    if (!rightTpl) {
      detail.classList.add('show');
      return;
    }

    // header pieces
    const creditEl = qs('.detail-credit', rightTpl);
    const textEl = qs('.detail-text', rightTpl);
    detailCredit.innerHTML = creditEl ? creditEl.innerHTML : '';
    detailTextEl.innerHTML = textEl ? textEl.innerHTML : '';

    // media grid
    const scratch = document.createElement('div');
    scratch.appendChild(rightTpl);
    const mediaNodes = scratch.querySelectorAll('.media');
    detailGrid.innerHTML = '';
    mediaNodes.forEach(node => detailGrid.appendChild(node));

    detail.classList.add('show');
  }

  function closeAll() {
    resetLeftPanel();
    detail.classList.remove('show');
    detail.removeAttribute('data-key');
    currentKey = '';
  }

  /* ---------------- interactions ---------------- */
  // Project clicks → normal (left opens; right via More)
  list?.addEventListener('click', (e) => {
    const el = e.target.closest('li[data-key]');
    if (!el) return;
    e.preventDefault();

    const key = el.getAttribute('data-key');
    if ((panel.classList.contains('show') || detail.classList.contains('show')) && key === currentKey) {
      closeAll();
      return;
    }
    openPreviewFor(el);
  });

  // Name click → ABOUT (right only)
  nameBlock?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentKey === 'about' && detail.classList.contains('show')) {
      closeAll();
      return;
    }
    resetLeftPanel();
    currentKey = 'about';
    openDetailForKey('about');
  });

  // "More" opens right for current key
  moreLink?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentKey) return;
    openDetailForKey(currentKey);
  });

  // Close buttons
  closeLink?.addEventListener('click', (e) => { e.preventDefault(); closeAll(); });
  detailClose?.addEventListener('click', (e) => { e.preventDefault(); closeAll(); });

  // Esc closes
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

  // Click-away closes (ignore clicks inside panels or on triggers)
  document.addEventListener('click', (e) => {
    const target = e.target;
    const insidePreview = panel.contains(target);
    const insideDetail = detail.contains(target);
    const clickedTrigger = target.closest('a, li[data-key], .name');
    if (insidePreview || insideDetail || clickedTrigger) return;
    closeAll();
  });
})();
