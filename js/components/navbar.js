export class NavbarComponent {
  constructor({
    navSelector = '[data-navbar]',
    linkSelector = '[data-nav-links] a',
    menuButtonSelector = '[data-nav-toggle]',
    menuPanelSelector = '[data-nav-panel]',
  } = {}) {
    this.nav = document.querySelector(navSelector);
    this.links = document.querySelectorAll(linkSelector);
    this.menuButton = document.querySelector(menuButtonSelector);
    this.menuPanel = document.querySelector(menuPanelSelector);
    this.sections = [];
    this.scrollAnimationFrame = null;
    this.isMenuOpen = false;
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
    this.bindMobileMenu();

    window.addEventListener('scroll', () => {
      this.updateNavState();
      this.updateActiveLink();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
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
        this.closeMobileMenu();
      });
    });
  }

  bindMobileMenu() {
    if (!this.menuButton || !this.menuPanel) {
      return;
    }

    this.menuButton.addEventListener('click', () => {
      if (this.isMenuOpen) {
        this.closeMobileMenu();
        return;
      }

      this.openMobileMenu();
    });
  }

  openMobileMenu() {
    if (!this.menuButton || !this.menuPanel) {
      return;
    }

    this.isMenuOpen = true;
    this.menuButton.setAttribute('aria-expanded', 'true');
    this.menuButton.textContent = 'Close';
    this.menuPanel.classList.remove('hidden');
  }

  closeMobileMenu() {
    if (!this.menuButton || !this.menuPanel) {
      return;
    }

    this.isMenuOpen = false;
    this.menuButton.setAttribute('aria-expanded', 'false');
    this.menuButton.textContent = 'Menu';
    this.menuPanel.classList.add('hidden');
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
    if (!this.nav) {
      return;
    }

    const isScrolled = window.scrollY > 14;
    this.nav.classList.toggle('is-scrolled', isScrolled);
    this.nav.classList.toggle('bg-slate-950/65', !isScrolled);
    this.nav.classList.toggle('bg-slate-950/85', isScrolled);
    this.nav.classList.toggle('border-white/10', !isScrolled);
    this.nav.classList.toggle('border-white/20', isScrolled);
    this.nav.classList.toggle('shadow-none', !isScrolled);
    this.nav.classList.toggle('shadow-[0_16px_45px_rgba(2,6,23,0.45)]', isScrolled);
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
      const isActive = link === activeItem.link;
      link.classList.toggle('is-active', isActive);
      link.classList.toggle('bg-white/15', isActive);
      link.classList.toggle('text-cyan-200', isActive);
      link.classList.toggle('shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]', isActive);
    });
  }
}
