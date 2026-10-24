// Vérifie la configuration avant la compilation. En production, signale clairement
// ce qui manque (sans bloquer : le site masque les éléments non configurés).
const env = process.env;
const isProd = env.VERCEL_ENV === 'production' || env.NODE_ENV === 'production';
const checks = [
  ['SITE_URL', 'URL publique (canonical, sitemap, Open Graph)'],
  ['PUBLIC_PHONE', 'numéro de téléphone affiché'],
  ['PUBLIC_WHATSAPP_NUMBER', 'numéro WhatsApp (sinon déduit du téléphone)'],
  ['PUBLIC_EMAIL', 'adresse e-mail professionnelle'],
  ['DATABASE_URL', 'base de données des prospects (OBLIGATOIRE pour recevoir des demandes)'],
  ['SESSION_SECRET', 'secret de session de l’administration (32 caractères minimum)'],
  ['ADMIN_EMAIL', 'identifiant de l’administrateur'],
  ['ADMIN_PASSWORD_HASH', 'mot de passe administrateur haché (npm run admin:hash)'],
  ['RESEND_API_KEY', 'notifications e-mail des nouvelles demandes'],
  ['NOTIFY_EMAIL_TO', 'destinataire des notifications'],
  ['NOTIFY_EMAIL_FROM', 'expéditeur des notifications (domaine vérifié chez Resend)'],
];
const missing = checks.filter(([k]) => !env[k]);
if (missing.length) {
  const title = isProd ? '⚠️  CONFIGURATION INCOMPLÈTE (production)' : 'ℹ️  Variables non définies (normal en développement)';
  console.warn(`\n${title}`);
  for (const [k, why] of missing) console.warn(`   - ${k} : ${why}`);
  console.warn('   Voir docs/configuration.md\n');
}
if (env.SESSION_SECRET && env.SESSION_SECRET.length < 32) {
  console.error('SESSION_SECRET doit contenir au moins 32 caractères.');
  process.exit(1);
}
