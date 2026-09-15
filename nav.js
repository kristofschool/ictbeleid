// Shared nav component — included on every page
(function(){
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  const NAV_HTML = `
<nav id="site-nav">
  <div class="nav-inner">
    <a class="nav-brand" href="index.html">
      <img src="logo.png" width="26" height="26" alt="SJSP" style="display:block;flex-shrink:0">
      <span class="nav-brand-text">ICT-beleid</span>
    </a>
    <ul class="nav-links" id="nav-links">
      <li><a href="nieuws.html" data-page="nieuws.html">Nieuws</a></li>
      <li><a href="visie.html" data-page="visie.html">Visie</a></li>
      <li class="nav-has-dropdown">
        <button class="nav-dropdown-btn" aria-expanded="false" aria-haspopup="true" data-page="basisapps">
          Basisapps
          <svg class="nav-chevron" viewBox="0 0 10 6" width="10" height="6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="nav-dropdown" role="menu">
          <div class="nav-dropdown-section">
            <div class="nav-dropdown-label">Cloud en leeromgevingen</div>
            <a href="cloud.html" class="nav-dropdown-item" data-page="cloud.html">
              <span class="nav-dropdown-icon nav-dropdown-icon--placeholder">CL</span>
              <span><strong>Cloud en leeromgevingen</strong><span>Google Drive &amp; iCloud</span></span>
            </a>
          </div>
          <div class="nav-dropdown-section">
            <div class="nav-dropdown-label">Leren &amp; organiseren</div>
            <a href="goodnotes.html" class="nav-dropdown-item" data-page="goodnotes.html">
              <span class="nav-dropdown-icon nav-dropdown-icon--placeholder">GN</span>
              <span><strong>Goodnotes</strong><span>Notities &amp; annotaties</span></span>
            </a>
          </div>
          <div class="nav-dropdown-section">
            <div class="nav-dropdown-label">Productiviteit</div>
            <a href="productiviteit.html" class="nav-dropdown-item" data-page="productiviteit.html">
              <span class="nav-dropdown-icon nav-dropdown-icon--placeholder">P</span>
              <span><strong>Productiviteit</strong><span>Binnenkort</span></span>
            </a>
          </div>
          <div class="nav-dropdown-section">
            <div class="nav-dropdown-label">Creativiteit</div>
            <a href="creativiteit.html" class="nav-dropdown-item" data-page="creativiteit.html">
              <span class="nav-dropdown-icon nav-dropdown-icon--placeholder">C</span>
              <span><strong>Creativiteit</strong><span>Binnenkort</span></span>
            </a>
          </div>
          <div class="nav-dropdown-section">
            <div class="nav-dropdown-label">Computationeel denken</div>
            <a href="computationeel.html" class="nav-dropdown-item" data-page="computationeel.html">
              <span class="nav-dropdown-icon nav-dropdown-icon--placeholder">CD</span>
              <span><strong>Computationeel denken</strong><span>Binnenkort</span></span>
            </a>
          </div>
        </div>
      </li>
      <li><a href="ipad.html" data-page="ipad.html">Werken met iPad</a></li>
      <li><a href="mac.html" data-page="mac.html">Werken met Mac</a></li>
      <li><a href="toegankelijkheid.html" data-page="toegankelijkheid.html">Toegankelijkheid</a></li>
      <li><a href="ai.html" data-page="ai.html">AI-beleid</a></li>
      <li class="nav-has-dropdown">
        <button class="nav-dropdown-btn" aria-expanded="false" aria-haspopup="true" data-page="evaluatie">
          Evaluatie
          <svg class="nav-chevron" viewBox="0 0 10 6" width="10" height="6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="nav-dropdown" role="menu">
          <div class="nav-dropdown-section">
            <a href="sjablonen.html" class="nav-dropdown-item" data-page="sjablonen.html">
              <span class="nav-dropdown-icon nav-dropdown-icon--placeholder">SJ</span>
              <span><strong>Sjablonen</strong><span>Binnenkort</span></span>
            </a>
            <a href="bookwidgets.html" class="nav-dropdown-item" data-page="bookwidgets.html">
              <span class="nav-dropdown-icon nav-dropdown-icon--placeholder">BW</span>
              <span><strong>Bookwidgets</strong><span>Binnenkort</span></span>
            </a>
            <a href="seb.html" class="nav-dropdown-item" data-page="seb.html">
              <span class="nav-dropdown-icon nav-dropdown-icon--placeholder">SE</span>
              <span><strong>SEB</strong><span>Veilig examens afnemen</span></span>
            </a>
            <a href="rekenmachine.html" class="nav-dropdown-item" data-page="rekenmachine.html">
              <span class="nav-dropdown-icon nav-dropdown-icon--placeholder">RM</span>
              <span><strong>Rekenmachine</strong><span>Binnenkort</span></span>
            </a>
            <a href="examens.html" class="nav-dropdown-item" data-page="examens.html">
              <span class="nav-dropdown-icon nav-dropdown-icon--placeholder">DE</span>
              <span><strong>Digitale examens</strong><span>Binnenkort</span></span>
            </a>
            <a href="feedback.html" class="nav-dropdown-item" data-page="feedback.html">
              <span class="nav-dropdown-icon nav-dropdown-icon--placeholder">FB</span>
              <span><strong>Feedback</strong><span>Feedbackcyclus</span></span>
            </a>
          </div>
        </div>
      </li>
      <li><a href="contact.html" data-page="contact.html">Contact</a></li>
    </ul>
    <button class="nav-hamburger" id="nav-hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;

  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

  // Mark active
  const dropdownGroups = {
    basisapps: ['goodnotes.html','productiviteit.html','creativiteit.html','computationeel.html','cloud.html'],
    evaluatie: ['sjablonen.html','bookwidgets.html','seb.html','rekenmachine.html','examens.html','feedback.html']
  };
  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.dataset.page === currentPage || (currentPage === 'index.html' && el.dataset.page === 'nieuws.html')) {
      el.classList.add('active');
    }
    if (dropdownGroups[el.dataset.page] && dropdownGroups[el.dataset.page].includes(currentPage)) {
      el.classList.add('active');
    }
  });

  // Dropdown toggle (supports multiple dropdowns)
  document.querySelectorAll('.nav-has-dropdown').forEach(group => {
    const dropBtn = group.querySelector('.nav-dropdown-btn');
    const dropMenu = group.querySelector('.nav-dropdown');
    if (!dropBtn || !dropMenu) return;
    dropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropBtn.getAttribute('aria-expanded') === 'true';
      // Close other open dropdowns first
      document.querySelectorAll('.nav-dropdown-btn').forEach(b => { if (b !== dropBtn) b.setAttribute('aria-expanded', 'false'); });
      document.querySelectorAll('.nav-dropdown').forEach(m => { if (m !== dropMenu) m.classList.remove('open'); });
      dropBtn.setAttribute('aria-expanded', !open);
      dropMenu.classList.toggle('open', !open);
    });
    dropMenu.addEventListener('click', e => e.stopPropagation());
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
    document.querySelectorAll('.nav-dropdown').forEach(m => m.classList.remove('open'));
  });

  // Hamburger
  const ham = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  if (ham && navLinks) {
    ham.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      ham.classList.toggle('open');
    });
  }
})();
