// ═══════════════════════════════════════════════════════
//  HIPTOWN — ACCUEIL VISITEURS
//  app.js — logique principale v2
// ═══════════════════════════════════════════════════════

(function () {
  "use strict";

  // ── EmailJS ───────────────────────────────────────────
  emailjs.init(CONFIG.emailjs.publicKey);

  // ── Éléments DOM ──────────────────────────────────────
  const stepCompanies = document.getElementById("step-companies");
  const stepPeople    = document.getElementById("step-people");
  const stepForm      = document.getElementById("step-form");
  const stepSuccess   = document.getElementById("step-success");

  const companiesGrid    = document.getElementById("companies-grid");
  const companySearch    = document.getElementById("company-search");

  const peopleGrid       = document.getElementById("people-grid");
  const peopleSearch     = document.getElementById("people-search");
  const alphabetBar      = document.getElementById("alphabet-bar");
  const selectedCompanyTitle = document.getElementById("selected-company-title");
  const backToCompanies  = document.getElementById("back-to-companies");

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
  let selectedPerson  = null;
  let selectedCompany = null;
  let currentPeople   = [];

  // ── Affichage des étapes ──────────────────────────────
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

      let inner = "";
      if (company.logo) {
        inner = '<img src="' + company.logo + '" alt="' + company.name + '" class="company-logo"/>';
      } else {
        inner = '<div class="company-avatar" style="background:' + company.color + ';color:' + company.textColor + ';">' + company.initials + '</div>';
      }
      inner += '<div class="company-name">' + company.name + '</div>';

      if (company.featured) {
        card.classList.add("company-featured");
      }

      card.innerHTML = inner;
      card.addEventListener("click", function () { selectCompany(company); });
      companiesGrid.appendChild(card);
    });
  }

  function selectCompany(company) {
    selectedCompany = company;
    selectedCompanyTitle.textContent = company.name;

    currentPeople = CONFIG.coworkers
      .filter(p => p.companyId === company.id)
      .sort((a, b) => a.name.localeCompare(b.name));

    peopleSearch.value = "";
    buildPeople(currentPeople);
    buildAlphabet(currentPeople);
    showStep("people");
  }

  companySearch.addEventListener("input", function () {
    buildCompanies(this.value);
  });

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

  peopleSearch.addEventListener("input", function () {
    const q = this.value.toLowerCase();
    const filtered = currentPeople.filter(p =>
      p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)
    );
    buildPeople(filtered);
  });

  backToCompanies.addEventListener("click", function () {
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
