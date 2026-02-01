/* ========= script.js (Normal JS) ========= */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const nav = document.querySelector("header nav");
  const toggle = document.querySelector(".toggle-menu");
  const toTopBtn = document.getElementById("toTopBtn");

  /* Sticky header on scroll */
  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 30);

    if (toTopBtn) {
      toTopBtn.classList.toggle("show", window.scrollY > 350);
    }
  });

  /* Mobile menu toggle */
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });

    // close menu when clicking any link
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => nav.classList.remove("active"));
    });

    // close when clicking outside
    document.addEventListener("click", (e) => {
      const isInside = nav.contains(e.target) || toggle.contains(e.target);
      if (!isInside) nav.classList.remove("active");
    });
  }

  /* Scroll to top */
  if (toTopBtn) {
    toTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Intersection Observer reveal animations */
  const revealEls = document.querySelectorAll(
    ".section-title, .service-card, .project-card, .team-card, .testimonial-card, .blog-card, .hero-container, .hero-stats > div"
  );

  revealEls.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("reveal-show");
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => io.observe(el));
});