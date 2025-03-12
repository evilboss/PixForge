const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KEY_NAME = 'API_KEY';
const newKey = crypto.randomBytes(32).toString('hex');
const envPath = path.resolve(__dirname, '.env');
let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

const keyRegex = new RegExp(`^${KEY_NAME}=.*`, 'm');

if (keyRegex.test(envContent)) {
  envContent = envContent.replace(keyRegex, `${KEY_NAME}=${newKey}`);
  console.log(`🔄 Updated ${KEY_NAME} in .env`);
} else {
  envContent += `\n${KEY_NAME}=${newKey}\n`;
  console.log(`✅ Added ${KEY_NAME} to .env`);
}

fs.writeFileSync(envPath, envContent, 'utf8');

console.log(`🔑 New ${KEY_NAME}: ${newKey}`);
