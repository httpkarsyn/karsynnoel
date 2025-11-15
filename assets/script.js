(() => {
  'use strict';

  /* ---------- root refs ---------- */
  const list       = document.querySelector('.project-list');
  const nameBlock  = document.querySelector('.name');

  // LEFT preview panel
  const panel        = document.querySelector('.preview-panel');
  const previewInner = panel?.querySelector('.preview-inner');
  const captionLeft  = panel?.querySelector('.caption-left');
  const moreLink     = panel?.querySelector('.more-link');
  const closeLink    = panel?.querySelector('.close-link');

  // RIGHT detail panel
  const detail       = document.querySelector('.detail-panel');
  const detailClose  = detail?.querySelector('.detail-close');
  const detailCredit = detail?.querySelector('.detail-credit');
  const detailText   = detail?.querySelector('.detail-text');
  const detailGrid   = detail?.querySelector('.detail-grid');

  if (!panel || !previewInner || !captionLeft || !detail || !detailCredit || !detailGrid) return;

  /* ---------- LEFT: single-stage stage ---------- */

  const stage = document.createElement('div');
  stage.className = 'preview-stage';

  // remove legacy element and insert stage
  const legacy = previewInner.querySelector('.preview-img, .preview-video, .preview-stack');
  if (legacy) legacy.remove();
  previewInner.insertBefore(stage, previewInner.querySelector('.caption'));

  function makeMediaEl(url) {
    const isVideo = /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);

    if (isVideo) {
      const v = document.createElement('video');
      v.src = url;
      v.autoplay = true;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.className = 'preview-media';

      const ready = new Promise(res => {
        v.addEventListener('loadeddata', res, { once: true });
      });

      return { el: v, ready };
    }

    const img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'eager';
    img.className = 'preview-media';

    const ready = new Promise(res => {
      img.onload = () => res();
      img.onerror = () => res();
    });

    img.src = url;
    return { el: img, ready };
  }

  let currentEl = null;

  // only fade the new media in; old stays visible until removed
  async function swapMedia(url) {
    const { el: nextEl, ready } = makeMediaEl(url);

    // start fully transparent, on top of the old image
    nextEl.style.opacity = '0';
    stage.appendChild(nextEl);

    // wait for it to load so we never show a half-loaded white frame
    await ready;

    // trigger CSS transition
    void nextEl.offsetWidth;

    // fade new media in over the old one
    nextEl.classList.add('show');
    nextEl.style.opacity = '1';

    const oldEl = currentEl;
    currentEl = nextEl;

    // after the fade, remove the old element in the background
    const REMOVE_DELAY = 350; // slightly > 300ms transition
    if (oldEl) {
      setTimeout(() => {
        if (oldEl.parentNode === stage) {
          oldEl.remove();
        }
      }, REMOVE_DELAY);
    }
  }

  /* ---------- carousel state ---------- */

  let images = [];
  let index = 0;
  let autoTimer = null;
  let currentKey = '';
  const AUTO_MS = 2400;

  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  function startAuto() {
    stopAuto();
    if (images.length > 1) {
      autoTimer = setInterval(() => setImage(index + 1), AUTO_MS);
    }
  }

  function setImage(i) {
    if (!images.length) return;
    index = (i + images.length) % images.length;
    swapMedia(images[index]);
  }

  /* ---------- template helpers ---------- */

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function getTemplate(id) {
    const t = document.getElementById(id);
    return t && 'content' in t ? t.content.cloneNode(true) : null;
  }

  /* ---------- openers/closers ---------- */

  function openPreviewFor(el) {
    const key = el.getAttribute('data-key') || '';
    const urls = (el.getAttribute('data-images') || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (!key || !urls.length) return;

    currentKey = key;
    images = urls;
    index = 0;

    const leftTpl = getTemplate(`${key}-left`);
    if (leftTpl) {
      const left = qs('.caption-left', leftTpl) || leftTpl;
      captionLeft.innerHTML = left.innerHTML;
    } else {
      captionLeft.innerHTML = `<p class="caption-title">${el.textContent.trim()}</p>`;
    }

    setImage(0);
    panel.classList.add('show');
    startAuto();
  }

  function buildRightFromTemplate(key) {
    const rightTpl = getTemplate(`${key}-right`);
    if (!rightTpl) {
      detail.classList.add('show');
      return;
    }

    const scratch = document.createElement('div');
    scratch.appendChild(rightTpl);

    const creditEl = qs('.detail-credit', scratch);
    const textEl   = qs('.detail-text', scratch);
    const pieces   = scratch.querySelectorAll('.media');

    if (creditEl) {
      detailCredit.innerHTML = creditEl.innerHTML;
    }

    detailText.innerHTML = textEl ? textEl.innerHTML : '';
    detailGrid.innerHTML = '';

    pieces.forEach(node => detailGrid.appendChild(node));

    detail.classList.add('show');
  }

  function closeAll() {
    panel.classList.remove('show');
    detail.classList.remove('show');
    stopAuto();
    currentKey = '';
  }

  /* ---------- interactions ---------- */

  // Click a project → toggle left preview
  list?.addEventListener('click', (e) => {
    const el = e.target.closest('li[data-key]');
    if (!el) return;

    e.preventDefault();
    const key = el.getAttribute('data-key');

    if (panel.classList.contains('show') && key === currentKey) {
      closeAll();
      return;
    }

    openPreviewFor(el);
  });

  // Name → open "about" details
  nameBlock?.addEventListener('click', (e) => {
    e.preventDefault();
    currentKey = 'about';
    buildRightFromTemplate('about');
  });

  // “More…” opens right for the current key
  moreLink?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!currentKey) return;
    buildRightFromTemplate(currentKey);
  });

  // close buttons
  closeLink?.addEventListener('click', (e) => {
    e.preventDefault();
    closeAll();
  });

  detailClose?.addEventListener('click', (e) => {
    e.preventDefault();
    closeAll();
  });

  // Esc closes everything
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAll();
    }
  });

  // Click outside both panels closes
  document.addEventListener('click', (e) => {
    const t = e.target;
    const insidePreview = panel.contains(t);
    const insideDetail  = detail.contains(t);
    const clickedLink   = t.closest('a, li[data-key], .name');

    if (insidePreview || insideDetail || clickedLink) return;
    closeAll();
  });

  // Play button functionality for videos with sound
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.play-btn');
    if (!btn) return;

    const wrapper = btn.closest('.video-wrapper');
    const video = wrapper?.querySelector('video');
    if (!video) return;

    if (video.paused) {
      video.muted = false;
      video.play();
      btn.style.display = 'none';
    } else {
      video.pause();
      btn.style.display = 'flex';
    }
  });

})();
