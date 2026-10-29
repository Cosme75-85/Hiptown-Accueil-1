// ═══════════════════════════════════════════════════════
//  CONFIGURATION HIPTOWN ACCUEIL — MARSEILLE
//  Le code est commun à toutes les villes (../app.js, ../style.css) :
//  ce dossier ne contient que ce qui est propre à Marseille.
// ═══════════════════════════════════════════════════════

const CONFIG = {

  espaceName: "Hiptown Marseille",

  // Cases des entreprises : gérées par l'équipe Hiptown Marseille dans le portail
  // (Gestion > Accueil visiteurs), et créées toutes seules pour les entreprises qui ont
  // un compte sur le portail. Les e-mails partent par l'outil Apps Script (Accueil.gs) :
  // aucune adresse n'apparaît dans cette page.
  portail: {
    firestoreUrl: "https://firestore.googleapis.com/v1/projects/erp-hiptown/databases/(default)/documents",
    apiKey:       "AIzaSyAxHXtIFK5xJGIni9pDVdTZ19cryCM7IJw",
    city:         "marseille", // ville du portail (identifiant de PORTAIL.cities)
    siteId:       null,        // toute la ville (à renseigner si Marseille a plusieurs sites)
    scriptUrl:    "https://script.google.com/macros/s/AKfycbxQi0MRfoJZ4YVroQfKe3l6mUBKwBZH8fMlMCLQa5YavhnKiZMsn6ULtb4-DHth47GsOw/exec",
  },

  // Case Hiptown et ses contacts (companyId: "hiptown" ; id connu d'Apps Script, ACCUEIL_TEAM_CONTACTS dans Accueil.gs)
  companies: [
    {
      id:       "hiptown",
      name:     "Hiptown",
      featured: true,
      pin:      null,
      logo:     "../Logo%20Hiptown%20site.png",
      color:    "#1e1847",
      textColor:"#ffe700",
      initials: "HT",
    },
  ],
  coworkers: [
    {
      id:          "benedicte",   // identifiant connu d'Apps Script (ACCUEIL_TEAM_CONTACTS dans Accueil.gs)
      name:        "Bénédicte Yeznikian",
      role:        "Équipe Hiptown Marseille",
      initials:    "BY",
      avatarBg:    "#1e1847",
      avatarColor: "#ffe700",
      companyId:   "hiptown",
    },
  ],

};
