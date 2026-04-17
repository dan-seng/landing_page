const sections = document.querySelectorAll(".fade-section");
const reveal = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        reveal.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

sections.forEach((section) => reveal.observe(section));

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";

    faqQuestions.forEach((q) => {
      q.setAttribute("aria-expanded", "false");
      const answer = q.nextElementSibling;
      if (answer) {
        answer.style.maxHeight = null;
      }
    });

    if (!isExpanded) {
      button.setAttribute("aria-expanded", "true");
      const answer = button.nextElementSibling;
      if (answer) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    }
  });
});
