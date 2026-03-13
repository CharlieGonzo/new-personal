// ...new file...
document.addEventListener('DOMContentLoaded', () => {

  // Project image modal
  document.querySelectorAll('.project-card').forEach(card => {
    const img = card.querySelector('.project-image img');
    if (!img) return;
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openModal(card));
  });

  function openModal(card) {
    const imgSrc = card.querySelector('.project-image img')?.src || '';
    const title = card.querySelector('.project-title')?.textContent || '';
    const desc = card.querySelector('.project-description, .project-desc')?.textContent || '';
    const githubLink = card.querySelector('a[aria-label^="GitHub"]')?.href || '';

    const modal = document.createElement('div');
    modal.className = 'js-modal';
    modal.innerHTML = `
      <div class="js-modal-overlay" tabindex="0"></div>
      <div class="js-modal-content" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
        <button class="js-modal-close" aria-label="Close">&times;</button>
        <div class="js-modal-body">
          <img src="${imgSrc}" alt="${escapeHtml(title)} screenshot">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(desc)}</p>
          ${githubLink ? `<a class="js-modal-github" href="${githubLink}" target="_blank" rel="noopener">View on GitHub</a>` : ''}
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const overlay = modal.querySelector('.js-modal-overlay');
    const closeBtn = modal.querySelector('.js-modal-close');

    // focus + keyboard
    closeBtn.focus();
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);

    overlay.addEventListener('click', close);
    closeBtn.addEventListener('click', close);

    function close() {
      document.removeEventListener('keydown', onKey);
      modal.remove();
    }
  }

  // Contact form validation + mailto fallback
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      const name = form.querySelector('#name')?.value.trim() || '';
      const email = form.querySelector('#email')?.value.trim() || '';
      const msg = form.querySelector('#message')?.value.trim() || '';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !msg || !emailRegex.test(email)) {
        e.preventDefault();
        showToast('Please enter a name, a valid email, and a message.');
        return;
      }

      // prevent normal submit, open mail client with prefilled content
      e.preventDefault();
      const subject = encodeURIComponent(`Contact from ${name}`);
      const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
      window.location.href = `mailto:charlesgonzalezjr148@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // small toast for messages
  function showToast(text) {
    const t = document.createElement('div');
    t.className = 'js-toast';
    t.textContent = text;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('visible'));
    setTimeout(() => t.classList.remove('visible'), 3500);
    setTimeout(() => t.remove(), 4000);
  }

  function escapeHtml(s = '') {
    return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

});