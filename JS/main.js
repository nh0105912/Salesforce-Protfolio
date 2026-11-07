// ---- Edit this: the address that receives contact-form messages ----
const CONTACT_EMAIL = "your.email@example.com";

const menuBtn = document.querySelector("#menu-icon");
const menuIcon = menuBtn.querySelector("i");
const navbar = document.querySelector(".navbar");
const header = document.querySelector(".header");

function setMenu(open) {
  navbar.classList.toggle("active", open);
  menuIcon.classList.toggle("bx-x", open);
  menuIcon.classList.toggle("bx-menu", !open);
  menuBtn.setAttribute("aria-expanded", String(open));
}
menuBtn.addEventListener("click", () => setMenu(!navbar.classList.contains("active")));
navbar.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });

// Highlight the nav link of the section in view
const links = document.querySelectorAll(".navbar a");
const sections = document.querySelectorAll("section[id]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => observer.observe(s));

window.addEventListener("scroll", () => {
  header.classList.toggle("sticky", window.scrollY > 50);
}, { passive: true });

// Reveal sections once as they enter view (skipped if reduced motion is on)
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce && "IntersectionObserver" in window) {
  const targets = document.querySelectorAll(".skill-card, .timeline-item, .proj-card, .portfolio-box");
  targets.forEach((t) => t.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  targets.forEach((t) => io.observe(t));
}

// Typing effect
new Typed(".Multiple-task", {
  strings: ["Administrator", "Flow Builder", "Junior Developer"],
  typeSpeed: reduce ? 0 : 80,
  backSpeed: reduce ? 0 : 50,
  backDelay: 1500,
  loop: !reduce,
});

// Contact section: show the real email in the contact card
const emailLink = document.querySelector("#email-link");
emailLink.href = `mailto:${CONTACT_EMAIL}`;
document.querySelector("#email-text").textContent = CONTACT_EMAIL;

// Contact form: validation, loading state, and a clear success message
const form = document.querySelector("#contact-form");
const statusEl = form.querySelector(".form-status");
const sendBtn = form.querySelector(".send-btn");
const btnLabel = sendBtn.querySelector(".btn-label");

function validateField(field) {
  const input = field.querySelector("input, textarea");
  const err = field.querySelector(".error");
  let msg = "";
  if (input.validity.valueMissing) msg = "This field is required.";
  else if (input.validity.typeMismatch) msg = "Enter a valid email address.";
  else if (input.validity.tooShort) msg = `Write at least ${input.minLength} characters.`;
  err.textContent = msg;
  field.classList.toggle("invalid", Boolean(msg));
  return !msg;
}

form.querySelectorAll(".field").forEach((field) => {
  const input = field.querySelector("input, textarea");
  input.addEventListener("blur", () => validateField(field));
  input.addEventListener("input", () => { if (field.classList.contains("invalid")) validateField(field); });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  statusEl.className = "form-status";

  const fields = [...form.querySelectorAll(".field")];
  const allValid = fields.map(validateField).every(Boolean);
  if (!allValid) {
    form.querySelector(".field.invalid input, .field.invalid textarea").focus();
    return;
  }

  const f = new FormData(form);
  const body = `${f.get("message")}\n\nFrom: ${f.get("name")} (${f.get("email")})`;
  const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(f.get("subject"))}&body=${encodeURIComponent(body)}`;

  sendBtn.disabled = true;
  btnLabel.textContent = "Opening email…";
  setTimeout(() => {
    window.location.href = url;
    form.reset();
    fields.forEach((fl) => fl.classList.remove("invalid"));
    sendBtn.disabled = false;
    btnLabel.textContent = "Send message";
    statusEl.classList.add("success");
    statusEl.textContent = `Your email app should open with the message ready. If it doesn't, write to ${CONTACT_EMAIL}.`;
  }, 600);
});


// Placeholder project links (href="#") should not jump to the top of the page
document.querySelectorAll('.portfolio-layer a[href="#"]').forEach((a) =>
  a.addEventListener("click", (e) => e.preventDefault())
);
