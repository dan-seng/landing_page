export class NavbarComponent {
  constructor({ navSelector = '.top-nav', linkSelector = '.nav-links a' } = {}) {
    this.nav = document.querySelector(navSelector);
    this.links = document.querySelectorAll(linkSelector);
    this.sections = [];
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

    window.addEventListener('scroll', () => {
      this.updateNavState();
      this.updateActiveLink();
    });
  }

  updateNavState() {
    this.nav.classList.toggle('is-scrolled', window.scrollY > 14);
  }

  updateActiveLink() {
    if (!this.sections.length) {
      return;
    }

    const pivot = window.scrollY + 140;
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
