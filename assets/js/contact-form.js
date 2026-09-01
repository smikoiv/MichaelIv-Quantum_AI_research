const form = document.querySelector("[data-contact-form]");

if (form) {
  const status = form.querySelector("[data-contact-status]");
  const submit = form.querySelector("button[type='submit']");
  const submitLabel = submit?.querySelector("span");
  const defaultLabel = submitLabel?.textContent || "Send message";

  const setState = (state, message) => {
    form.dataset.state = state;
    status.dataset.state = state;
    status.textContent = message;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    setState("sending", "Sending…");
    form.setAttribute("aria-busy", "true");
    submit.disabled = true;
    if (submitLabel) submitLabel.textContent = "Sending…";

    try {
      let response;

      try {
        response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        });
      } catch (_error) {
        setState("error", "Unable to send message. Please try again.");
        return;
      }

      const requestSucceeded = response.status >= 200 && response.status < 300;

      if (requestSucceeded) {
        form.reset();
        setState("success", "Message sent successfully.");
      } else {
        setState("error", "Unable to send message. Please try again.");
      }
    } finally {
      form.removeAttribute("aria-busy");
      submit.disabled = false;
      if (submitLabel) submitLabel.textContent = defaultLabel;
    }
  });
}
