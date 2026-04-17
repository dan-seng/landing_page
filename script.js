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
