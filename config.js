// ═══════════════════════════════════════════════════════
//  CONFIGURATION HIPTOWN ACCUEIL
//  Modifiez ce fichier pour gérer les entreprises et contacts
// ═══════════════════════════════════════════════════════

const CONFIG = {

  espaceName: "Hiptown",

  // Cases des entreprises clientes : lues dans le portail Hiptown (Firestore, collection « accueil »).
  // Chaque entreprise choisit elle-même d'apparaître, son logo, l'e-mail qui reçoit les visites et
  // son code d'accès, et chaque collaborateur d'apparaître sous sa case (portail > Mon profil).
  // Tous les e-mails (entreprises et case Hiptown) partent par l'outil Apps Script
  // (reservation/Accueil.gs du portail) : aucune adresse n'apparaît dans cette page.
  portail: {
    firestoreUrl: "https://firestore.googleapis.com/v1/projects/erp-hiptown/databases/(default)/documents",
    apiKey:       "AIzaSyAxHXtIFK5xJGIni9pDVdTZ19cryCM7IJw",
    city:         "bordeaux", // ville du portail (identifiant de PORTAIL.cities)
    siteId:       "nabo06",   // NABO06 — Émergence : les entreprises de ce site, et celles ajoutées pour tous les sites
    scriptUrl:    "https://script.google.com/macros/s/AKfycbxQi0MRfoJZ4YVroQfKe3l6mUBKwBZH8fMlMCLQa5YavhnKiZMsn6ULtb4-DHth47GsOw/exec",
  },

  // Case écrite à la main : l'équipe Hiptown, avec ses contacts ci-dessous
  companies: [
    {
      id:       "hiptown",
      name:     "Hiptown",
      featured: true,
      pin:      null,
      logo:     "Logo%20Hiptown%20site.png",
      color:    "#1e1847",
      textColor:"#ffe700",
      initials: "HT",
    },
  ],

  coworkers: [
    {
      id:          "anne-lise",   // identifiant connu d'Apps Script (ACCUEIL_TEAM_CONTACTS dans Accueil.gs)
      name:        "Anne-Lise Médalin",
      role:        "Manageuse de ville",
      initials:    "ALM",
      avatarBg:    "#1e1847",
      avatarColor: "#ffe700",
      phone:       "+33766876174",
      companyId:   "hiptown",
    },
    {
      id:          "come",
      name:        "Côme Chabridon",
      role:        "Assistant manageur",
      initials:    "CC",
      avatarBg:    "#1e1847",
      avatarColor: "#ffe700",
      phone:       "+33759680315",
      companyId:   "hiptown",
    },
  ],


};
