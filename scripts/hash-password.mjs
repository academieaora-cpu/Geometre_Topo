// Génère la valeur de ADMIN_PASSWORD_HASH à partir d'un mot de passe (jamais stocké en clair).
// Usage : npm run admin:hash           (saisie masquée)
//         npm run admin:hash -- "motdepasse"
import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline';

async function ask() {
  if (process.argv[2]) return process.argv[2];
  const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  rl._writeToOutput = (s) => { if (!s.includes('\n') && s !== 'Mot de passe administrateur : ') return; rl.output.write(s); };
  const pwd = await new Promise((resolve) => rl.question('Mot de passe administrateur : ', resolve));
  rl.close();
  process.stdout.write('\n');
  return pwd;
}

const password = await ask();
if (!password || password.length < 12) {
  console.error('Choisissez un mot de passe d’au moins 12 caractères.');
  process.exit(1);
}
const N = 16384, r = 8, p = 1;
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 32, { N, r, p });
console.log(`ADMIN_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${salt.toString("base64")}:${hash.toString("base64")}`);
console.log('\nSESSION_SECRET (à copier aussi si besoin) :');
console.log(`SESSION_SECRET=${randomBytes(32).toString('base64url')}`);
