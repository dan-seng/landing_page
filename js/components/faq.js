export class FAQComponent {
  constructor(selector = '.faq-question') {
    this.questions = document.querySelectorAll(selector);
  }

  init() {
    this.questions.forEach((button) => {
      button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        this.questions.forEach((question) => {
          question.setAttribute('aria-expanded', 'false');
          const answer = question.nextElementSibling;
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
  }
}
