// ═══════════════════════════════════════════════════════
//  CONFIGURATION HIPTOWN
//  Modifiez ce fichier pour gérer les membres de l'équipe
// ═══════════════════════════════════════════════════════

const CONFIG = {

  // Nom affiché dans le header et le footer
  espaceName: "Hiptown",

  // ── Membres de l'équipe ──────────────────────────────
  // Pour chaque membre, remplissez :
  //   name     : prénom et nom
  //   role     : poste / titre
  //   initials : 2 lettres pour l'avatar
  //   avatarBg : couleur de fond de l'avatar (hex)
  //   avatarColor : couleur du texte de l'avatar (hex)
  //   contact  : email OU numéro de téléphone (jamais affiché au visiteur)
  //              → sera utilisé pour envoyer la notification
  // ─────────────────────────────────────────────────────
  coworkers: [
    {
      name:        "Côme Chabridon",
      role:        "Assistant manageur",
      initials:    "CC",
      avatarBg:    "#DBEAFE",
      avatarColor: "#1e3a8a",
      contact:     "come@hiptown.com"  // ← remplacez par votre email ou numéro
    },

    // Exemple de membre supplémentaire (décommentez pour activer) :
    // {
    //   name:        "Prénom Nom",
    //   role:        "Poste",
    //   initials:    "PN",
    //   avatarBg:    "#E1F5EE",
    //   avatarColor: "#085041",
    //   contact:     "prenom@hiptown.com"
    // },
  ],

  // ── Notification ─────────────────────────────────────
  // Méthode d'envoi : "email" | "sms" | "webhook" | "none"
  // "none" = mode démo, aucun message réel n'est envoyé
  notificationMethod: "webhook",

  // Si notificationMethod = "webhook" :
  // Collez ici l'URL de votre webhook (Make, Zapier, n8n…)
  webhookUrl: "https://hook.eu1.make.com/okegh73mppxm5g9n01ieg935gnmjnqt9",

};
