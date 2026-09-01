import bcrypt from 'bcryptjs';

const password = process.env.PASSWORD_TO_HASH || process.argv[2];

if (!password) {
  console.error('Usage: PASSWORD_TO_HASH="your-password" node generate-hash.js');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log(hash);
