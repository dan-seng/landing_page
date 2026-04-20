const animatedElements = new Set();

const registerAnimationTarget = (
  element,
  { animationClass = 'anim-fade-up', delay = null } = {},
) => {
  if (!element) {
    return;
  }

  element.classList.add('animate-on-scroll');

  if (animationClass) {
    element.classList.add(animationClass);
  }

  if (delay !== null) {
    element.style.setProperty('--anim-delay', `${delay}ms`);
  }

  animatedElements.add(element);
};

const setupStaggeredSections = () => {
  const staggeredSections = document.querySelectorAll('[data-stagger]');

  staggeredSections.forEach((section) => {
    const selector = section.dataset.stagger;
    if (!selector) {
      return;
    }

    const staggerStep = Number(section.dataset.staggerStep || 100);
    const staggerStart = Number(section.dataset.staggerStart || 80);
    const staggerAnimation = section.dataset.staggerAnim || 'anim-fade-up';
    const staggerItems = section.querySelectorAll(selector);

    staggerItems.forEach((item, index) => {
      registerAnimationTarget(item, {
        animationClass: item.dataset.animClass || staggerAnimation,
        delay: staggerStart + index * staggerStep,
      });
    });
  });
};

document.querySelectorAll('.fade-section').forEach((section) => {
  registerAnimationTarget(section, { animationClass: 'anim-fade-up', delay: 0 });
});

setupStaggeredSections();

const imageTargets = document.querySelectorAll(
  '.room-card img, .amenity-photo img, .experience-card img, .gallery-grid img',
);
const imageVariants = [
  'anim-rise-left',
  'anim-rise-right',
  'anim-zoom-in',
  'anim-tilt-up',
  'anim-curtain',
];
const colorPalette = ['#0f636b', '#b89056', '#ef7f55', '#3b7dd8', '#8f5bd0'];

imageTargets.forEach((img, index) => {
  img.classList.add('scroll-image');
  let variant = imageVariants[index % imageVariants.length];
  if (img.closest('.gallery-grid') && variant === 'anim-curtain') {
    variant = 'anim-zoom-in';
  }
  img.classList.add(variant);
  img.style.setProperty('--glow-color', colorPalette[index % colorPalette.length]);
  registerAnimationTarget(img, { animationClass: null, delay: (index % 4) * 90 });
});

document.querySelectorAll('.animate-on-scroll').forEach((target) => {
  animatedElements.add(target);
});

const scrollAnimationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const activeClass = entry.target.dataset.activeClass || 'is-visible';
      entry.target.classList.toggle(activeClass, entry.isIntersecting);

      if (
        entry.isIntersecting &&
        entry.target.dataset.animateOnce === 'true'
      ) {
        scrollAnimationObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: '0px 0px -9% 0px',
  },
);

animatedElements.forEach((target) => scrollAnimationObserver.observe(target));

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach((button) => {
  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    faqQuestions.forEach((q) => {
      q.setAttribute('aria-expanded', 'false');
      const answer = q.nextElementSibling;
      if (answer) {
        answer.style.maxHeight = null;
      }
    });

    if (!isExpanded) {
      button.setAttribute('aria-expanded', 'true');
      const answer = button.nextElementSibling;
      if (answer) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    }
  });
});

const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const bookingSummary = document.getElementById('bookingSummary');
const checkInDateInput = document.getElementById('checkInDate');
const checkOutDateInput = document.getElementById('checkOutDate');
const guestCountOutput = document.getElementById('guestCount');
const guestCountInput = document.getElementById('guestCountInput');
const guestButtons = document.querySelectorAll('[data-guest-action]');
const bookingTriggers = document.querySelectorAll('[data-book-trigger]');
const bookingCloseControls = document.querySelectorAll('[data-book-close]');

const MIN_GUESTS = 1;
const MAX_GUESTS = 8;
let guestCount = 2;
let lastFocusedTrigger = null;

const formatDate = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const updateBookingSummary = () => {
  const checkIn = formatDate(checkInDateInput.value);
  const checkOut = formatDate(checkOutDateInput.value);

  if (checkIn && checkOut) {
    bookingSummary.textContent = `${guestCount} guest${guestCount > 1 ? 's' : ''}, ${checkIn} to ${checkOut}.`;
    return;
  }

  bookingSummary.textContent = `${guestCount} guest${guestCount > 1 ? 's' : ''}, select your check-in and check-out dates.`;
};

const updateGuestUi = () => {
  guestCountOutput.textContent = String(guestCount);
  guestCountInput.value = String(guestCount);

  guestButtons.forEach((button) => {
    if (button.dataset.guestAction === 'decrement') {
      button.disabled = guestCount <= MIN_GUESTS;
    }
    if (button.dataset.guestAction === 'increment') {
      button.disabled = guestCount >= MAX_GUESTS;
    }
  });

  updateBookingSummary();
};

const toDateInputValue = (date) => date.toISOString().split('T')[0];

const setDateDefaults = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  const dayAfter = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  dayAfter.setDate(today.getDate() + 2);

  const minCheckIn = toDateInputValue(tomorrow);
  checkInDateInput.min = minCheckIn;
  checkOutDateInput.min = toDateInputValue(dayAfter);

  if (!checkInDateInput.value) {
    checkInDateInput.value = minCheckIn;
  }

  if (!checkOutDateInput.value) {
    checkOutDateInput.value = toDateInputValue(dayAfter);
  }
};

const syncCheckoutMinDate = () => {
  if (!checkInDateInput.value) {
    return;
  }

  const checkInDate = new Date(`${checkInDateInput.value}T00:00:00`);
  const nextDay = new Date(checkInDate);
  nextDay.setDate(checkInDate.getDate() + 1);
  const minCheckout = toDateInputValue(nextDay);
  checkOutDateInput.min = minCheckout;

  if (!checkOutDateInput.value || checkOutDateInput.value <= checkInDateInput.value) {
    checkOutDateInput.value = minCheckout;
  }
};

const closeBookingModal = () => {
  if (!bookingModal) {
    return;
  }
  bookingModal.classList.remove('open');
  bookingModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocusedTrigger) {
    lastFocusedTrigger.focus();
  }
};

const openBookingModal = (trigger) => {
  if (!bookingModal) {
    return;
  }
  lastFocusedTrigger = trigger || null;
  setDateDefaults();
  syncCheckoutMinDate();
  updateGuestUi();
  bookingModal.classList.add('open');
  bookingModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  checkInDateInput.focus();
};

bookingTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => openBookingModal(trigger));
});

bookingCloseControls.forEach((closeControl) => {
  closeControl.addEventListener('click', closeBookingModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && bookingModal?.classList.contains('open')) {
    closeBookingModal();
  }
});

guestButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.guestAction === 'increment' && guestCount < MAX_GUESTS) {
      guestCount += 1;
    }
    if (button.dataset.guestAction === 'decrement' && guestCount > MIN_GUESTS) {
      guestCount -= 1;
    }
    updateGuestUi();
  });
});

checkInDateInput?.addEventListener('change', () => {
  syncCheckoutMinDate();
  updateBookingSummary();
});

checkOutDateInput?.addEventListener('change', () => {
  if (checkOutDateInput.value <= checkInDateInput.value) {
    syncCheckoutMinDate();
  }
  updateBookingSummary();
});

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  updateBookingSummary();
  closeBookingModal();
});
