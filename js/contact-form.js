/*
  The contact form has no backend yet. It's kept visually functional but
  is honest about not delivering anywhere — see css/pages/contact.css and
  the .form-status element for the disclosure shown on submit.
*/

export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!status) return;
    status.textContent =
      "This form isn't wired up to anything yet — please reach out directly via email in the meantime.";
    status.setAttribute("data-visible", "true");
  });
}
