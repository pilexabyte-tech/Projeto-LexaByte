const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = path.resolve(__dirname);
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');

function rmrf(folder) {
  if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true, force: true });
}

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const item of fs.readdirSync(srcDir)) {
    const s = path.join(srcDir, item);
    const d = path.join(destDir, item);
    const stat = fs.statSync(s);
    if (stat.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

async function build() {
  console.log('Cleaning dist...');
  rmrf(dist);
  fs.mkdirSync(dist, { recursive: true });

  console.log('Copying static files (html, css, media)...');
  // copy entire src (we will overwrite scripts later)
  copyRecursive(src, dist);

  console.log('Bundling JS with esbuild...');
  // Create temporary single entry that imports the scripts in the proper order
  const tempEntry = path.join(root, '.build-entry.js');
  const apiPath = path.join(src, 'js', 'api.js').replace(/\\/g, '/');
  const compPath = path.join(src, 'js', 'components.js').replace(/\\/g, '/');
  const appPath = path.join(src, 'js', 'app.js').replace(/\\/g, '/');
  const entryContent = `import '${apiPath}';\nimport '${compPath}';\nimport '${appPath}';\n`;
  fs.writeFileSync(tempEntry, entryContent, 'utf8');

  const outdir = path.join(dist, 'js');
  fs.mkdirSync(outdir, { recursive: true });

  await esbuild.build({
    entryPoints: [tempEntry],
    bundle: true,
    minify: true,
    format: 'iife',
    sourcemap: false,
    outfile: path.join(outdir, 'app.bundle.js'),
    footer: {
      js: "if (typeof Modal !== 'undefined') window.Modal = Modal; if (typeof ModalState !== 'undefined') window.ModalState = ModalState; if (typeof getAuthToken !== 'undefined') window.getAuthToken = getAuthToken; if (typeof getStoredUser !== 'undefined') window.getStoredUser = getStoredUser;"
    }
  });

  // remove temp entry
  try { fs.unlinkSync(tempEntry); } catch (e) {}

  console.log('Updating HTML to load bundled script...');
  const appHtmlPath = path.join(dist, 'app.html');
  if (fs.existsSync(appHtmlPath)) {
    let html = fs.readFileSync(appHtmlPath, 'utf8');
    // Remove existing script tags referencing js/*.js and inject config + bundle
    html = html.replace(/<script\s+src="js\/[^"]+"><\/script>\s*/g, '');
    // Ensure config.js is loaded (if exists)
    const configTag = fs.existsSync(path.join(dist, 'js', 'config.js')) ? '<script src="js/config.js"></script>\n' : '';
    // Inject bundled script before </body>
    html = html.replace('</body>', `${configTag}<script src="js/app.bundle.js"></script>\n</body>`);
    fs.writeFileSync(appHtmlPath, html, 'utf8');
  }

  console.log('Build complete — dist folder ready.');
}

build().catch(err => {
  console.error(err);
  process.exit(1);
});
