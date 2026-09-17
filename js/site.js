document.getElementById("year")?.append(String(new Date().getFullYear()));

const form = document.getElementById("support-form");
const toast = document.getElementById("toast");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const org = String(data.get("org") || "").trim();
  const type = String(data.get("type") || "").trim();
  const severity = String(data.get("severity") || "").trim();
  const message = String(data.get("message") || "").trim();

  const subject = encodeURIComponent(`[AI Pharma Support] ${severity} — ${type}`);
  const body = encodeURIComponent(
    [
      `Name: ${name}`,
      `Email: ${email}`,
      `Organization: ${org || "n/a"}`,
      `Type: ${type}`,
      `Severity: ${severity}`,
      "",
      message,
      "",
      "— submitted from AI Pharma Developments support portal —",
    ].join("\n")
  );

  window.location.href = `mailto:troy.windsor1989@gmail.com?subject=${subject}&body=${body}`;
  toast?.classList.add("show");
});
