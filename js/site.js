(() => {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navigation = document.querySelector(".nav-links");

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const closeNavigation = () => {
    if (!navToggle || !navigation) return;
    navToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navigation?.classList.toggle("is-open", !isOpen);
  });

  navigation?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNavigation();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("is-scrolled", window.scrollY > 12);
    },
    { passive: true },
  );

  const supportForm = document.querySelector("#support-form");
  const requestedTopic = new URLSearchParams(window.location.search).get("topic");
  const requestTypeSelect = supportForm?.querySelector('select[name="requestType"]');

  if (requestTypeSelect && requestedTopic) {
    const matchingOption = [...requestTypeSelect.options].find(
      (option) => option.value.toLowerCase() === requestedTopic.toLowerCase(),
    );
    if (matchingOption) requestTypeSelect.value = matchingOption.value;
  }

  supportForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!supportForm.reportValidity()) return;

    const data = new FormData(supportForm);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const organization = String(data.get("organization") || "").trim();
    const requestType = String(data.get("requestType") || "").trim();
    const urgency = String(data.get("urgency") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`[AI Pharma Support] ${urgency} — ${requestType}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${organization || "Not provided"}`,
        `Request type: ${requestType}`,
        `Urgency: ${urgency}`,
        "",
        message,
        "",
        "— Sent from the AI Pharma Developments support form —",
      ].join("\n"),
    );

    const status = supportForm.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "Opening your email client with the support request…";
      status.classList.add("show");
    }

    window.location.href = `mailto:troy.windsor1989@gmail.com?subject=${subject}&body=${body}`;
  });
})();
