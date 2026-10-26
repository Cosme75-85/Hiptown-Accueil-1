// ═══════════════════════════════════════════════════════
//  HIPTOWN — ACCUEIL VISITEURS — app.js v4
// ═══════════════════════════════════════════════════════

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
      pinCompanyLogo.innerHTML = '<img src="' + company.logo + '" alt="' + company.name + '" style="height:56px;object-fit:contain;"/>';
    } else {
      pinCompanyLogo.innerHTML = '<div style="width:64px;height:64px;border-radius:12px;background:' + company.color + ';color:' + company.textColor + ';display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;margin:0 auto;">' + company.initials + '</div>';
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
        if (pinCurrent === pinTarget.pin) {
          // PIN correct
          setTimeout(function () {
            enterCompany(pinTarget);
          }, 200);
        } else {
          // PIN incorrect
          pinError.hidden = false;
          setTimeout(function () {
            pinCurrent = "";
            pinError.hidden = true;
            updatePinDots();
          }, 1000);
        }
      }
    });
  });

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

  async function loadPortailCompanies() {
    const p = CONFIG.portail;
    if (!p || !p.firestoreUrl || !p.city) return;
    try {
      // Cases de la ville (lecture publique, sans connexion)
      const res = await fetch(p.firestoreUrl + ":runQuery?key=" + encodeURIComponent(p.apiKey), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ structuredQuery: {
          from: [{ collectionId: "accueil" }],
          where: { fieldFilter: { field: { fieldPath: "city" }, op: "EQUAL", value: { stringValue: p.city } } },
          limit: 300,
        } }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = await res.json();
      const known = new Set(CONFIG.companies.map(c => c.id));
      rows.filter(r => r.document).forEach(function (r, i) {
        const d = r.document;
        const f = d.fields || {};
        const id = d.name.split("/").pop();
        const name = (f.name && f.name.stringValue || "").trim();
        const siteId = f.siteId && f.siteId.stringValue;
        // Page d'un site : les cases de ce site et celles de « tous les sites » de la ville
        if (!name || known.has(id) || (p.siteId && siteId && siteId !== p.siteId)) return;
        const logo = f.logo && f.logo.stringValue;
        const colors = PALETTE[i % PALETTE.length];
        CONFIG.companies.push({
          id: id, name: name, featured: false, pin: null, fromPortail: true,
          logo: SAFE_LOGO.test(logo || "") ? logo : "",
          color: colors[0], textColor: colors[1], initials: initialsOf(name),
        });
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
        if (company.fromPortail) {
          openCompanyForm(company);
        } else if (company.pin) {
          openPin(company);
        } else {
          enterCompany(company);
        }
      });
      companiesGrid.appendChild(card);
    });
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
  return p.name.toLowerCase().includes(q) && (!company || !company.pin);
});

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

    buildCompanies(q);
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
    const payload = selectedPerson
      ? { contactId: selectedPerson.id, visitor: name, message: visitorMsg.value.trim() }
      : { companyId: selectedCompany.id, visitor: name, message: visitorMsg.value.trim() };
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
