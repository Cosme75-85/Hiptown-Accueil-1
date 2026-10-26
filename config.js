// ═══════════════════════════════════════════════════════
//  CONFIGURATION HIPTOWN ACCUEIL
//  Modifiez ce fichier pour gérer les entreprises et contacts
// ═══════════════════════════════════════════════════════

const CONFIG = {

  espaceName: "Hiptown",

  // Cases des entreprises clientes : créées toutes seules par le portail Hiptown
  // (Firestore, collection « accueil »). Chaque entreprise y met elle-même son logo et
  // l'e-mail qui reçoit les visites (portail > Mon profil > Ma case à l'accueil visiteurs).
  // Tous les e-mails (entreprises et case Hiptown) partent par l'outil Apps Script
  // (reservation/Accueil.gs du portail) : aucune adresse n'apparaît dans cette page.
  portail: {
    firestoreUrl: "https://firestore.googleapis.com/v1/projects/erp-hiptown/databases/(default)/documents",
    apiKey:       "AIzaSyAxHXtIFK5xJGIni9pDVdTZ19cryCM7IJw",
    city:         "bordeaux", // ville du portail (identifiant de PORTAIL.cities)
    siteId:       "nabo06",   // NABO06 — Émergence : les entreprises de ce site, et celles ajoutées pour tous les sites
    scriptUrl:    "https://script.google.com/macros/s/AKfycbxQi0MRfoJZ4YVroQfKe3l6mUBKwBZH8fMlMCLQa5YavhnKiZMsn6ULtb4-DHth47GsOw/exec",
  },

  // Cases écrites à la main : l'équipe Hiptown (avec ses contacts ci-dessous), et les
  // entreprises qui n'ont pas encore leur case sur le portail. Dès qu'une case du portail
  // porte le même nom, elle remplace la case écrite ici. Un contact sans « id » est prévenu
  // par l'équipe Hiptown de la ville (e-mail à l'équipe, Accueil.gs).
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
    {
      id:       "espace-temps",
      name:     "Espace Temps",
      featured: false,
      pin:      "6874",
      logo:     "Logo_espace_temps.png",
      color:    "#e0f2fe",
      textColor:"#0369a1",
      initials: "ET",
    },
    {
      id:       "scaleway",
      name:     "Scaleway",
      featured: false,
      pin:      "5489",
      logo:     "Logo_scaleway.png",
      color:    "#fef3c7",
      textColor:"#92400e",
      initials: "SC",
    },
    {
      id:       "synergie-bois",
      name:     "Synergie Bois",
      featured: false,
      pin:      "1520",
      logo:     "Logo_synergie_bois.png",
      color:    "#dcfce7",
      textColor:"#166534",
      initials: "SB",
    },
    {
      id:       "yes-sign",
      name:     "Yes Sign",
      featured: false,
      pin:      "0801",
      logo:     "Logo Yes sign.png",
      color:    "#f3e8ff",
      textColor:"#7e22ce",
      initials: "YS",
    },
    {
      id:       "la-baf",
      name:     "La BAF",
      featured: false,
      pin:      "2654",
      logo:     "Logo_la_BAF.png",
      color:    "#fff0e0",
      textColor:"#92400e",
      initials: "BAF",
    },
    {
      id:       "ab-tasty",
      name:     "AB Tasty",
      featured: false,
      pin:      "6688",
      logo:     "Logo_ab_tasty.png",
      color:    "#e0f0ff",
      textColor:"#1e40af",
      initials: "ABT",
    },
    {
      id:       "caisse-epargne",
      name:     "Caisse d'Épargne",
      featured: false,
      pin:      "2073",
      logo:     "Logo_caisse_epargne.png",
      color:    "#e8faf0",
      textColor:"#166534",
      initials: "CE",
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
    {
      name:        "Agnès Bertoni",
      role:        "Contact",
      initials:    "AB",
      avatarBg:    "#f3e8ff",
      avatarColor: "#7e22ce",
      companyId:   "yes-sign",
    },
    {
      name:        "Christelle Barraud",
      role:        "Contact",
      initials:    "CB",
      avatarBg:    "#f3e8ff",
      avatarColor: "#7e22ce",
      companyId:   "yes-sign",
    },
    {
      name:        "Amnay",
      role:        "Contact",
      initials:    "AM",
      avatarBg:    "#fef3c7",
      avatarColor: "#92400e",
      companyId:   "scaleway",
    },
    {
      name:        "Loïc Lambert",
      role:        "Contact",
      initials:    "LL",
      avatarBg:    "#dcfce7",
      avatarColor: "#166534",
      companyId:   "synergie-bois",
    },
    {
      name:        "Martin Vernay",
      role:        "Contact",
      initials:    "MV",
      avatarBg:    "#e0f2fe",
      avatarColor: "#0369a1",
      companyId:   "espace-temps",
    },
    {
      name:        "Victor Morin",
      role:        "Contact",
      initials:    "VM",
      avatarBg:    "#e0f2fe",
      avatarColor: "#0369a1",
      companyId:   "espace-temps",
    },
    {
      name:        "Victor",
      role:        "Contact",
      initials:    "V",
      avatarBg:    "#fff0e0",
      avatarColor: "#92400e",
      companyId:   "la-baf",
    },
    {
      name:        "Titouan",
      role:        "Contact",
      initials:    "T",
      avatarBg:    "#fff0e0",
      avatarColor: "#92400e",
      companyId:   "la-baf",
    },
    {
      name:        "Jules Vienne",
      role:        "Contact",
      initials:    "JV",
      avatarBg:    "#e0f0ff",
      avatarColor: "#1e40af",
      companyId:   "ab-tasty",
    },
    {
      name:        "Angélique de Taddéo",
      role:        "Contact",
      initials:    "ADT",
      avatarBg:    "#e0f0ff",
      avatarColor: "#1e40af",
      companyId:   "ab-tasty",
    },
  ],


};
