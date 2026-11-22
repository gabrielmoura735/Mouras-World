(function () {
  var businessWhatsApp = "5511939318424";
  var fieldLabels = {
    name: "Nome",
    company: "Empresa",
    email: "E-mail",
    whatsapp: "Meu WhatsApp",
    squad: "Esquadrão de interesse",
    motivation: "Sobre mim e minha ideia",
    solution: "O que preciso",
    current_site: "Site ou perfil atual",
    details: "O que quero criar ou melhorar",
  };

  document.querySelectorAll("[data-whatsapp-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var formData = new FormData(form);
      var kind = form.getAttribute("data-whatsapp-form");
      var keys = kind === "partnership"
        ? ["name", "email", "whatsapp", "squad", "motivation"]
        : ["name", "company", "email", "whatsapp", "solution", "current_site", "details"];
      var lines = keys.map(function (key) {
        var field = form.querySelector('[name="' + key + '"]');
        var value = formData.get(key);
        if (field && field.tagName === "SELECT" && value) {
          var option = field.options[field.selectedIndex];
          value = option ? option.textContent.trim() : value;
        }
        return typeof value === "string" && value.trim()
          ? fieldLabels[key] + ": " + value.trim()
          : null;
      }).filter(Boolean);
      var heading = kind === "partnership"
        ? "Olá, Gabriel! Quero conversar sobre parceria com a Mouras-World."
        : "Olá, Gabriel! Vim pela Mouras-World e quero conversar sobre um projeto.";
      var message = [heading].concat(lines).join("\n");
      var url = "https://wa.me/" + businessWhatsApp + "?text=" + encodeURIComponent(message);

      window.location.assign(url);
    });
  });
})();
