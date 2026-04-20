export class FAQComponent {
  constructor(selector = '.faq-question') {
    this.questions = Array.from(document.querySelectorAll(selector));
    this.animations = new WeakMap();
    this.animationDuration = 280;
  }

  init() {
    if (!this.questions.length) {
      return;
    }

    this.setupA11yBindings();

    this.questions.forEach((button) => {
      button.addEventListener('click', () => this.toggle(button));
      button.addEventListener('keydown', (event) => this.handleKeydown(event, button));
    });
  }

  setupA11yBindings() {
    this.questions.forEach((button, index) => {
      const answer = button.nextElementSibling;
      if (!answer) {
        return;
      }

      const questionId = button.id || `faq-question-${index + 1}`;
      const answerId = answer.id || `faq-answer-${index + 1}`;

      button.id = questionId;
      button.setAttribute('aria-controls', answerId);
      button.setAttribute('aria-expanded', 'false');

      answer.id = answerId;
      answer.setAttribute('role', 'region');
      answer.setAttribute('aria-labelledby', questionId);
      answer.style.height = '0px';
      answer.style.overflow = 'hidden';
    });
  }

  handleKeydown(event, button) {
    const index = this.questions.indexOf(button);
    if (index < 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.questions[(index + 1) % this.questions.length].focus();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.questions[(index - 1 + this.questions.length) % this.questions.length].focus();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this.questions[0].focus();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this.questions[this.questions.length - 1].focus();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle(button);
    }
  }

  toggle(button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const targetAnswer = button.nextElementSibling;

    this.questions.forEach((question) => {
      if (question === button && !isExpanded) {
        return;
      }
      this.collapse(question);
    });

    if (!isExpanded && targetAnswer) {
      this.expand(button, targetAnswer);
    }
  }

  expand(button, answer) {
    button.setAttribute('aria-expanded', 'true');
    this.animateHeight(answer, true);
  }

  collapse(button) {
    button.setAttribute('aria-expanded', 'false');
    const answer = button.nextElementSibling;
    if (answer) {
      this.animateHeight(answer, false);
    }
  }

  animateHeight(answer, expand) {
    const existingAnimation = this.animations.get(answer);
    if (existingAnimation) {
      cancelAnimationFrame(existingAnimation);
    }

    const fromHeight = answer.getBoundingClientRect().height;
    if (expand) {
      answer.style.height = 'auto';
    }
    const toHeight = expand ? answer.scrollHeight : 0;
    answer.style.height = `${fromHeight}px`;
    answer.style.overflow = 'hidden';
    answer.style.willChange = 'height';

    const startTime = performance.now();
    const duration = this.animationDuration;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentHeight = fromHeight + (toHeight - fromHeight) * eased;
      answer.style.height = `${currentHeight}px`;

      if (progress < 1) {
        const animationId = requestAnimationFrame(step);
        this.animations.set(answer, animationId);
        return;
      }

      answer.style.height = expand ? 'auto' : '0px';
      answer.style.willChange = '';
      this.animations.delete(answer);
    };

    const animationId = requestAnimationFrame(step);
    this.animations.set(answer, animationId);
  }
}
