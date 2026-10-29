// ═══════════════════════════════════════════════════════
//  HIPTOWN — ACCUEIL VISITEURS — app.js v4
// ═══════════════════════════════════════════════════════

// Adresse de l'en-tête : Plans d'Apple sur iPhone, iPad et Mac, Google Maps ailleurs
(function () {
  const link = document.getElementById("address-link");
  if (link && /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)) {
    link.href = "https://maps.apple.com/?q=" + encodeURIComponent(link.dataset.query);
  }
})();

(function () {
  "use strict";

  // ── DOM ───────────────────────────────────────────────
  const stepPin          = document.getElementById("step-pin");
  const stepCompanies    = document.getElementById("step-companies");
  const stepPeople       = document.getElementById("step-people");
  const stepChoice       = document.getElementById("step-choice");
  const stepForm         = document.getElementById("step-form");
  const stepSuccess      = document.getElementById("step-success");

  const pinDots          = document.getElementById("pin-dots").querySelectorAll("span");
  const pinError         = document.getElementById("pin-error");
  const pinCompanyLogo   = document.getElementById("pin-company-logo");
  const pinKeys          = document.querySelectorAll(".pin-key");

  const companiesGrid        = document.getElementById("companies-grid");
  const companySearch        = document.getElementById("company-search");
  const peopleSearchResults  = document.getElementById("people-search-results");
  const peopleSearchGrid     = document.getElementById("people-search-grid");

  const peopleGrid           = document.getElementById("people-grid");
  const alphabetBar          = document.getElementById("alphabet-bar");
  const selectedCompanyTitle = document.getElementById("selected-company-title");
  const backToCompanies      = document.getElementById("back-to-companies");

  const backToPeople = document.getElementById("back-to-people");
  const choiceAvatar = document.getElementById("choice-avatar");
  const choiceName   = document.getElementById("choice-name");
  const choiceRole   = document.getElementById("choice-role");
  const choiceNotify = document.getElementById("choice-notify");
  const choiceCall   = document.getElementById("choice-call");

  const backBtn     = document.getElementById("back-btn");
  const sendBtn     = document.getElementById("send-btn");
  const resetBtn    = document.getElementById("reset-btn");

  const selAvatar   = document.getElementById("sel-avatar");
  const selName     = document.getElementById("sel-name");
  const selRole     = document.getElementById("sel-role");

  const visitorName = document.getElementById("visitor-name");
  const visitorMsg  = document.getElementById("visitor-msg");
  const successText = document.getElementById("success-text");
  const successTitle = document.querySelector("#step-success h2");

  document.getElementById("year").textContent = new Date().getFullYear();

  // ── État ──────────────────────────────────────────────
  let selectedPerson    = null;
  let selectedCompany   = null;
  let currentPeople     = [];
  let pinTarget         = null;
  let pinCurrent        = "";
  let accessCode        = "";   // code d'accès tapé pour la case en cours (envoyé à Apps Script)

  // ── Étapes ────────────────────────────────────────────
  function showStep(step) {
    stepPin.hidden       = step !== "pin";
    stepCompanies.hidden = step !== "companies";
    stepPeople.hidden    = step !== "people";
    stepChoice.hidden    = step !== "choice";
    stepForm.hidden      = step !== "form";
    stepSuccess.hidden   = step !== "success";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── PIN ───────────────────────────────────────────────
  function openPin(company) {
    pinTarget  = company;
    pinCurrent = "";
    pinError.hidden = true;
    updatePinDots();

    // Affiche le logo ou les initiales de l'entreprise
    if (company.logo) {
      pinCompanyLogo.innerHTML = '<img src="' + escapeHtml(company.logo) + '" alt="' + escapeHtml(company.name) + '" style="height:56px;object-fit:contain;"/>';
    } else {
      pinCompanyLogo.innerHTML = '<div style="width:64px;height:64px;border-radius:12px;background:' + company.color + ';color:' + company.textColor + ';display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;margin:0 auto;">' + escapeHtml(company.initials) + '</div>';
    }

    showStep("pin");
  }

  function updatePinDots() {
    pinDots.forEach(function (dot, i) {
      dot.classList.toggle("filled", i < pinCurrent.length);
    });
  }

  pinKeys.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const val = this.getAttribute("data-val");

      if (val === "cancel") {
        pinCurrent = "";
        pinTarget  = null;
        showStep("companies");
        return;
      }

      if (val === "back") {
        pinCurrent = pinCurrent.slice(0, -1);
        pinError.hidden = true;
        updatePinDots();
        return;
      }

      if (pinCurrent.length >= 4) return;
      pinCurrent += val;
      updatePinDots();

      if (pinCurrent.length === 4) {
        const target = pinTarget;
        const code = pinCurrent;
        checkPin(target, code).then(function (status) {
          if (pinTarget !== target) return; // le visiteur a annulé entre-temps
          if (status === "ok") {
            accessCode = code;
            setTimeout(function () { openCompany(target); }, 200);
          } else {
            pinError.textContent = status === "wrong"
              ? "Code incorrect, réessayez."
              : "Vérification impossible pour le moment. Choisissez la case Hiptown pour joindre l'équipe.";
            pinError.hidden = false;
            setTimeout(function () {
              pinCurrent = "";
              pinError.hidden = true;
              updatePinDots();
            }, status === "wrong" ? 1000 : 4000);
          }
        });
      }
    });
  });

  /**
   * Code d'accès : celui d'une case écrite dans config.js est comparé ici ; celui d'une case du
   * portail n'est jamais dans la page, c'est Apps Script qui le vérifie.
   */
  async function checkPin(company, code) {
    if (company.pin) return code === company.pin ? "ok" : "wrong";
    try {
      const res = await fetch(CONFIG.portail.scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "checkAccueilPin", payload: { companyId: company.id, pin: code } }),
      });
      const result = await res.json();
      if (result.success === true) return "ok";
      if (result.message === "Code d'accès incorrect.") return "wrong";
      console.error("Code non vérifié :", result.message);
      return "error";
    } catch (err) {
      console.error("Code non vérifié :", err);
      return "error";
    }
  }

  // ── Entreprises du portail Hiptown (Firestore, collection « accueil ») ──
  const SAFE_LOGO = /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/;
  const PALETTE = [
    ["#e0f2fe", "#0369a1"], ["#fef3c7", "#92400e"], ["#dcfce7", "#166534"],
    ["#f3e8ff", "#7e22ce"], ["#fff0e0", "#92400e"], ["#e0f0ff", "#1e40af"],
  ];

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function initialsOf(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w.charAt(0).toUpperCase()).join("") || "?";
  }

  /** Documents d'une collection du portail pour la ville de la page. */
  async function runQuery(p, collectionId) {
    const res = await fetch(p.firestoreUrl + ":runQuery?key=" + encodeURIComponent(p.apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ structuredQuery: {
        from: [{ collectionId: collectionId }],
        where: { fieldFilter: { field: { fieldPath: "city" }, op: "EQUAL", value: { stringValue: p.city } } },
        limit: 500,
      } }),
    });
    if (!res.ok) throw new Error(collectionId + " : HTTP " + res.status);
    return res.json();
  }

  async function loadPortailCompanies() {
    const p = CONFIG.portail;
    if (!p || !p.firestoreUrl || !p.city) return;
    try {
      // Cases de la ville (lecture publique, sans connexion)
      const rows = await runQuery(p, "accueil");
      const known = new Set(CONFIG.companies.map(c => c.id));
      rows.filter(r => r.document).forEach(function (r, i) {
        const d = r.document;
        const f = d.fields || {};
        const id = d.name.split("/").pop();
        const name = (f.name && f.name.stringValue || "").trim();
        const siteId = f.siteId && f.siteId.stringValue;
        // Page d'un site : les cases de ce site et celles de « tous les sites » de la ville
        if (!name || known.has(id) || (p.siteId && siteId && siteId !== p.siteId)) return;
        // Entreprise du portail : seulement si elle a choisi d'apparaître (Mon profil) ; une case
        // ajoutée à la main par l'équipe apparaît toujours
        const manual = f.manual && f.manual.booleanValue === true;
        const visible = f.visible && f.visible.booleanValue === true;
        if (!manual && !visible) return;
        const logo = f.logo && f.logo.stringValue;
        const colors = PALETTE[i % PALETTE.length];
        // Personnes de la case, choisies par l'entreprise (Mon profil) ou par l'équipe
        const people = ((f.people && f.people.arrayValue && f.people.arrayValue.values) || [])
          .map(v => (v.mapValue && v.mapValue.fields) || {})
          .map(pf => ({
            personId: pf.id && pf.id.stringValue,
            name: ((pf.name && pf.name.stringValue) || "").trim(),
            role: ((pf.role && pf.role.stringValue) || "").trim(),
          }))
          .filter(p => p.personId && p.name);
        CONFIG.companies.push({
          id: id, name: name, featured: false, pin: null, fromPortail: true,
          locked: f.locked && f.locked.booleanValue === true, // code d'accès vérifié par Apps Script
          hasPeople: people.length > 0,
          logo: SAFE_LOGO.test(logo || "") ? logo : "",
          color: colors[0], textColor: colors[1], initials: initialsOf(name),
        });
        people.forEach(p => CONFIG.coworkers.push({
          personId: p.personId, name: p.name, role: p.role || name, companyId: id,
          initials: initialsOf(p.name), avatarBg: colors[0], avatarColor: colors[1],
        }));
      });
    } catch (err) {
      console.error("Entreprises du portail non chargées :", err);
    }
  }

  // ── ÉTAPE 1 : Entreprises ─────────────────────────────
  function buildCompanies(filter) {
    companiesGrid.innerHTML = "";
    filter = (filter || "").toLowerCase();

    const featured = CONFIG.companies.filter(c => c.featured);
    const others   = CONFIG.companies
      .filter(c => !c.featured)
      .sort((a, b) => a.name.localeCompare(b.name));

    const all      = [...featured, ...others];
    const filtered = filter
      ? all.filter(c => c.name.toLowerCase().includes(filter))
      : all;

    if (!filtered.length) {
      companiesGrid.innerHTML = '<p style="color:#94a3b8;text-align:center;grid-column:1/-1;">'
        + (filter ? "Aucune entreprise ne correspond à la recherche." : "Aucune entreprise pour le moment.") + "</p>";
    }

    filtered.forEach(function (company) {
      const card = document.createElement("div");
      card.className = "company-card";
      if (company.featured) card.classList.add("company-featured");

      const name = escapeHtml(company.name);
      let inner = "";
      if (company.featured) {
        inner = '<img src="' + escapeHtml(company.logo) + '" alt="' + name + '" class="company-logo"/>';
      } else if (company.logo) {
        inner = '<img src="' + escapeHtml(company.logo) + '" alt="' + name + '" class="company-logo"/>';
        inner += '<div class="company-name">' + name + '</div>';
      } else {
        inner = '<div class="company-avatar" style="background:' + company.color + ';color:' + company.textColor + ';">' + escapeHtml(company.initials) + '</div>';
        inner += '<div class="company-name">' + name + '</div>';
      }

      card.innerHTML = inner;
      card.addEventListener("click", function () {
        accessCode = "";
        if (company.pin || company.locked) {
          openPin(company);
        } else {
          openCompany(company);
        }
      });
      companiesGrid.appendChild(card);
    });
  }

  /** Après le code d'accès s'il y en a un : liste des personnes, ou directement le formulaire. */
  function openCompany(company) {
    if (company.fromPortail && !company.hasPeople) openCompanyForm(company);
    else enterCompany(company);
  }

  function enterCompany(company) {
    selectedCompany = company;
    selectedCompanyTitle.textContent = company.name;

    currentPeople = CONFIG.coworkers
      .filter(p => p.companyId === company.id)
      .sort((a, b) => a.name.localeCompare(b.name));

    buildPeople(currentPeople);
    buildAlphabet(currentPeople);
    showStep("people");
  }

  // ── Recherche globale ──────────────────────────────────
  companySearch.addEventListener("input", function () {
    const q = this.value.trim().toLowerCase();

    if (!q) {
      peopleSearchResults.hidden = true;
      buildCompanies();
      return;
    }

const matchPeople = CONFIG.coworkers.filter(p => {
  const company = CONFIG.companies.find(c => c.id === p.companyId);
  return p.name.toLowerCase().includes(q) && (!company || (!company.pin && !company.locked));
});

    if (matchPeople.length > 0) {
      peopleSearchResults.hidden = false;
      peopleSearchGrid.innerHTML = "";
      matchPeople.forEach(function (person) {
        const card = document.createElement("div");
        card.className = "person-card";
        card.innerHTML = personHtml(person);
        card.addEventListener("click", function () { selectPerson(person); });
        peopleSearchGrid.appendChild(card);
      });
    } else {
      peopleSearchResults.hidden = true;
    }

    buildCompanies(q);
  });

  // ── ÉTAPE 2 : Personnes ───────────────────────────────
  function personHtml(person) {
    return '<div class="p-avatar" style="background:' + person.avatarBg +
      ';color:' + person.avatarColor + ';">' + escapeHtml(person.initials) + '</div>' +
      '<div class="p-name">' + escapeHtml(person.name) + '</div>' +
      '<div class="p-role">' + escapeHtml(person.role) + '</div>';
  }

  function buildPeople(list) {
    peopleGrid.innerHTML = "";
    if (list.length === 0) {
      peopleGrid.innerHTML = '<p style="color:#94a3b8;text-align:center;grid-column:1/-1;">Aucun contact pour le moment.</p>';
      return;
    }
    list.forEach(function (person) {
      const card = document.createElement("div");
      card.className = "person-card";
      card.setAttribute("data-name", person.name);
      card.innerHTML = personHtml(person);
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

  // ── Sélection personne ────────────────────────────────
  // Contact avec téléphone : choix « Prévenir » ou « Appeler »
  function selectPerson(person) {
    selectedPerson = person;
    if (!person.phone) {
      openForm(person);
      return;
    }
    choiceAvatar.style.background = person.avatarBg;
    choiceAvatar.style.color      = person.avatarColor;
    choiceAvatar.textContent      = person.initials;
    choiceName.textContent        = person.name;
    choiceRole.textContent        = person.role;
    choiceCall.href = "tel:" + person.phone;
    choiceCall.querySelector(".choice-label").textContent = "Appeler " + person.name.split(" ")[0];
    showStep("choice");
  }

  // Entreprise du portail : pas de liste de salariés, le visiteur prévient l'entreprise
  function openCompanyForm(company) {
    selectedCompany = company;
    selectedPerson  = null;
    selAvatar.style.background = company.logo ? "#ffffff" : company.color;
    selAvatar.style.color      = company.textColor;
    selAvatar.innerHTML        = company.logo
      ? '<img src="' + escapeHtml(company.logo) + '" alt="" style="width:100%;height:100%;object-fit:contain;"/>'
      : escapeHtml(company.initials);
    selName.textContent        = company.name;
    selRole.textContent        = "Entreprise";
    resetForm();
  }

  function resetForm() {
    visitorName.value = "";
    visitorMsg.value  = "";
    visitorName.classList.remove("error");
    showStep("form");
    visitorName.focus();
  }

  function openForm(person) {
    selAvatar.style.background = person.avatarBg;
    selAvatar.style.color      = person.avatarColor;
    selAvatar.textContent      = person.initials;
    selName.textContent        = person.name;
    selRole.textContent        = person.role;
    resetForm();
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

    const recipient = selectedPerson ? selectedPerson.name : selectedCompany.name;
    let failed = false;
    // L'outil Apps Script envoie l'e-mail : la page ne connaît que l'identifiant du destinataire
    const message = visitorMsg.value.trim();
    let payload;
    if (selectedPerson && selectedPerson.personId) {
      // Personne d'une case du portail : son e-mail, sinon celui de l'entreprise (Accueil.gs)
      payload = { companyId: selectedPerson.companyId, personId: selectedPerson.personId, pin: accessCode, visitor: name, message: message };
    } else if (selectedPerson && selectedPerson.id) {
      payload = { contactId: selectedPerson.id, visitor: name, message: message };
    } else {
      payload = { companyId: selectedCompany.id, pin: accessCode, visitor: name, message: message };
    }
    try {
      const res = await fetch(CONFIG.portail.scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // évite une requête préalable (CORS)
        body: JSON.stringify({ action: "notifyVisitor", payload: payload }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || "Envoi impossible");
    } catch (err) {
      console.error("Erreur d'envoi :", err);
      failed = true;
    }

    successTitle.textContent = failed ? "Message non envoyé" : "Message envoyé !";
    if (failed) {
      successText.textContent = "Nous n'avons pas pu prévenir " + recipient + ". Choisissez la case Hiptown puis « Appeler » pour joindre l'équipe.";
    } else {
      successText.textContent = recipient + " a été prévenu(e) de votre arrivée.";
      if (visitorMsg.value.trim()) {
        successText.textContent += " Votre message a bien été transmis.";
      }
    }
    sendBtn.disabled = false;
    sendBtn.textContent = "Prévenir de mon arrivée";
    showStep("success");
  }

  function reset() {
    accessCode      = "";
    selectedPerson  = null;
    selectedCompany = null;
    companySearch.value = "";
    peopleSearchResults.hidden = true;
    buildCompanies();
    showStep("companies");
  }

  // ── Écouteurs ─────────────────────────────────────────
  backBtn.addEventListener("click", function () {
    if (!selectedPerson) return showStep("companies");
    showStep(selectedPerson.phone ? "choice" : "people");
  });
  backToPeople.addEventListener("click", function () { showStep("people"); });
  choiceNotify.addEventListener("click", function () { openForm(selectedPerson); });
  sendBtn.addEventListener("click", sendNotification);
  resetBtn.addEventListener("click", reset);
  visitorName.addEventListener("input", function () {
    visitorName.classList.remove("error");
  });

  // ── Init ──────────────────────────────────────────────
  buildCompanies();
  showStep("companies");
  loadPortailCompanies().then(function () {
    if (!companySearch.value.trim()) buildCompanies();
  });

})();
