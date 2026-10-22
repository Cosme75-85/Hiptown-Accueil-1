// ═══════════════════════════════════════════════════════
//  CONFIGURATION HIPTOWN ACCUEIL
//  Modifiez ce fichier pour gérer les entreprises et contacts
// ═══════════════════════════════════════════════════════

const CONFIG = {

  espaceName: "Hiptown",

  // Cases des entreprises clientes : créées toutes seules par le portail Hiptown
  // (Firestore, collection « accueil »). Chaque entreprise y met elle-même son logo et
  // l'e-mail qui reçoit les visites (portail > Mon profil > Ma case à l'accueil visiteurs).
  // L'e-mail part par l'outil Apps Script, l'adresse n'apparaît jamais dans cette page.
  portail: {
    firestoreUrl: "https://firestore.googleapis.com/v1/projects/erp-hiptown/databases/(default)/documents/accueil",
    apiKey:       "AIzaSyAxHXtIFK5xJGIni9pDVdTZ19cryCM7IJw",
    siteId:       "nabo06",   // NABO06 — Émergence : seules les entreprises de ce site s'affichent
    scriptUrl:    "https://script.google.com/macros/s/AKfycbxQi0MRfoJZ4YVroQfKe3l6mUBKwBZH8fMlMCLQa5YavhnKiZMsn6ULtb4-DHth47GsOw/exec",
  },

  // Cases écrites à la main (l'équipe Hiptown, avec ses contacts ci-dessous)
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
      name:        "Anne-Lise Médalin",
      role:        "Manageuse de ville",
      initials:    "ALM",
      avatarBg:    "#1e1847",
      avatarColor: "#ffe700",
      contact:     "alm@hiptown.com",
      phone:       "+33766876174",
      companyId:   "hiptown",
    },
    {
      name:        "Côme Chabridon",
      role:        "Assistant manageur",
      initials:    "CC",
      avatarBg:    "#1e1847",
      avatarColor: "#ffe700",
      contact:     "cc@hiptown.com",
      phone:       "+33759680315",
      companyId:   "hiptown",
    },
  ],

  emailjs: {
    publicKey:  "5HaskNyk1h8eA_Ee6",
    serviceId:  "service_vs6rgr8",
    templateId: "template_f4lbzo5",
  },

};
