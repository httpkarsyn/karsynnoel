(() => {
  'use strict';

  const list = document.querySelector('.project-list');
  const nameBlock = document.querySelector('.name');

  const detail = document.querySelector('.detail-panel');
  const detailClose = detail?.querySelector('.detail-close');
  const detailCredit = detail?.querySelector('.detail-credit');
  const detailText = detail?.querySelector('.detail-text');
  const detailGrid = detail?.querySelector('.detail-grid');

  if (!detail || !detailCredit || !detailText || !detailGrid) return;

  let currentKey = '';

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function getTemplate(id) {
    const t = document.getElementById(id);
    return t && 'content' in t ? t.content.cloneNode(true) : null;
  }

  function buildRightFromTemplate(key) {
    const rightTpl = getTemplate(`${key}-right`);
    if (!rightTpl) return;

    const scratch = document.createElement('div');
    scratch.appendChild(rightTpl);

    const creditEl = qs('.detail-credit', scratch);
    const textEl = qs('.detail-text', scratch);
    const pieces = scratch.querySelectorAll('.media, .disco-stack');

    detailCredit.innerHTML = creditEl ? creditEl.innerHTML : '';
    detailText.innerHTML = textEl ? textEl.innerHTML : '';
    detailGrid.innerHTML = '';

    pieces.forEach(node => detailGrid.appendChild(node));

    currentKey = key;
    detail.classList.add('show');
    document.body.classList.add('panel-open');
  }

  function closeAll() {
    detail.classList.remove('show');
    document.body.classList.remove('panel-open');
    currentKey = '';
  }

  list?.addEventListener('click', (e) => {
    const el = e.target.closest('li[data-key]');
    if (!el) return;

    e.preventDefault();
    const key = el.getAttribute('data-key');

    if (detail.classList.contains('show') && key === currentKey) {
      closeAll();
      return;
    }

    buildRightFromTemplate(key);
  });

  nameBlock?.addEventListener('click', (e) => {
    e.preventDefault();

    if (detail.classList.contains('show') && currentKey === 'about') {
      closeAll();
      return;
    }

    buildRightFromTemplate('about');
  });

  detailClose?.addEventListener('click', (e) => {
    e.preventDefault();
    closeAll();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAll();
    }
  });

  document.addEventListener('click', (e) => {
    const t = e.target;
    const insideDetail = detail.contains(t);
    const clickedTrigger = t.closest('li[data-key], .name');

    if (insideDetail || clickedTrigger) return;
    closeAll();
  });

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