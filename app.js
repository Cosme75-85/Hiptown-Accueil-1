// ═══════════════════════════════════════════════════════
//  HIPTOWN — ACCUEIL VISITEURS
//  app.js — logique principale v3
// ═══════════════════════════════════════════════════════

(function () {
  "use strict";

  emailjs.init(CONFIG.emailjs.publicKey);

  // ── DOM ───────────────────────────────────────────────
  const stepCompanies        = document.getElementById("step-companies");
  const stepPeople           = document.getElementById("step-people");
  const stepForm             = document.getElementById("step-form");
  const stepSuccess          = document.getElementById("step-success");

  const companiesGrid        = document.getElementById("companies-grid");
  const companySearch        = document.getElementById("company-search");
  const peopleSearchResults  = document.getElementById("people-search-results");
  const peopleSearchGrid     = document.getElementById("people-search-grid");

  const peopleGrid           = document.getElementById("people-grid");
  const alphabetBar          = document.getElementById("alphabet-bar");
  const selectedCompanyTitle = document.getElementById("selected-company-title");
  const backToCompanies      = document.getElementById("back-to-companies");

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

  let selectedPerson  = null;
  let selectedCompany = null;
  let currentPeople   = [];

  // ── Étapes ────────────────────────────────────────────
  function showStep(step) {
    stepCompanies.hidden = step !== "companies";
    stepPeople.hidden    = step !== "people";
    stepForm.hidden      = step !== "form";
    stepSuccess.hidden   = step !== "success";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── ÉTAPE 1 : Entreprises ─────────────────────────────
  function buildCompanies(filter) {
    companiesGrid.innerHTML = "";
    filter = (filter || "").toLowerCase();

    const featured = CONFIG.companies.filter(c => c.featured);
    const others   = CONFIG.companies
      .filter(c => !c.featured)
      .sort((a, b) => a.name.localeCompare(b.name));

    const all = [...featured, ...others];
    const filtered = filter
      ? all.filter(c => c.name.toLowerCase().includes(filter))
      : all;

    filtered.forEach(function (company) {
      const card = document.createElement("div");
      card.className = "company-card";
      if (company.featured) card.classList.add("company-featured");

      let inner = "";
      if (company.featured) {
        // Carte Hiptown : juste le logo centré, grand
        inner = '<img src="' + company.logo + '" alt="' + company.name + '" class="company-logo-featured"/>';
      } else if (company.logo) {
        inner = '<img src="' + company.logo + '" alt="' + company.name + '" class="company-logo"/>';
        inner += '<div class="company-name">' + company.name + '</div>';
      } else {
        inner = '<div class="company-avatar" style="background:' + company.color + ';color:' + company.textColor + ';">' + company.initials + '</div>';
        inner += '<div class="company-name">' + company.name + '</div>';
      }

      card.innerHTML = inner;
      card.addEventListener("click", function () { selectCompany(company); });
      companiesGrid.appendChild(card);
    });
  }

  // ── Recherche globale (entreprise + contact) ──────────
  companySearch.addEventListener("input", function () {
    const q = this.value.trim().toLowerCase();

    if (!q) {
      peopleSearchResults.hidden = true;
      buildCompanies();
      return;
    }

    // Recherche dans les contacts
    const matchPeople = CONFIG.coworkers.filter(p =>
      p.name.toLowerCase().includes(q)
    );

    // Affiche les contacts trouvés
    if (matchPeople.length > 0) {
      peopleSearchResults.hidden = false;
      peopleSearchGrid.innerHTML = "";
      matchPeople.forEach(function (person) {
        const card = document.createElement("div");
        card.className = "person-card";
        card.innerHTML =
          '<div class="p-avatar" style="background:' + person.avatarBg +
          ';color:' + person.avatarColor + ';">' + person.initials + '</div>' +
          '<div class="p-name">' + person.name + '</div>' +
          '<div class="p-role">' + person.role + '</div>';
        card.addEventListener("click", function () { selectPerson(person); });
        peopleSearchGrid.appendChild(card);
      });
    } else {
      peopleSearchResults.hidden = true;
    }

    // Filtre aussi les entreprises
    buildCompanies(q);
  });

  function selectCompany(company) {
    selectedCompany = company;
    selectedCompanyTitle.textContent = company.name;

    currentPeople = CONFIG.coworkers
      .filter(p => p.companyId === company.id)
      .sort((a, b) => a.name.localeCompare(b.name));

    buildPeople(currentPeople);
    buildAlphabet(currentPeople);
    showStep("people");
  }

  // ── ÉTAPE 2 : Personnes ───────────────────────────────
  function buildPeople(list) {
    peopleGrid.innerHTML = "";

    if (list.length === 0) {
      peopleGrid.innerHTML = '<p style="color:#94a3b8;text-align:center;grid-column:1/-1;">Aucun contact trouvé.</p>';
      return;
    }

    list.forEach(function (person) {
      const card = document.createElement("div");
      card.className = "person-card";
      card.setAttribute("data-name", person.name);
      card.innerHTML =
        '<div class="p-avatar" style="background:' + person.avatarBg +
        ';color:' + person.avatarColor + ';">' + person.initials + '</div>' +
        '<div class="p-name">' + person.name + '</div>' +
        '<div class="p-role">' + person.role + '</div>';
      card.addEventListener("click", function () { selectPerson(person); });
      peopleGrid.appendChild(card);
    });
  }

  function buildAlphabet(list) {
    alphabetBar.innerHTML = "";
    const letters = [...new Set(list.map(p => p.name[0].toUpperCase()))].sort();

    letters.forEach(function (letter) {
      const btn = document.createElement("button");
      btn.className = "alpha-btn";
      btn.textContent = letter;
      btn.addEventListener("click", function () {
        const target = peopleGrid.querySelector('[data-name^="' + letter + '"]');
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      alphabetBar.appendChild(btn);
    });
  }

  backToCompanies.addEventListener("click", function () {
    companySearch.value = "";
    peopleSearchResults.hidden = true;
    buildCompanies();
    showStep("companies");
  });

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

  // ── Envoi ─────────────────────────────────────────────
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

    try {
      await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
        to_email: selectedPerson.contact,
        to_name:  selectedPerson.name,
        visitor:  name,
        message:  message,
      });
    } catch (err) {
      console.error("Erreur EmailJS :", err);
    }

    successText.textContent = selectedPerson.name + " a été prévenu(e) de votre arrivée.";
    if (visitorMsg.value.trim()) {
      successText.textContent += " Votre message a bien été transmis.";
    }

    sendBtn.disabled = false;
    sendBtn.textContent = "Prévenir de mon arrivée";
    showStep("success");
  }

  function reset() {
    selectedPerson  = null;
    selectedCompany = null;
    companySearch.value = "";
    peopleSearchResults.hidden = true;
    buildCompanies();
    showStep("companies");
  }

  // ── Écouteurs ─────────────────────────────────────────
  backBtn.addEventListener("click", function () { showStep("people"); });
  sendBtn.addEventListener("click", sendNotification);
  resetBtn.addEventListener("click", reset);
  visitorName.addEventListener("input", function () {
    visitorName.classList.remove("error");
  });

  // ── Init ──────────────────────────────────────────────
  buildCompanies();
  showStep("companies");

})();
