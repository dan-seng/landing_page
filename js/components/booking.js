export class BookingComponent {
  constructor() {
    this.bookingModal = document.getElementById('bookingModal');
    this.bookingForm = document.getElementById('bookingForm');
    this.bookingSummary = document.getElementById('bookingSummary');
    this.checkInDateInput = document.getElementById('checkInDate');
    this.checkOutDateInput = document.getElementById('checkOutDate');
    this.guestCountOutput = document.getElementById('guestCount');
    this.guestCountInput = document.getElementById('guestCountInput');
    this.guestButtons = document.querySelectorAll('[data-guest-action]');
    this.bookingTriggers = document.querySelectorAll('[data-book-trigger]');
    this.bookingCloseControls = document.querySelectorAll('[data-book-close]');

    this.MIN_GUESTS = 1;
    this.MAX_GUESTS = 8;
    this.guestCount = 2;
    this.lastFocusedTrigger = null;
  }

  init() {
    if (!this.bookingModal) {
      return;
    }

    this.bookingTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => this.open(trigger));
    });

    this.bookingCloseControls.forEach((closeControl) => {
      closeControl.addEventListener('click', () => this.close());
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.bookingModal.classList.contains('open')) {
        this.close();
      }
    });

    this.guestButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (button.dataset.guestAction === 'increment' && this.guestCount < this.MAX_GUESTS) {
          this.guestCount += 1;
        }

        if (button.dataset.guestAction === 'decrement' && this.guestCount > this.MIN_GUESTS) {
          this.guestCount -= 1;
        }

        this.updateGuestUi();
      });
    });

    this.checkInDateInput?.addEventListener('change', () => {
      this.syncCheckoutMinDate();
      this.updateBookingSummary();
    });

    this.checkOutDateInput?.addEventListener('change', () => {
      if (this.checkOutDateInput.value <= this.checkInDateInput.value) {
        this.syncCheckoutMinDate();
      }
      this.updateBookingSummary();
    });

    this.bookingForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      this.updateBookingSummary();
      this.close();
    });
  }

  formatDate(value) {
    if (!value) {
      return '';
    }

    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  updateBookingSummary() {
    if (!this.bookingSummary) {
      return;
    }

    const checkIn = this.formatDate(this.checkInDateInput?.value);
    const checkOut = this.formatDate(this.checkOutDateInput?.value);

    if (checkIn && checkOut) {
      this.bookingSummary.textContent = `${this.guestCount} guest${this.guestCount > 1 ? 's' : ''}, ${checkIn} to ${checkOut}.`;
      return;
    }

    this.bookingSummary.textContent = `${this.guestCount} guest${this.guestCount > 1 ? 's' : ''}, select your check-in and check-out dates.`;
  }

  updateGuestUi() {
    if (this.guestCountOutput) {
      this.guestCountOutput.textContent = String(this.guestCount);
    }

    if (this.guestCountInput) {
      this.guestCountInput.value = String(this.guestCount);
    }

    this.guestButtons.forEach((button) => {
      if (button.dataset.guestAction === 'decrement') {
        button.disabled = this.guestCount <= this.MIN_GUESTS;
      }
      if (button.dataset.guestAction === 'increment') {
        button.disabled = this.guestCount >= this.MAX_GUESTS;
      }
    });

    this.updateBookingSummary();
  }

  toDateInputValue(date) {
    return date.toISOString().split('T')[0];
  }

  setDateDefaults() {
    if (!this.checkInDateInput || !this.checkOutDateInput) {
      return;
    }

    const today = new Date();
    const tomorrow = new Date(today);
    const dayAfter = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    dayAfter.setDate(today.getDate() + 2);

    const minCheckIn = this.toDateInputValue(tomorrow);
    this.checkInDateInput.min = minCheckIn;
    this.checkOutDateInput.min = this.toDateInputValue(dayAfter);

    if (!this.checkInDateInput.value) {
      this.checkInDateInput.value = minCheckIn;
    }

    if (!this.checkOutDateInput.value) {
      this.checkOutDateInput.value = this.toDateInputValue(dayAfter);
    }
  }

  syncCheckoutMinDate() {
    if (!this.checkInDateInput?.value || !this.checkOutDateInput) {
      return;
    }

    const checkInDate = new Date(`${this.checkInDateInput.value}T00:00:00`);
    const nextDay = new Date(checkInDate);
    nextDay.setDate(checkInDate.getDate() + 1);
    const minCheckout = this.toDateInputValue(nextDay);
    this.checkOutDateInput.min = minCheckout;

    if (!this.checkOutDateInput.value || this.checkOutDateInput.value <= this.checkInDateInput.value) {
      this.checkOutDateInput.value = minCheckout;
    }
  }

  open(trigger) {
    this.lastFocusedTrigger = trigger || null;
    this.setDateDefaults();
    this.syncCheckoutMinDate();
    this.updateGuestUi();
    this.bookingModal.classList.add('open');
    this.bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    this.checkInDateInput?.focus();
  }

  close() {
    this.bookingModal.classList.remove('open');
    this.bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (this.lastFocusedTrigger) {
      this.lastFocusedTrigger.focus();
    }
  }
}
