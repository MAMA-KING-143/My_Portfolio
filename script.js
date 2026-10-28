const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = document.querySelectorAll(".nav-link");
const backToTop = document.getElementById("backToTop");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 350);
  let currentSection = "home";
  document.querySelectorAll("main section[id]").forEach((section) => {
    if (window.scrollY >= section.offsetTop - 130) currentSection = section.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
  });
});

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.getElementById("year").textContent = new Date().getFullYear();

// This front-end demo does not send email. Connect a backend or form service to receive messages.
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Thanks! This demo form is working in your browser, but messages are not sent yet.";
  contactForm.reset();
});

// These are placeholders: replace # with your real profile URLs before publishing.
document.querySelectorAll(".placeholder-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    formStatus.textContent = "Replace this placeholder with your real social profile link.";
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });
});


document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
        const link = card.querySelector("a[href]");

        if (link && link.getAttribute("href") !== "#") {
            window.open(link.href, "_blank", "noopener,noreferrer");
        }
    });
});
document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", event => {
        if (event.target.closest("a")) return;

        const link = card.dataset.link;

        if (link) {
            window.open(link, "_blank", "noopener,noreferrer");
        }
    });
});