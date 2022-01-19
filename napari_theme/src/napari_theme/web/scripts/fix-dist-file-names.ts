import fs from 'fs-extra';
import glob from 'glob';
import { basename, dirname, resolve } from 'path';

/**
 * Fixes HTML filenames exported by Next.js. For some reason, Next.js will
 * export a `.html.html` file since the routes exported for production include
 * the `.html` extension in the route string.
 */
async function fixDistFileNames() {
  const buildDir = resolve(__dirname, '../../../html');

  // Not sure why this file gets generated twice in the root directory.
  const trackingIndexHtmlFile = resolve(buildDir, 'index.html.html');
  await fs.unlink(trackingIndexHtmlFile);

  const htmlExt = '.html.html';
  const htmlFileGlob = resolve(buildDir, `**/*${htmlExt}`);
  const files = glob.sync(htmlFileGlob);

  await Promise.all(
    files.map(async (file) => {
      const dir = dirname(file);
      const base = basename(file, htmlExt);
      const htmlFile = resolve(dir, `${base}.html`);
      await fs.move(file, htmlFile, { overwrite: true });
    }),
  );
}

// same as `if __name__ == 'main'`
if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  fixDistFileNames();
}