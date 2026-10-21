const fs = require('node:fs');
const path = require('node:path');

const target = process.argv[2];
if (!target || !['development', 'production'].includes(target)) {
  console.error('Usage: node scripts/set-env.js <development|production>');
  process.exit(1);
}

const configPath = path.join(__dirname, '..', 'src', 'config', 'envConfig.js');
let content = fs.readFileSync(configPath, 'utf8');

const replacement = target === 'production' ? 'ACTIVE_ENV = ENV_TARGETS.PROD;' : 'ACTIVE_ENV = ENV_TARGETS.DEV;';
content = content.replace(/ACTIVE_ENV = ENV_TARGETS\.[A-Z]+;/g, replacement);

fs.writeFileSync(configPath, content, 'utf8');
console.log(`[GYMEZY BUILD] Configured mobile build environment target: ${target}`);
