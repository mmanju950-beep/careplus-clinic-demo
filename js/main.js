/**
 * CarePlus Multispeciality Clinic - Main Application Controller
 * GrowthCraft Studio Showcase Implementation
 */

// Toast notification helper
window.showToast = function(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type} animate-slide-up`;
  
  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
  } else if (type === 'warning') {
    iconSvg = `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
  } else {
    iconSvg = `<svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-content">${message}</div>
    <button type="button" class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
};

// Global App State & Controller
class AppController {
  constructor() {
    this.currentLanguage = 'en'; // 'en' or 'kn'
    this.activeSpecialityFilter = 'all';
    this.searchQuery = '';
    this.init();
  }

  init() {
    this.setupStickyHeader();
    this.setupMobileMenu();
    this.renderSpecialitiesGrid();
    this.renderDoctorsDirectory();
    this.renderTestimonials();
    this.renderFaqs();
    this.setupLanguageToggle();
    this.setupDoctorFilters();
    this.setupContactForm();
    this.setupSpecialityModal();
    this.setupDoctorModal();
  }

  // 1. Sticky Header & Scroll Spy
  setupStickyHeader() {
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    });
  }

  // 2. Mobile Menu Drawer
  setupMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const drawer = document.getElementById('mobileNavDrawer');
    const closeBtn = document.getElementById('closeMobileNavBtn');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !drawer) return;

    const openMenu = () => {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    };

    toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    links.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // 3. Render Specialities Grid
  renderSpecialitiesGrid() {
    const container = document.getElementById('specialitiesGridContainer');
    if (!container) return;

    container.innerHTML = CLINIC_DATA.specialities.map(spec => {
      return `
        <div class="speciality-card group" data-spec-id="${spec.id}">
          <div class="spec-icon-badge">
            ${this.getSvgIcon(spec.icon)}
          </div>
          <h3 class="spec-name">${spec.name}</h3>
          <p class="spec-kannada-sub" ${this.currentLanguage === 'kn' ? 'style="display:block;"' : 'style="display:none;"'}>
            ${spec.nameKannada}
          </p>
          <p class="spec-desc">${spec.shortDesc}</p>
          
          <div class="spec-highlights">
            <span class="spec-treatments-preview">
              <svg class="w-3.5 h-3.5 inline mr-1 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              ${spec.keyTreatments[0]}
            </span>
            <span class="spec-treatments-preview">
              <svg class="w-3.5 h-3.5 inline mr-1 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              ${spec.keyTreatments[1]}
            </span>
          </div>

          <div class="spec-footer-row">
            <button type="button" class="btn-text-link" onclick="window.app.openSpecialityModal('${spec.id}')">
              <span>View Treatments</span>
              <svg class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
            <button type="button" class="btn-pill-teal-sm" onclick="window.bookingEngine.openBookingWizard({ specialityId: '${spec.id}' })">
              Book
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 4. Render Doctors Directory
  renderDoctorsDirectory() {
    const container = document.getElementById('doctorsGridContainer');
    if (!container) return;

    const q = this.searchQuery.toLowerCase().trim();
    const filter = this.activeSpecialityFilter;

    const filtered = CLINIC_DATA.doctors.filter(doc => {
      // Filter by speciality
      if (filter !== 'all' && doc.specialityId !== filter) {
        return false;
      }
      // Search query
      if (q) {
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialityName.toLowerCase().includes(q);
        const matchesCred = doc.credentials.toLowerCase().includes(q);
        const matchesExp = doc.expertise.some(e => e.toLowerCase().includes(q));
        return matchesName || matchesSpec || matchesCred || matchesExp;
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
          <svg class="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h4 class="text-base font-semibold text-slate-700">No doctors found matching "${this.searchQuery}"</h4>
          <p class="text-xs text-slate-500 mt-1">Try clearing your search keyword or switching speciality filters.</p>
          <button class="btn-secondary-sm mt-4" onclick="window.app.resetDoctorFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(doc => {
      return `
        <div class="doctor-card group" data-doc-id="${doc.id}">
          <div class="doctor-card-top">
            <div class="doctor-img-container">
              <img src="${doc.image}" alt="${doc.name}" onerror="this.src='${doc.fallbackImage}'" class="doctor-photo" />
              <div class="doctor-badge-floating">${doc.availabilityBadge}</div>
            </div>
            <div class="doctor-primary-info">
              <div class="doc-rating-line">
                <span class="rating-badge">${doc.rating}</span>
                <span class="demo-tag">Fictional Demo</span>
              </div>
              <h3 class="doctor-card-name">${doc.name}</h3>
              <p class="doctor-card-cred">${doc.credentials}</p>
              <span class="doctor-dept-tag">${doc.specialityName}</span>
              <p class="doctor-exp-text">
                <svg class="w-3.5 h-3.5 inline mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                ${doc.experienceYears}
              </p>
            </div>
          </div>

          <div class="doctor-card-mid">
            <div class="slot-callout">
              <span class="text-xs text-slate-500">Next Slot:</span>
              <strong class="text-xs text-teal-700">${doc.nextAvailable}</strong>
            </div>
            <div class="fee-callout">
              <span class="text-xs text-slate-500">Consultation:</span>
              <strong class="text-xs text-slate-800">₹${doc.fee} <small class="text-2xs text-slate-400 font-normal">(Demo)</small></strong>
            </div>
          </div>

          <div class="doctor-card-bottom">
            <button type="button" class="btn-card-secondary" onclick="window.app.openDoctorModal('${doc.id}')">
              View Profile
            </button>
            <button type="button" class="btn-card-primary" onclick="window.bookingEngine.openBookingWizard({ doctorId: '${doc.id}' })">
              Book Appointment
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // 5. Speciality & Doctor Filters
  setupDoctorFilters() {
    const filterContainer = document.getElementById('doctorFilterTabs');
    if (!filterContainer) return;

    filterContainer.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeSpecialityFilter = btn.getAttribute('data-filter');
        this.renderDoctorsDirectory();
      });
    });

    const searchInput = document.getElementById('doctorSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderDoctorsDirectory();
      });
    }
  }

  resetDoctorFilters() {
    this.activeSpecialityFilter = 'all';
    this.searchQuery = '';
    const searchInput = document.getElementById('doctorSearchInput');
    if (searchInput) searchInput.value = '';

    const filterContainer = document.getElementById('doctorFilterTabs');
    if (filterContainer) {
      filterContainer.querySelectorAll('.filter-tab-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
      });
    }
    this.renderDoctorsDirectory();
  }

  // 6. Testimonials
  renderTestimonials() {
    const container = document.getElementById('testimonialsGrid');
    if (!container) return;

    container.innerHTML = CLINIC_DATA.testimonials.map(t => {
      return `
        <div class="testimonial-card">
          <div class="test-header">
            <div class="test-avatar">
              <span class="avatar-initials">${t.patientName.charAt(0)}</span>
            </div>
            <div>
              <h4 class="test-name">${t.patientName}</h4>
              <p class="test-role">${t.patientRole}</p>
            </div>
          </div>
          <div class="test-stars">
            ${'★'.repeat(t.rating)}
            <span class="test-badge">${t.date}</span>
          </div>
          <blockquote class="test-quote">
            "${t.quote}"
          </blockquote>
          <div class="test-dept-badge">
            <svg class="w-3.5 h-3.5 inline mr-1 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ${t.speciality}
          </div>
        </div>
      `;
    }).join('');
  }

  // 7. FAQs Accordion
  renderFaqs() {
    const container = document.getElementById('faqsAccordionContainer');
    if (!container) return;

    container.innerHTML = CLINIC_DATA.faqs.map((faq, idx) => {
      const isOpen = idx === 0;
      return `
        <div class="faq-accordion-item ${isOpen ? 'open' : ''}">
          <button type="button" class="faq-question-btn" onclick="window.app.toggleFaq(this)">
            <span class="faq-q-text">${faq.question}</span>
            <svg class="w-5 h-5 faq-chevron transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          <div class="faq-answer-panel" ${isOpen ? 'style="max-height: 300px;"' : 'style="max-height: 0px;"'}>
            <p class="faq-answer-text">${faq.answer}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  toggleFaq(btn) {
    const item = btn.closest('.faq-accordion-item');
    const panel = item.querySelector('.faq-answer-panel');
    const isOpen = item.classList.contains('open');

    // Close all other panels
    document.querySelectorAll('.faq-accordion-item').forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-answer-panel').style.maxHeight = '0px';
      }
    });

    if (isOpen) {
      item.classList.remove('open');
      panel.style.maxHeight = '0px';
    } else {
      item.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  }

  // 8. Kannada / English Language Preview Switcher
  setupLanguageToggle() {
    const toggleBtn = document.getElementById('langToggleBtn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      this.currentLanguage = this.currentLanguage === 'en' ? 'kn' : 'en';
      toggleBtn.innerHTML = this.currentLanguage === 'en' 
        ? `<span class="flag-icon">🇮🇳</span> <span class="font-medium">ಕನ್ನಡ Preview</span>`
        : `<span class="flag-icon">🇬🇧</span> <span class="font-medium">English</span>`;

      // Update brand tagline display
      const taglineEl = document.getElementById('heroBrandTagline');
      if (taglineEl) {
        taglineEl.textContent = this.currentLanguage === 'kn' 
          ? CLINIC_DATA.brand.taglineKannada 
          : CLINIC_DATA.brand.tagline;
      }

      const headlineEl = document.getElementById('heroHeadline');
      if (headlineEl) {
        headlineEl.textContent = this.currentLanguage === 'kn'
          ? "ಅನುಕಂಪಯುಕ್ತ ಆರೈಕೆ. ಉತ್ತಮ ಆರೋಗ್ಯ."
          : CLINIC_DATA.brand.heroHeadline;
      }

      // Re-render specialities to show Kannada subtitles
      this.renderSpecialitiesGrid();

      window.showToast(
        this.currentLanguage === 'kn' 
          ? 'ಕನ್ನಡ ಭಾಷಾ ಪೂರ್ವವೀಕ್ಷಣೆ ಸಕ್ರಿಯವಾಗಿದೆ (Kannada Preview Activated)' 
          : 'Switched back to English language view', 
        'info'
      );
    });
  }

  // 9. Doctor Detail Modal
  setupDoctorModal() {
    const modal = document.getElementById('doctorDetailModal');
    const closeBtn = document.getElementById('closeDocModalBtn');
    if (!modal) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  openDoctorModal(doctorId) {
    const doc = CLINIC_DATA.doctors.find(d => d.id === doctorId);
    if (!doc) return;

    const modal = document.getElementById('doctorDetailModal');
    const content = document.getElementById('doctorDetailModalBody');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="doc-modal-content-grid">
        <div class="doc-modal-sidebar">
          <img src="${doc.image}" alt="${doc.name}" onerror="this.src='${doc.fallbackImage}'" class="doc-modal-photo" />
          <div class="doc-modal-status-badge">
            <span class="status-indicator-dot"></span>
            <span>${doc.availabilityBadge}</span>
          </div>
          <div class="doc-modal-fee-card">
            <span class="fee-lbl">Consultation Fee</span>
            <span class="fee-amt">₹${doc.fee}</span>
            <small class="fee-note">Payable during clinic visit (Demo)</small>
          </div>
          <button type="button" class="btn-primary-w-full mt-4" onclick="window.app.bookFromDoctorModal('${doc.id}')">
            Book Appointment
          </button>
        </div>

        <div class="doc-modal-main">
          <div class="doc-modal-head">
            <div class="flex items-center space-x-2">
              <span class="doc-dept-badge">${doc.specialityName}</span>
              <span class="doc-rating-badge">${doc.rating}</span>
            </div>
            <h2 class="doc-modal-name">${doc.name}</h2>
            <p class="doc-modal-cred">${doc.credentials}</p>
            <p class="doc-modal-exp text-teal-700 font-semibold text-sm mt-1">${doc.experienceYears}</p>
          </div>

          <div class="doc-modal-section">
            <h4 class="doc-modal-sec-title">About the Consultant</h4>
            <p class="doc-modal-bio">${doc.bio}</p>
          </div>

          <div class="doc-modal-section">
            <h4 class="doc-modal-sec-title">Clinical Expertise & Areas of Interest</h4>
            <div class="doc-expertise-chips">
              ${doc.expertise.map(exp => `<span class="chip-item">✓ ${exp}</span>`).join('')}
            </div>
          </div>

          <div class="doc-modal-section">
            <h4 class="doc-modal-sec-title">Education & Credentials</h4>
            <ul class="doc-edu-list">
              ${doc.education.map(edu => `<li><span class="text-teal-600 font-bold mr-2">•</span>${edu}</li>`).join('')}
            </ul>
          </div>

          <div class="doc-modal-section">
            <h4 class="doc-modal-sec-title">Consultation Schedule & Languages</h4>
            <div class="doc-schedule-box">
              <p><strong>Timings:</strong> ${doc.consultationHours}</p>
              <p><strong>Languages Spoken:</strong> ${doc.languages.join(', ')}</p>
            </div>
          </div>

          <div class="doc-modal-disclaimer">
            <p class="text-2xs text-slate-500">Notice: This is a fictional doctor profile created for the GrowthCraft Studio website demonstration. Real clinic implementations will connect to your clinic's roster and verified doctor medical council registrations.</p>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  bookFromDoctorModal(docId) {
    const modal = document.getElementById('doctorDetailModal');
    if (modal) modal.classList.remove('active');
    window.bookingEngine.openBookingWizard({ doctorId: docId });
  }

  // 10. Speciality Detail Modal
  setupSpecialityModal() {
    const modal = document.getElementById('specialityDetailModal');
    const closeBtn = document.getElementById('closeSpecModalBtn');
    if (!modal) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  openSpecialityModal(specId) {
    const spec = CLINIC_DATA.specialities.find(s => s.id === specId);
    if (!spec) return;

    const modal = document.getElementById('specialityDetailModal');
    const content = document.getElementById('specialityDetailModalBody');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="spec-modal-container">
        <div class="spec-modal-header">
          <div class="spec-modal-icon">${this.getSvgIcon(spec.icon)}</div>
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-teal-600">Department Overview</span>
            <h3 class="text-2xl font-bold text-navy-900">${spec.name}</h3>
            <p class="text-sm text-slate-500">${spec.nameKannada}</p>
          </div>
        </div>

        <div class="spec-modal-body mt-4">
          <p class="text-sm text-slate-700 leading-relaxed">${spec.fullDesc}</p>

          <h5 class="text-sm font-bold text-navy-900 mt-6 mb-3 uppercase tracking-wider">Conditions & Treatments Managed</h5>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${spec.keyTreatments.map(t => `
              <div class="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center text-xs font-medium text-slate-800">
                <svg class="w-4 h-4 text-teal-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                ${t}
              </div>
            `).join('')}
          </div>

          <div class="spec-modal-meta-row mt-6">
            <div>
              <span class="text-xs text-slate-400 block">Department Head</span>
              <strong class="text-sm text-navy-900">${spec.headDoctor}</strong>
            </div>
            <div>
              <span class="text-xs text-slate-400 block">Clinic Location</span>
              <strong class="text-sm text-navy-900">${spec.roomNo}</strong>
            </div>
          </div>
        </div>

        <div class="spec-modal-actions mt-6 pt-4 border-t border-slate-100 flex justify-end space-x-3">
          <button type="button" class="btn-action-outline-sm" onclick="document.getElementById('specialityDetailModal').classList.remove('active'); document.body.style.overflow = '';">
            Close
          </button>
          <button type="button" class="btn-primary-sm" onclick="document.getElementById('specialityDetailModal').classList.remove('active'); window.bookingEngine.openBookingWizard({ specialityId: '${spec.id}' });">
            Book Appointment in this Speciality
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // 11. Quick Contact / Feedback Form
  setupContactForm() {
    const form = document.getElementById('quickContactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      const phone = form.querySelector('[name="phone"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !phone) {
        window.showToast('Please enter your name and phone number', 'warning');
        return;
      }

      form.reset();
      window.showToast(`Thank you, ${name}! Your demo message has been simulated.`, 'success');
    });
  }

  // Svg Helper
  getSvgIcon(type) {
    switch(type) {
      case 'stethoscope':
        return `<svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"></path></svg>`;
      case 'baby':
        return `<svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      case 'sparkles':
        return `<svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`;
      case 'heart-handshake':
        return `<svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>`;
      case 'clipboard-check':
      default:
        return `<svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>`;
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
