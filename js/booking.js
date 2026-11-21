/**
 * CarePlus Multispeciality Clinic - Appointment Booking Engine
 * GrowthCraft Studio Showcase Implementation
 * 
 * Features:
 * - 6-step guided booking wizard
 * - Dynamic interactive calendar with past-date blocking & doctor off-day handling
 * - Slot availability engine with "Fast Filling" & "Booked" states
 * - Real-time duplicate prevention (persisted in localStorage)
 * - Patient validation (+91 Indian mobile format)
 * - Booking confirmation with downloadable .ICS calendar event & printable slip
 * - Full booking management (View, Reschedule, Cancel)
 */

class BookingEngine {
  constructor() {
    this.storageKey = 'careplus_demo_bookings';
    this.currentStep = 1;
    this.totalSteps = 6;
    
    // Booking State
    this.state = {
      specialityId: null,
      specialityName: '',
      doctorId: null,
      doctor: null,
      selectedDate: null, // YYYY-MM-DD
      selectedDateObj: null,
      selectedSlot: null,
      patientType: 'new',
      patientName: '',
      patientMobile: '',
      patientEmail: '',
      patientReason: '',
      preferredContact: 'whatsapp',
      disclaimerAccepted: true
    };

    // Calendar state
    this.currentCalendarMonth = new Date().getMonth();
    this.currentCalendarYear = new Date().getFullYear();

    this.init();
  }

  init() {
    this.ensureInitialDemoData();
    this.bindGlobalEvents();
    this.updateMyBookingsBadge();
  }

  // Seed sample initial booked slots to demonstrate "Booked / Unavailable" feature realistically
  ensureInitialDemoData() {
    const existing = this.getAllBookings();
    if (existing.length === 0) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const formatDate = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      const seed = [
        {
          id: 'CP-HUB-2026-1042',
          doctorId: 'doc-1',
          doctorName: 'Dr. Rajeshwar Kulkarni',
          specialityName: 'General Medicine',
          date: formatDate(today),
          slot: '10:00 AM',
          patientName: 'Kavita M. (Pre-seeded Demo)',
          patientMobile: '9845012345',
          patientEmail: 'kavita.demo@example.com',
          patientType: 'returning',
          createdAt: new Date().toISOString(),
          status: 'confirmed'
        },
        {
          id: 'CP-HUB-2026-1043',
          doctorId: 'doc-2',
          doctorName: 'Dr. Sneha Patil',
          specialityName: 'Pediatrics & Child Care',
          date: formatDate(today),
          slot: '11:00 AM',
          patientName: 'Anand S. (Pre-seeded Demo)',
          patientMobile: '9900154321',
          patientEmail: 'anand.demo@example.com',
          patientType: 'new',
          createdAt: new Date().toISOString(),
          status: 'confirmed'
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(seed));
    }
  }

  getAllBookings() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading localStorage:', e);
      return [];
    }
  }

  saveBooking(booking) {
    const list = this.getAllBookings();
    list.unshift(booking);
    localStorage.setItem(this.storageKey, JSON.stringify(list));
    this.updateMyBookingsBadge();
  }

  cancelBooking(bookingId) {
    let list = this.getAllBookings();
    list = list.filter(b => b.id !== bookingId);
    localStorage.setItem(this.storageKey, JSON.stringify(list));
    this.updateMyBookingsBadge();
  }

  updateMyBookingsBadge() {
    const count = this.getAllBookings().length;
    const badgeEls = document.querySelectorAll('.my-bookings-count');
    badgeEls.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  // Open booking modal with optional preselected speciality or doctor
  openBookingWizard(preset = {}) {
    const modal = document.getElementById('bookingModal');
    if (!modal) return;

    // Reset or set presets
    this.currentStep = 1;
    this.state = {
      specialityId: null,
      specialityName: '',
      doctorId: null,
      doctor: null,
      selectedDate: null,
      selectedDateObj: null,
      selectedSlot: null,
      patientType: 'new',
      patientName: '',
      patientMobile: '',
      patientEmail: '',
      patientReason: '',
      preferredContact: 'whatsapp',
      disclaimerAccepted: true
    };

    if (preset.specialityId) {
      this.selectSpeciality(preset.specialityId, false);
      this.currentStep = 2;
    }

    if (preset.doctorId) {
      const doc = CLINIC_DATA.doctors.find(d => d.id === preset.doctorId);
      if (doc) {
        this.selectSpeciality(doc.specialityId, false);
        this.selectDoctor(doc.id, false);
        this.currentStep = 3;
      }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.renderCurrentStep();
  }

  closeBookingWizard() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  renderCurrentStep() {
    // Update step indicator
    const stepsIndicator = document.getElementById('bookingStepIndicators');
    if (stepsIndicator) {
      const stepItems = stepsIndicator.querySelectorAll('.step-indicator-item');
      stepItems.forEach((item, idx) => {
        const stepNum = idx + 1;
        item.classList.remove('active', 'completed');
        if (stepNum === this.currentStep) {
          item.classList.add('active');
        } else if (stepNum < this.currentStep) {
          item.classList.add('completed');
        }
      });
    }

    // Hide all step containers
    for (let i = 1; i <= this.totalSteps; i++) {
      const el = document.getElementById(`bookingStep${i}`);
      if (el) {
        el.style.display = (i === this.currentStep) ? 'block' : 'none';
      }
    }

    // Confirmation container
    const confEl = document.getElementById('bookingConfirmationContainer');
    if (confEl) confEl.style.display = 'none';

    // Step-specific renderers
    switch (this.currentStep) {
      case 1:
        this.renderStep1Specialities();
        break;
      case 2:
        this.renderStep2Doctors();
        break;
      case 3:
        this.renderStep3Calendar();
        break;
      case 4:
        this.renderStep4Slots();
        break;
      case 5:
        this.renderStep5PatientForm();
        break;
      case 6:
        this.renderStep6Review();
        break;
    }

    this.updateNavButtons();
  }

  updateNavButtons() {
    const prevBtn = document.getElementById('bookingPrevBtn');
    const nextBtn = document.getElementById('bookingNextBtn');

    if (!prevBtn || !nextBtn) return;

    // Previous button visibility
    if (this.currentStep === 1) {
      prevBtn.style.visibility = 'hidden';
    } else {
      prevBtn.style.visibility = 'visible';
    }

    // Next button state & text
    if (this.currentStep === this.totalSteps) {
      nextBtn.innerHTML = `
        <span>Confirm & Book Demo</span>
        <svg class="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      `;
      nextBtn.classList.add('btn-primary-accent');
    } else {
      nextBtn.innerHTML = `
        <span>Continue</span>
        <svg class="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      `;
      nextBtn.classList.remove('btn-primary-accent');
    }

    // Validation for enabling Next button
    let canProceed = false;
    if (this.currentStep === 1 && this.state.specialityId) canProceed = true;
    if (this.currentStep === 2 && this.state.doctorId) canProceed = true;
    if (this.currentStep === 3 && this.state.selectedDate) canProceed = true;
    if (this.currentStep === 4 && this.state.selectedSlot) canProceed = true;
    if (this.currentStep === 5) {
      canProceed = this.validatePatientFormSilent();
    }
    if (this.currentStep === 6) {
      canProceed = this.state.disclaimerAccepted;
    }

    nextBtn.disabled = !canProceed;
    nextBtn.classList.toggle('disabled-btn', !canProceed);
  }

  goToNextStep() {
    if (this.currentStep === 5) {
      if (!this.validatePatientFormWithFeedback()) {
        return;
      }
    }

    if (this.currentStep === 6) {
      this.submitAppointment();
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.renderCurrentStep();
    }
  }

  goToPrevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.renderCurrentStep();
    }
  }

  // ================= STEP 1: Specialities =================
  renderStep1Specialities() {
    const container = document.getElementById('specialitySelectGrid');
    if (!container) return;

    container.innerHTML = CLINIC_DATA.specialities.map(spec => {
      const isSelected = this.state.specialityId === spec.id;
      return `
        <div class="speciality-select-card ${isSelected ? 'selected' : ''}" 
             data-spec-id="${spec.id}"
             onclick="window.bookingEngine.selectSpeciality('${spec.id}', true)">
          <div class="spec-select-icon">
            ${this.getSpecialitySvgIcon(spec.icon)}
          </div>
          <div class="spec-select-body">
            <h4 class="spec-title">${spec.name}</h4>
            <p class="spec-sub">${spec.shortDesc}</p>
            <div class="spec-badge-row">
              <span class="badge-mini"><i class="badge-dot"></i> ${spec.headDoctor}</span>
              <span class="badge-mini-gray">${spec.roomNo}</span>
            </div>
          </div>
          <div class="select-radio-check">
            ${isSelected ? '✓' : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  selectSpeciality(specId, autoNext = false) {
    const spec = CLINIC_DATA.specialities.find(s => s.id === specId);
    if (!spec) return;

    this.state.specialityId = spec.id;
    this.state.specialityName = spec.name;

    // Reset dependent doctor if doctor does not belong to this speciality
    if (this.state.doctor && this.state.doctor.specialityId !== specId) {
      this.state.doctorId = null;
      this.state.doctor = null;
      this.state.selectedSlot = null;
    }

    this.renderStep1Specialities();
    this.updateNavButtons();

    if (autoNext) {
      setTimeout(() => this.goToNextStep(), 200);
    }
  }

  // ================= STEP 2: Doctor Selection =================
  renderStep2Doctors() {
    const container = document.getElementById('doctorSelectGrid');
    if (!container) return;

    const filteredDoctors = CLINIC_DATA.doctors.filter(d => 
      !this.state.specialityId || d.specialityId === this.state.specialityId
    );

    if (filteredDoctors.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <p>No doctors currently mapped for this speciality in the demo.</p>
          <button class="btn-secondary-sm" onclick="window.bookingEngine.selectSpeciality(CLINIC_DATA.specialities[0].id, false)">Choose another speciality</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredDoctors.map(doc => {
      const isSelected = this.state.doctorId === doc.id;
      return `
        <div class="doctor-select-card ${isSelected ? 'selected' : ''}" 
             data-doc-id="${doc.id}"
             onclick="window.bookingEngine.selectDoctor('${doc.id}', true)">
          <div class="doc-avatar-wrap">
            <img src="${doc.image}" alt="${doc.name}" 
                 onerror="this.src='${doc.fallbackImage}'" 
                 class="doc-avatar-img" />
            <span class="doc-online-status" title="Accepting Online Demo Appointments"></span>
          </div>
          <div class="doc-select-info">
            <div class="doc-header-row">
              <h4 class="doc-name">${doc.name}</h4>
              <span class="doc-fee-badge">₹${doc.fee} <small class="text-xs">Consultation</small></span>
            </div>
            <p class="doc-cred">${doc.credentials}</p>
            <p class="doc-exp-badge">${doc.experienceYears}</p>
            
            <div class="doc-meta-pills">
              <span class="meta-pill-teal">
                <svg class="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                ${doc.availabilityBadge}
              </span>
              <span class="meta-pill-lang">
                ${doc.languages.join(', ')}
              </span>
            </div>
          </div>
          <div class="select-radio-check">
            ${isSelected ? '✓' : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  selectDoctor(docId, autoNext = false) {
    const doc = CLINIC_DATA.doctors.find(d => d.id === docId);
    if (!doc) return;

    this.state.doctorId = doc.id;
    this.state.doctor = doc;
    this.state.specialityId = doc.specialityId;
    this.state.specialityName = doc.specialityName;
    this.state.selectedSlot = null; // reset slot selection

    this.renderStep2Doctors();
    this.updateNavButtons();

    if (autoNext) {
      setTimeout(() => this.goToNextStep(), 200);
    }
  }

  // ================= STEP 3: Interactive Calendar =================
  renderStep3Calendar() {
    const container = document.getElementById('bookingCalendarWrapper');
    if (!container) return;

    const doc = this.state.doctor;
    const docName = doc ? doc.name : 'Selected Doctor';
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = this.currentCalendarYear;
    const currentMonth = this.currentCalendarMonth;
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Max booking date: 30 days ahead
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);

    let daysHtml = '';

    // Empty cells for alignment
    for (let i = 0; i < firstDayIndex; i++) {
      daysHtml += `<div class="calendar-day empty"></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(currentYear, currentMonth, day);
      thisDate.setHours(0, 0, 0, 0);

      const yyyy = thisDate.getFullYear();
      const mm = String(thisDate.getMonth() + 1).padStart(2, '0');
      const dd = String(thisDate.getDate()).padStart(2, '0');
      const dateString = `${yyyy}-${mm}-${dd}`;

      const isPast = thisDate < today;
      const isTooFar = thisDate > maxDate;
      const isToday = thisDate.getTime() === today.getTime();
      const isSelected = this.state.selectedDate === dateString;

      // Doctor off-day logic
      let isDocOff = false;
      let offReason = '';
      const dayOfWeek = thisDate.getDay(); // 0: Sun, 1: Mon, ...

      if (doc) {
        if (doc.id === 'doc-1' && dayOfWeek === 0) { // Dr. Kulkarni off on Sun
          isDocOff = true;
          offReason = 'Sunday off';
        } else if (doc.id === 'doc-3' && (dayOfWeek === 0 || dayOfWeek === 2 || dayOfWeek === 5)) { // Dr. Deshpande Mon, Wed, Thu, Sat
          isDocOff = true;
          offReason = 'Doctor not scheduled';
        } else if (doc.id === 'doc-4' && dayOfWeek === 0) { // Dr. Joshi off on Sun
          isDocOff = true;
          offReason = 'Sunday off';
        } else if (doc.id === 'doc-5' && (dayOfWeek === 0 || dayOfWeek === 6)) { // Dr. Hegde Mon-Fri
          isDocOff = true;
          offReason = 'Weekend off';
        }
      }

      const isDisabled = isPast || isTooFar || isDocOff;

      let classNames = ['calendar-day'];
      if (isDisabled) classNames.push('disabled');
      if (isToday) classNames.push('today');
      if (isSelected) classNames.push('selected');
      if (isDocOff) classNames.push('doc-off');

      daysHtml += `
        <button type="button" 
                class="${classNames.join(' ')}"
                ${isDisabled ? 'disabled' : ''}
                title="${isDisabled ? (isPast ? 'Past date' : (isDocOff ? offReason : 'Date unavailable')) : dateString}"
                onclick="window.bookingEngine.selectDate('${dateString}')">
          <span class="day-number">${day}</span>
          ${isToday ? '<span class="today-dot">Today</span>' : ''}
          ${isSelected ? '<span class="selected-indicator">✓</span>' : ''}
        </button>
      `;
    }

    container.innerHTML = `
      <div class="calendar-widget">
        <div class="calendar-header">
          <div class="cal-title-group">
            <h4 class="cal-month-title">${monthNames[currentMonth]} ${currentYear}</h4>
            <p class="cal-subtitle">Showing consultation availability for <strong class="text-teal-700">${docName}</strong></p>
          </div>
          <div class="cal-nav-buttons">
            <button type="button" class="cal-nav-btn" onclick="window.bookingEngine.changeCalendarMonth(-1)" title="Previous Month">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button type="button" class="cal-nav-btn" onclick="window.bookingEngine.changeCalendarMonth(1)" title="Next Month">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        <div class="calendar-weekdays">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        <div class="calendar-days-grid">
          ${daysHtml}
        </div>

        <div class="calendar-legend">
          <span class="legend-item"><span class="legend-swatch available"></span> Available</span>
          <span class="legend-item"><span class="legend-swatch today"></span> Today</span>
          <span class="legend-item"><span class="legend-swatch selected"></span> Selected</span>
          <span class="legend-item"><span class="legend-swatch disabled"></span> Unavailable / Doctor Off</span>
        </div>
      </div>
    `;
  }

  changeCalendarMonth(delta) {
    this.currentCalendarMonth += delta;
    if (this.currentCalendarMonth > 11) {
      this.currentCalendarMonth = 0;
      this.currentCalendarYear++;
    } else if (this.currentCalendarMonth < 0) {
      this.currentCalendarMonth = 11;
      this.currentCalendarYear--;
    }
    this.renderStep3Calendar();
  }

  selectDate(dateString) {
    this.state.selectedDate = dateString;
    this.state.selectedDateObj = new Date(dateString + 'T00:00:00');
    this.state.selectedSlot = null; // reset slot selection

    this.renderStep3Calendar();
    this.updateNavButtons();

    // Smooth advance
    setTimeout(() => this.goToNextStep(), 250);
  }

  // ================= STEP 4: Time Slot Selection =================
  renderStep4Slots() {
    const container = document.getElementById('bookingSlotsWrapper');
    if (!container) return;

    const doc = this.state.doctor;
    const dateStr = this.state.selectedDate;

    if (!doc || !dateStr) {
      container.innerHTML = `<p class="p-4 text-slate-500">Please choose a doctor and date first.</p>`;
      return;
    }

    const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Check existing bookings in localStorage for this doctor & date
    const allBookings = this.getAllBookings();
    const bookedSlotsForDate = allBookings
      .filter(b => b.doctorId === doc.id && b.date === dateStr)
      .map(b => b.slot);

    // Group slots
    const morningSlots = doc.slots.morning || [];
    const afternoonSlots = doc.slots.afternoon || [];
    const eveningSlots = doc.slots.evening || [];

    const renderSlotList = (slots, periodTitle) => {
      if (!slots || slots.length === 0) {
        return `
          <div class="slot-group">
            <h5 class="slot-period-header">${periodTitle}</h5>
            <p class="text-xs text-slate-400 italic">No consultation slots during this period.</p>
          </div>
        `;
      }

      const slotButtons = slots.map((time, idx) => {
        const isBooked = bookedSlotsForDate.includes(time);
        const isSelected = this.state.selectedSlot === time;
        // Mock fast filling logic for realistic clinic demo
        const isFastFilling = !isBooked && (idx === 1 || idx === 3);

        return `
          <button type="button" 
                  class="slot-btn ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''} ${isFastFilling ? 'fast-filling' : ''}"
                  ${isBooked ? 'disabled' : ''}
                  onclick="window.bookingEngine.selectSlot('${time}')">
            <span class="slot-time">${time}</span>
            ${isBooked ? '<span class="slot-badge booked">Booked</span>' : ''}
            ${!isBooked && isFastFilling ? '<span class="slot-badge filling">1 left</span>' : ''}
            ${!isBooked && !isFastFilling ? '<span class="slot-badge avail">Available</span>' : ''}
          </button>
        `;
      }).join('');

      return `
        <div class="slot-group">
          <h5 class="slot-period-header">${periodTitle}</h5>
          <div class="slots-pill-grid">
            ${slotButtons}
          </div>
        </div>
      `;
    };

    container.innerHTML = `
      <div class="slots-container-card">
        <div class="slots-meta-bar">
          <div class="meta-item">
            <span class="meta-label">Selected Date:</span>
            <strong class="meta-val">${formattedDate}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">Doctor:</span>
            <strong class="meta-val">${doc.name}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">Consultation Fee:</span>
            <span class="meta-val text-teal-600 font-bold">₹${doc.fee} (Demo)</span>
          </div>
        </div>

        <div class="slots-breakdown-area">
          ${renderSlotList(morningSlots, 'Morning Slots (8:30 AM - 1:00 PM)')}
          ${renderSlotList(afternoonSlots, 'Afternoon Slots (1:00 PM - 4:00 PM)')}
          ${renderSlotList(eveningSlots, 'Evening Slots (4:30 PM - 8:00 PM)')}
        </div>
      </div>
    `;
  }

  selectSlot(time) {
    this.state.selectedSlot = time;
    this.renderStep4Slots();
    this.updateNavButtons();
  }

  // ================= STEP 5: Patient Form =================
  renderStep5PatientForm() {
    // Populate form fields from state if returning to this step
    const nameInput = document.getElementById('patientNameInput');
    const mobileInput = document.getElementById('patientMobileInput');
    const emailInput = document.getElementById('patientEmailInput');
    const reasonInput = document.getElementById('patientReasonInput');

    if (nameInput) nameInput.value = this.state.patientName;
    if (mobileInput) mobileInput.value = this.state.patientMobile;
    if (emailInput) emailInput.value = this.state.patientEmail;
    if (reasonInput) reasonInput.value = this.state.patientReason;

    // Patient type toggles
    const typeButtons = document.querySelectorAll('.patient-type-btn');
    typeButtons.forEach(btn => {
      const type = btn.getAttribute('data-type');
      btn.classList.toggle('active', type === this.state.patientType);
    });

    // Real-time listener bindings
    this.bindPatientFormInputs();
  }

  bindPatientFormInputs() {
    const nameInput = document.getElementById('patientNameInput');
    const mobileInput = document.getElementById('patientMobileInput');
    const emailInput = document.getElementById('patientEmailInput');
    const reasonInput = document.getElementById('patientReasonInput');

    if (nameInput) {
      nameInput.oninput = (e) => {
        this.state.patientName = e.target.value.trim();
        this.updateNavButtons();
      };
    }

    if (mobileInput) {
      mobileInput.oninput = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 10) val = val.substring(0, 10);
        e.target.value = val;
        this.state.patientMobile = val;
        this.updateNavButtons();
      };
    }

    if (emailInput) {
      emailInput.oninput = (e) => {
        this.state.patientEmail = e.target.value.trim();
        this.updateNavButtons();
      };
    }

    if (reasonInput) {
      reasonInput.oninput = (e) => {
        this.state.patientReason = e.target.value;
      };
    }
  }

  setPatientType(type) {
    this.state.patientType = type;
    const typeButtons = document.querySelectorAll('.patient-type-btn');
    typeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-type') === type);
    });
  }

  setContactPreference(pref) {
    this.state.preferredContact = pref;
    const prefButtons = document.querySelectorAll('.pref-contact-btn');
    prefButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-pref') === pref);
    });
  }

  validatePatientFormSilent() {
    const isNameValid = this.state.patientName.length >= 3;
    const isMobileValid = /^[6-9]\d{9}$/.test(this.state.patientMobile);
    return isNameValid && isMobileValid;
  }

  validatePatientFormWithFeedback() {
    const nameErr = document.getElementById('patientNameError');
    const mobileErr = document.getElementById('patientMobileError');
    const emailErr = document.getElementById('patientEmailError');

    let isValid = true;

    // Reset error messages
    if (nameErr) nameErr.textContent = '';
    if (mobileErr) mobileErr.textContent = '';
    if (emailErr) emailErr.textContent = '';

    if (this.state.patientName.length < 3) {
      if (nameErr) nameErr.textContent = 'Please enter patient full name (at least 3 characters)';
      isValid = false;
    }

    if (!/^[6-9]\d{9}$/.test(this.state.patientMobile)) {
      if (mobileErr) mobileErr.textContent = 'Please enter a valid 10-digit Indian mobile number';
      isValid = false;
    }

    if (this.state.patientEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.state.patientEmail)) {
        if (emailErr) emailErr.textContent = 'Please enter a valid email address (e.g. name@domain.com)';
        isValid = false;
      }
    }

    return isValid;
  }

  // ================= STEP 6: Review & Confirmation =================
  renderStep6Review() {
    const container = document.getElementById('bookingReviewContainer');
    if (!container) return;

    const doc = this.state.doctor;
    const formattedDate = new Date(this.state.selectedDate + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    container.innerHTML = `
      <div class="review-card">
        <div class="review-banner-alert">
          <svg class="w-5 h-5 text-teal-600 inline mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <strong>Appointment Summary Review:</strong>
            <p class="text-xs text-slate-600">Please review your consultation details before finalizing your demo appointment.</p>
          </div>
        </div>

        <div class="review-grid">
          <!-- Doctor & Speciality Details -->
          <div class="review-section">
            <h5 class="review-sec-title">Consultant & Department</h5>
            <div class="review-doc-card">
              <img src="${doc.image}" alt="${doc.name}" onerror="this.src='${doc.fallbackImage}'" class="review-doc-img" />
              <div>
                <h4 class="text-base font-bold text-navy-900">${doc.name}</h4>
                <p class="text-xs text-slate-600">${doc.credentials}</p>
                <span class="inline-block px-2 py-0.5 mt-1 bg-teal-50 text-teal-800 text-xs font-semibold rounded">${this.state.specialityName}</span>
              </div>
            </div>
          </div>

          <!-- Schedule & Location -->
          <div class="review-section">
            <h5 class="review-sec-title">Date & Time Slot</h5>
            <div class="review-data-list">
              <div class="review-row">
                <span class="text-slate-500">Date:</span>
                <span class="font-semibold text-slate-900">${formattedDate}</span>
              </div>
              <div class="review-row">
                <span class="text-slate-500">Consultation Slot:</span>
                <span class="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">${this.state.selectedSlot}</span>
              </div>
              <div class="review-row">
                <span class="text-slate-500">Clinic Location:</span>
                <span class="text-slate-700 text-xs">Shirur Park Road, Vidyanagar, Hubballi</span>
              </div>
              <div class="review-row">
                <span class="text-slate-500">Demo Consultation Fee:</span>
                <span class="font-bold text-slate-900">₹${doc.fee} <small class="text-xs text-slate-500">(Payable at clinic)</small></span>
              </div>
            </div>
          </div>

          <!-- Patient Information -->
          <div class="review-section col-span-full">
            <h5 class="review-sec-title">Patient Profile</h5>
            <div class="review-data-grid-cols">
              <div class="review-data-box">
                <span class="label">Patient Name</span>
                <strong class="val">${this.state.patientName}</strong>
              </div>
              <div class="review-data-box">
                <span class="label">Mobile Number</span>
                <strong class="val">+91 ${this.state.patientMobile}</strong>
              </div>
              <div class="review-data-box">
                <span class="label">Patient Category</span>
                <strong class="val capitalize">${this.state.patientType} Patient</strong>
              </div>
              <div class="review-data-box">
                <span class="label">Reason / Symptoms</span>
                <span class="val text-slate-600">${this.state.patientReason || 'Routine consultation / General check'}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="review-disclaimer-box">
          <label class="flex items-start cursor-pointer space-x-2">
            <input type="checkbox" id="demoDisclaimerCheck" checked class="mt-1 rounded text-teal-600 focus:ring-teal-500" 
                   onchange="window.bookingEngine.toggleDisclaimer(this.checked)" />
            <span class="text-xs text-slate-600">
              <strong>Demo Confirmation:</strong> I understand that CarePlus is a simulated healthcare clinic demo built by GrowthCraft Studio. This reservation simulates the appointment workflow and saves locally to test frontend capabilities.
            </span>
          </label>
        </div>
      </div>
    `;

    this.updateNavButtons();
  }

  toggleDisclaimer(checked) {
    this.state.disclaimerAccepted = checked;
    this.updateNavButtons();
  }

  // ================= SUBMISSION & CONFIRMATION =================
  submitAppointment() {
    // Generate clean unique booking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `CP-HUB-${new Date().getFullYear()}-${randomSuffix}`;

    const newBooking = {
      id: bookingId,
      doctorId: this.state.doctor.id,
      doctorName: this.state.doctor.name,
      doctorImage: this.state.doctor.image,
      specialityName: this.state.specialityName,
      date: this.state.selectedDate,
      slot: this.state.selectedSlot,
      patientName: this.state.patientName,
      patientMobile: this.state.patientMobile,
      patientEmail: this.state.patientEmail,
      patientType: this.state.patientType,
      patientReason: this.state.patientReason,
      preferredContact: this.state.preferredContact,
      fee: this.state.doctor.fee,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    // Save to localStorage
    this.saveBooking(newBooking);

    // Hide steps wizard & show confirmation screen
    for (let i = 1; i <= this.totalSteps; i++) {
      const el = document.getElementById(`bookingStep${i}`);
      if (el) el.style.display = 'none';
    }
    const navBar = document.getElementById('bookingModalNavBar');
    if (navBar) navBar.style.display = 'none';
    const stepIndicators = document.getElementById('bookingStepIndicators');
    if (stepIndicators) stepIndicators.style.display = 'none';

    this.renderConfirmationScreen(newBooking);
  }

  renderConfirmationScreen(booking) {
    const container = document.getElementById('bookingConfirmationContainer');
    if (!container) return;

    container.style.display = 'block';

    const formattedDate = new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    container.innerHTML = `
      <div class="confirmation-card animate-fade-in" id="printableConfirmationSlip">
        <div class="conf-badge-pill">
          <span class="conf-pulse"></span>
          <span>Simulated Appointment Confirmed (Demo)</span>
        </div>

        <div class="conf-success-icon">
          <svg class="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h3 class="conf-title">Demo Appointment Confirmed!</h3>
        <p class="conf-subtitle">A simulated confirmation SMS has been prepared for <strong class="text-slate-900">+91 ${booking.patientMobile}</strong>.</p>

        <div class="conf-ref-box">
          <span class="ref-label">Booking Reference Number</span>
          <span class="ref-code">${booking.id}</span>
          <span class="ref-hint">Present this code at reception upon arrival (Simulated)</span>
        </div>

        <div class="conf-details-table">
          <div class="conf-row">
            <span class="conf-prop">Patient Name:</span>
            <span class="conf-val font-semibold">${booking.patientName}</span>
          </div>
          <div class="conf-row">
            <span class="conf-prop">Consulting Doctor:</span>
            <span class="conf-val font-semibold text-teal-700">${booking.doctorName}</span>
          </div>
          <div class="conf-row">
            <span class="conf-prop">Department:</span>
            <span class="conf-val">${booking.specialityName}</span>
          </div>
          <div class="conf-row">
            <span class="conf-prop">Appointment Date:</span>
            <span class="conf-val font-semibold">${formattedDate}</span>
          </div>
          <div class="conf-row">
            <span class="conf-prop">Time Slot:</span>
            <span class="conf-val font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">${booking.slot}</span>
          </div>
          <div class="conf-row">
            <span class="conf-prop">Clinic Location:</span>
            <span class="conf-val text-xs">CarePlus Clinic, Shirur Park Road, Vidyanagar, Hubballi</span>
          </div>
          <div class="conf-row">
            <span class="conf-prop">Consultation Fee:</span>
            <span class="conf-val font-bold text-slate-900">₹${booking.fee} <small class="text-xs text-slate-500">(Pay at Clinic)</small></span>
          </div>
        </div>

        <!-- Action CTAs -->
        <div class="conf-actions-cluster no-print">
          <button type="button" class="btn-action-outline" onclick="window.bookingEngine.downloadIcsCalendar('${booking.id}')">
            <svg class="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Add to Calendar (.ics)
          </button>
          
          <button type="button" class="btn-action-outline" onclick="window.bookingEngine.printAppointmentSlip()">
            <svg class="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Print Appointment Slip
          </button>

          <button type="button" class="btn-action-primary" onclick="window.bookingEngine.closeBookingWizard(); window.bookingEngine.openMyBookings();">
            <svg class="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            View in 'My Bookings'
          </button>
        </div>

        <div class="conf-footer-nav no-print">
          <button type="button" class="text-sm font-medium text-slate-500 hover:text-slate-800 underline" onclick="window.bookingEngine.closeBookingWizard()">
            Return to Homepage
          </button>
          <span class="mx-2 text-slate-300">•</span>
          <button type="button" class="text-sm font-medium text-teal-600 hover:text-teal-700 underline" onclick="window.bookingEngine.openBookingWizard()">
            Book Another Demo Appointment
          </button>
        </div>
      </div>
    `;

    // Trigger toast notification
    if (window.showToast) {
      window.showToast('Appointment successfully scheduled in demo store!', 'success');
    }
  }

  // Generate .ics calendar file for download
  downloadIcsCalendar(bookingId) {
    const booking = this.getAllBookings().find(b => b.id === bookingId);
    if (!booking) return;

    const summary = `Doctor Consultation: ${booking.doctorName} (${booking.specialityName})`;
    const description = `CarePlus Multispeciality Clinic Demo Appointment\\nBooking Reference: ${booking.id}\\nPatient: ${booking.patientName}\\nLocation: Shirur Park Road, Vidyanagar, Hubballi`;
    const location = `CarePlus Multispeciality Clinic, Vidyanagar, Hubballi, Karnataka`;

    const startIso = booking.date.replace(/-/g, '') + 'T090000Z';
    const endIso = booking.date.replace(/-/g, '') + 'T100000Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//GrowthCraft Studio//CarePlus Clinic Demo//EN',
      'BEGIN:VEVENT',
      `UID:${booking.id}@careplusclinicdemo.in`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `CarePlus-Appointment-${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.showToast) {
      window.showToast('Calendar event file (.ics) downloaded!', 'info');
    }
  }

  printAppointmentSlip() {
    window.print();
  }

  // ================= MY BOOKINGS DRAWER / MODAL =================
  openMyBookings() {
    const modal = document.getElementById('myBookingsModal');
    if (!modal) return;

    this.renderMyBookingsList();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeMyBookings() {
    const modal = document.getElementById('myBookingsModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  renderMyBookingsList() {
    const container = document.getElementById('myBookingsListContainer');
    if (!container) return;

    const bookings = this.getAllBookings();

    if (bookings.length === 0) {
      container.innerHTML = `
        <div class="empty-bookings-box">
          <div class="empty-icon-circle">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <h4>No Appointments Booked Yet</h4>
          <p>Test the 6-step appointment booking engine to create your first simulated reservation.</p>
          <button class="btn-primary-sm mt-4" onclick="window.bookingEngine.closeMyBookings(); window.bookingEngine.openBookingWizard();">
            Book Demo Appointment
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = bookings.map(b => {
      const formattedDate = new Date(b.date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return `
        <div class="my-booking-card" id="bookingCard-${b.id}">
          <div class="my-booking-head">
            <div>
              <span class="ref-pill">${b.id}</span>
              <h4 class="text-base font-bold text-navy-900 mt-1">${b.doctorName}</h4>
              <p class="text-xs text-slate-500">${b.specialityName}</p>
            </div>
            <span class="status-pill-confirmed">Confirmed Demo</span>
          </div>

          <div class="my-booking-info-grid">
            <div class="info-cell">
              <span class="lbl">Date & Slot</span>
              <span class="val font-semibold">${formattedDate} • ${b.slot}</span>
            </div>
            <div class="info-cell">
              <span class="lbl">Patient</span>
              <span class="val">${b.patientName} (+91 ${b.patientMobile})</span>
            </div>
            <div class="info-cell">
              <span class="lbl">Consultation Fee</span>
              <span class="val font-bold text-slate-800">₹${b.fee || 500} <small class="text-xs text-slate-400">(Demo)</small></span>
            </div>
          </div>

          <div class="my-booking-actions">
            <button type="button" class="btn-text-danger" onclick="window.bookingEngine.confirmCancelBooking('${b.id}')">
              Cancel Appointment
            </button>
            <div class="space-x-2">
              <button type="button" class="btn-action-outline-sm" onclick="window.bookingEngine.downloadIcsCalendar('${b.id}')">
                Save .ics
              </button>
              <button type="button" class="btn-action-teal-sm" onclick="window.bookingEngine.rescheduleBooking('${b.id}')">
                Reschedule Slot
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  confirmCancelBooking(bookingId) {
    if (confirm(`Are you sure you want to cancel demo appointment ${bookingId}?`)) {
      this.cancelBooking(bookingId);
      this.renderMyBookingsList();
      if (window.showToast) {
        window.showToast(`Demo appointment ${bookingId} cancelled.`, 'warning');
      }
    }
  }

  rescheduleBooking(bookingId) {
    const booking = this.getAllBookings().find(b => b.id === bookingId);
    if (!booking) return;

    // Delete existing and re-open wizard with doctor preselected
    this.cancelBooking(bookingId);
    this.closeMyBookings();
    this.openBookingWizard({ doctorId: booking.doctorId });
    if (window.showToast) {
      window.showToast('Please select a new date and time slot to reschedule.', 'info');
    }
  }

  // ================= EVENT BINDINGS =================
  bindGlobalEvents() {
    // Top banner & nav triggers
    document.querySelectorAll('.trigger-booking-wizard').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const specId = btn.getAttribute('data-speciality');
        const docId = btn.getAttribute('data-doctor');
        this.openBookingWizard({ specialityId: specId, doctorId: docId });
      });
    });

    document.querySelectorAll('.trigger-my-bookings').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openMyBookings();
      });
    });

    // Close buttons
    const closeWizardBtn = document.getElementById('closeBookingWizardBtn');
    if (closeWizardBtn) {
      closeWizardBtn.addEventListener('click', () => this.closeBookingWizard());
    }

    const closeMyBookingsBtn = document.getElementById('closeMyBookingsBtn');
    if (closeMyBookingsBtn) {
      closeMyBookingsBtn.addEventListener('click', () => this.closeMyBookings());
    }

    // Modal background click close
    const bookingModal = document.getElementById('bookingModal');
    if (bookingModal) {
      bookingModal.addEventListener('click', (e) => {
        if (e.target === bookingModal) this.closeBookingWizard();
      });
    }

    const myBookingsModal = document.getElementById('myBookingsModal');
    if (myBookingsModal) {
      myBookingsModal.addEventListener('click', (e) => {
        if (e.target === myBookingsModal) this.closeMyBookings();
      });
    }

    // Prev / Next button bindings
    const prevBtn = document.getElementById('bookingPrevBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.goToPrevStep());
    }

    const nextBtn = document.getElementById('bookingNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.goToNextStep());
    }
  }

  // SVG Helper
  getSpecialitySvgIcon(type) {
    switch(type) {
      case 'stethoscope':
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"></path></svg>`;
      case 'baby':
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
      case 'sparkles':
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>`;
      case 'heart-handshake':
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>`;
      case 'clipboard-check':
      default:
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>`;
    }
  }
}

// Instantiate globally
document.addEventListener('DOMContentLoaded', () => {
  window.bookingEngine = new BookingEngine();
});
