export class ScrollAnimationManager {
  constructor({ threshold = 0.18, rootMargin = '0px 0px -9% 0px' } = {}) {
    this.animatedElements = new Set();
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersections(entries),
      { threshold, rootMargin },
    );
  }

  registerAnimationTarget(
    element,
    { animationClass = 'anim-fade-up', delay = null } = {},
  ) {
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

    this.animatedElements.add(element);
  }

  registerSections(selector = '.fade-section') {
    document.querySelectorAll(selector).forEach((section) => {
      this.registerAnimationTarget(section, {
        animationClass: 'anim-fade-up',
        delay: 0,
      });
    });
  }

  setupStaggeredSections(selector = '[data-stagger]') {
    document.querySelectorAll(selector).forEach((section) => {
      const staggerSelector = section.dataset.stagger;
      if (!staggerSelector) {
        return;
      }

      const staggerStep = Number(section.dataset.staggerStep || 100);
      const staggerStart = Number(section.dataset.staggerStart || 80);
      const staggerAnimation = section.dataset.staggerAnim || 'anim-fade-up';
      const staggerItems = section.querySelectorAll(staggerSelector);

      staggerItems.forEach((item, index) => {
        this.registerAnimationTarget(item, {
          animationClass: item.dataset.animClass || staggerAnimation,
          delay: staggerStart + index * staggerStep,
        });
      });
    });
  }

  observe() {
    document.querySelectorAll('.animate-on-scroll').forEach((target) => {
      this.animatedElements.add(target);
    });

    this.animatedElements.forEach((target) => {
      this.observer.observe(target);
    });
  }

  handleIntersections(entries) {
    entries.forEach((entry) => {
      const activeClass = entry.target.dataset.activeClass || 'is-visible';
      const reverseOnExit = entry.target.dataset.reverseOnExit !== 'false';

      if (entry.isIntersecting) {
        entry.target.classList.remove('is-leaving');
        entry.target.classList.add(activeClass);
      } else if (reverseOnExit) {
        entry.target.classList.add('is-leaving');
        entry.target.classList.remove(activeClass);
      }

      if (entry.isIntersecting && entry.target.dataset.animateOnce === 'true') {
        this.observer.unobserve(entry.target);
      }
    });
  }
}
