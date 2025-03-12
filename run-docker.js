const { execSync } = require('child_process');
const fs = require('fs');
require('dotenv').config();
const apiKey = process.env.API_KEY;
const exposedMode = process.argv.includes("--exposed");
const composeFile = exposedMode ? "docker-compose.exposed.yml" : "docker-compose.yml";
if (!apiKey) {
  console.warn(
    '⚠️ WARNING: API_KEY is not set in .env. Running without API key.',
  );
} else {
  console.log(`🔑 Using API_KEY: ${apiKey}`);
}

const command = `API_KEY="${apiKey || ''}" docker-compose -f ${composeFile} up --build`;
console.log(`🚀 Running: ${command}`);
execSync(command, { stdio: 'inherit' });
