// ═══════════════════════════════════════════════════════
//  CONFIGURATION HIPTOWN ACCUEIL
//  Modifiez ce fichier pour gérer les entreprises et contacts
// ═══════════════════════════════════════════════════════

const CONFIG = {

  espaceName: "Hiptown",

  // ── Entreprises ──────────────────────────────────────
  // featured: true = affichée en premier (Hiptown)
  // logo: nom du fichier image (dans le même dossier)
  // color: couleur de fond de la carte
  // initials: affiché si pas de logo
  companies: [
    {
      id:       "hiptown",
      name:     "Hiptown",
      featured: true,
      logo:     "Logo%20Hiptown%20site.png",
      color:    "#1e1847",
      textColor:"#ffe700",
      initials: "HT",
    },
    {
      id:       "espace-temps",
      name:     "Espace Temps",
      featured: false,
      logo:     null,
      color:    "#e0f2fe",
      textColor:"#0369a1",
      initials: "ET",
    },
    {
      id:       "scaleway",
      name:     "Scaleway",
      featured: false,
      logo:     null,
      color:    "#fef3c7",
      textColor:"#92400e",
      initials: "SC",
    },
    {
      id:       "synergie-bois",
      name:     "Synergie Bois",
      featured: false,
      logo:     null,
      color:    "#dcfce7",
      textColor:"#166534",
      initials: "SB",
    },
    {
      id:       "yes-sign",
      name:     "Yes Sign",
      featured: false,
      logo:     null,
      color:    "#f3e8ff",
      textColor:"#7e22ce",
      initials: "YS",
    },
  ],

  // ── Contacts ─────────────────────────────────────────
  // companyId doit correspondre à l'id de l'entreprise ci-dessus
  coworkers: [
    {
      name:        "Anne-Lise Médalin",
      role:        "Manageuse de ville",
      initials:    "ALM",
      avatarBg:    "#1e1847",
      avatarColor: "#ffe700",
      contact:     "alm@hiptown.com",
      companyId:   "hiptown",
    },
    {
      name:        "Côme Chabridon",
      role:        "Assistant manageur",
      initials:    "CC",
      avatarBg:    "#1e1847",
      avatarColor: "#ffe700",
      contact:     "cc@hiptown.com",
      companyId:   "hiptown",
    },
    {
      name:        "Agnès Bertoni",
      role:        "Contact",
      initials:    "AB",
      avatarBg:    "#f3e8ff",
      avatarColor: "#7e22ce",
      contact:     "",
      companyId:   "yes-sign",
    },
    {
      name:        "Christelle Barraud",
      role:        "Contact",
      initials:    "CB",
      avatarBg:    "#f3e8ff",
      avatarColor: "#7e22ce",
      contact:     "",
      companyId:   "yes-sign",
    },
    {
      name:        "Amnay",
      role:        "Contact",
      initials:    "AM",
      avatarBg:    "#fef3c7",
      avatarColor: "#92400e",
      contact:     "",
      companyId:   "scaleway",
    },
    {
      name:        "Loïc Lambert",
      role:        "Contact",
      initials:    "LL",
      avatarBg:    "#dcfce7",
      avatarColor: "#166534",
      contact:     "",
      companyId:   "synergie-bois",
    },
    {
      name:        "Martin Vernay",
      role:        "Contact",
      initials:    "MV",
      avatarBg:    "#e0f2fe",
      avatarColor: "#0369a1",
      contact:     "",
      companyId:   "espace-temps",
    },
    {
      name:        "Victor Morin",
      role:        "Contact",
      initials:    "VM",
      avatarBg:    "#e0f2fe",
      avatarColor: "#0369a1",
      contact:     "",
      companyId:   "espace-temps",
    },
  ],

  // ── EmailJS ───────────────────────────────────────────
  emailjs: {
    publicKey:  "5HaskNyk1h8eA_Ee6",
    serviceId:  "service_vs6rgr8",
    templateId: "template_f4lbzo5",
  },

};
