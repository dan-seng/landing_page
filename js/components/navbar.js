export class NavbarComponent {
  constructor({ navSelector = '.top-nav', linkSelector = '.nav-links a' } = {}) {
    this.nav = document.querySelector(navSelector);
    this.links = document.querySelectorAll(linkSelector);
    this.sections = [];
    this.scrollAnimationFrame = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  init() {
    if (!this.nav) {
      return;
    }

    this.sections = Array.from(this.links)
      .map((link) => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) {
          return null;
        }

        const section = document.querySelector(href);
        if (!section) {
          return null;
        }

        return { link, section };
      })
      .filter(Boolean);

    this.updateNavState();
    this.updateActiveLink();
    this.bindLinkClicks();

    window.addEventListener('scroll', () => {
      this.updateNavState();
      this.updateActiveLink();
    });
  }

  bindLinkClicks() {
    this.links.forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) {
          return;
        }

        const targetSection = document.querySelector(href);
        if (!targetSection) {
          return;
        }

        event.preventDefault();
        this.smoothScrollToSection(targetSection);
      });
    });
  }

  smoothScrollToSection(section) {
    const offset = this.getHeaderOffset();
    const startY = window.scrollY;
    const targetY = Math.max(0, section.getBoundingClientRect().top + startY - offset);
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) {
      return;
    }

    if (this.scrollAnimationFrame) {
      cancelAnimationFrame(this.scrollAnimationFrame);
    }

    if (this.prefersReducedMotion.matches) {
      window.scrollTo(0, targetY);
      this.updateActiveLink();
      return;
    }

    const duration = 720;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        this.scrollAnimationFrame = requestAnimationFrame(step);
        return;
      }

      this.scrollAnimationFrame = null;
      this.updateActiveLink();
    };

    this.scrollAnimationFrame = requestAnimationFrame(step);
  }

  getHeaderOffset() {
    return this.nav ? this.nav.getBoundingClientRect().height + 14 : 80;
  }

  easeInOutCubic(progress) {
    if (progress < 0.5) {
      return 4 * progress * progress * progress;
    }
    return 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  updateNavState() {
    this.nav.classList.toggle('is-scrolled', window.scrollY > 14);
  }

  updateActiveLink() {
    if (!this.sections.length) {
      return;
    }

    const pivot = window.scrollY + this.getHeaderOffset() + 40;
    let activeItem = this.sections[0];

    this.sections.forEach((item) => {
      if (item.section.offsetTop <= pivot) {
        activeItem = item;
      }
    });

    this.links.forEach((link) => {
      link.classList.toggle('is-active', link === activeItem.link);
    });
  }
}
