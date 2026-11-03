// vite preview of dist/ for Lighthouse CI (lighthouserc.cjs), with what Netlify adds in production.
//   node scripts/lighthouse-server.mjs <port>
// netlify.toml proxies the Sentry tunnel (/diag) to Sentry. Without it every page logs a 404 to the
// console and fails best practices' errors-in-console. Here it answers 200 and forwards nothing, so
// CI sends no events.
import { preview } from 'vite';

const port = Number(process.argv[2] ?? 4173);

const server = await preview({
  preview: { port, strictPort: true },
  plugins: [
    {
      name: 'sentry-tunnel-stub',
      configurePreviewServer(previewServer) {
        previewServer.middlewares.use('/diag', (_req, res) => {
          res.statusCode = 200;
          res.end();
        });
      },
    },
  ],
});
// Prints "Local:", which lighthouserc.cjs waits for
server.printUrls();
