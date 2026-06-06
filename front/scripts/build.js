const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');
const apiBaseUrl = process.env.LEXABYTE_API_BASE_URL || 'https://projeto-lexabyte-production.up.railway.app/api';

fs.rmSync(distDir, { recursive: true, force: true });
fs.cpSync(srcDir, distDir, { recursive: true });

const configPath = path.join(distDir, 'js', 'config.js');
const configSource = `window.LEXABYTE_API_BASE_URL = ${JSON.stringify(apiBaseUrl)};\n`;
fs.writeFileSync(configPath, configSource, 'utf8');
