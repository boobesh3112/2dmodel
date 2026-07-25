import fs from 'node:fs';
import path from 'node:path';

if (process.env.NETLIFY) {
  console.log('Netlify Nitro output detected. Skipping the dist/server preview shim.');
  process.exit(0);
}

const distServerDir = path.join(process.cwd(), 'dist', 'server');
const targetFile = path.join(distServerDir, 'server.js');

const shimContent = `import serverEntry from './index.mjs';

const originalFetch = serverEntry.fetch;

serverEntry.fetch = function(request, env = {}, context = {}) {
  // Patch context with dummy waitUntil function to avoid TypeError during bind
  if (!context.waitUntil) {
    context.waitUntil = () => {};
  }

  // Patch request to make 'ip', 'runtime', and 'waitUntil' writable/configurable
  // since srvx/node (used by TanStack Start preview) has a read-only 'ip' getter.
  try {
    Object.defineProperty(request, 'ip', {
      value: request.headers.get("cf-connecting-ip") || undefined,
      writable: true,
      configurable: true
    });
  } catch (e) {
    // If defineProperty fails, fallback to simple property assignment
    try {
      request.ip = request.headers.get("cf-connecting-ip") || undefined;
    } catch (err) {}
  }

  try {
    if (!Object.getOwnPropertyDescriptor(request, 'runtime')) {
      Object.defineProperty(request, 'runtime', {
        value: undefined,
        writable: true,
        configurable: true
      });
    }
  } catch (e) {}

  try {
    if (!Object.getOwnPropertyDescriptor(request, 'waitUntil')) {
      Object.defineProperty(request, 'waitUntil', {
        value: undefined,
        writable: true,
        configurable: true
      });
    }
  } catch (e) {}

  return originalFetch.call(this, request, env, context);
};

export default serverEntry;
`;

try {
  if (fs.existsSync(distServerDir)) {
    fs.writeFileSync(targetFile, shimContent);
    console.log('Successfully created dist/server/server.js shim.');
  } else {
    console.warn('dist/server directory does not exist. Skipping postbuild shim creation.');
  }
} catch (error) {
  console.error('Error creating dist/server/server.js shim:', error);
  process.exit(1);
}
