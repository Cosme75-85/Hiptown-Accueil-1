// ═══════════════════════════════════════════════════════
//  HIPTOWN — ACCUEIL VISITEURS
//  app.js — logique principale
// ═══════════════════════════════════════════════════════

(function () {
  "use strict";

  // ── Éléments DOM ──────────────────────────────────────
  const stepList    = document.getElementById("step-list");
  const stepForm    = document.getElementById("step-form");
  const stepSuccess = document.getElementById("step-success");

  const peopleGrid  = document.getElementById("people-grid");
  const backBtn     = document.getElementById("back-btn");
  const sendBtn     = document.getElementById("send-btn");
  const resetBtn    = document.getElementById("reset-btn");

  const selAvatar   = document.getElementById("sel-avatar");
  const selName     = document.getElementById("sel-name");
  const selRole     = document.getElementById("sel-role");

  const visitorName = document.getElementById("visitor-name");
  const visitorMsg  = document.getElementById("visitor-msg");
  const successText = document.getElementById("success-text");

  document.getElementById("year").textContent = new Date().getFullYear();

  // ── État ──────────────────────────────────────────────
  let selectedPerson = null;

  // ── Affichage des étapes ──────────────────────────────
  function showStep(step) {
    stepList.hidden    = step !== "list";
    stepForm.hidden    = step !== "form";
    stepSuccess.hidden = step !== "success";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Construction de la grille ─────────────────────────
  function buildGrid() {
    CONFIG.coworkers.forEach(function (person) {
      const card = document.createElement("div");
      card.className = "person-card";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", person.name + ", " + person.role);

      card.innerHTML =
        '<div class="p-avatar" style="background:' + person.avatarBg +
        ';color:' + person.avatarColor + ';">' + person.initials + "</div>" +
        '<div class="p-name">' + person.name + "</div>" +
        '<div class="p-role">' + person.role + "</div>";

      card.addEventListener("click", function () { selectPerson(person); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") selectPerson(person);
      });

      peopleGrid.appendChild(card);
    });
  }

  // ── Sélection d'une personne ──────────────────────────
  function selectPerson(person) {
    selectedPerson = person;

    selAvatar.style.background = person.avatarBg;
    selAvatar.style.color      = person.avatarColor;
    selAvatar.textContent      = person.initials;
    selName.textContent        = person.name;
    selRole.textContent        = person.role;

    visitorName.value = "";
    visitorMsg.value  = "";
    visitorName.classList.remove("error");

    showStep("form");
    visitorName.focus();
  }

  // ── Envoi de la notification ──────────────────────────
  async function sendNotification() {
    const name = visitorName.value.trim();

    if (!name) {
      visitorName.classList.add("error");
      visitorName.focus();
      return;
    }

    visitorName.classList.remove("error");
    sendBtn.disabled = true;
    sendBtn.textContent = "Envoi en cours…";

    const message = visitorMsg.value.trim()
      ? name + " vous attend en bas. Message : « " + visitorMsg.value.trim() + " »"
      : name + " vous attend en bas de l'immeuble.";

    // ── Envoi selon la méthode configurée ────────────────
    if (CONFIG.notificationMethod === "webhook" && CONFIG.webhookUrl) {
      try {
        await fetch(CONFIG.webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            person:  selectedPerson.name,
            contact: selectedPerson.contact,
            visitor: name,
            message: message,
          }),
        });
      } catch (err) {
        console.error("Erreur envoi webhook :", err);
      }
    }

    // Mode "none" ou après envoi : afficher la confirmation
    successText.textContent =
      selectedPerson.name + " a été prévenu(e) de votre arrivée.";
    if (visitorMsg.value.trim()) {
      successText.textContent += " Votre message a bien été transmis.";
    }

    sendBtn.disabled = false;
    sendBtn.textContent = "Prévenir de mon arrivée";
    showStep("success");
  }

  // ── Retour à l'accueil ────────────────────────────────
  function reset() {
    selectedPerson = null;
    showStep("list");
  }

  // ── Écouteurs ─────────────────────────────────────────
  backBtn.addEventListener("click", function () { showStep("list"); });
  sendBtn.addEventListener("click", sendNotification);
  resetBtn.addEventListener("click", reset);

  visitorName.addEventListener("input", function () {
    visitorName.classList.remove("error");
  });

  // ── Init ──────────────────────────────────────────────
  buildGrid();
  showStep("list");

})();
