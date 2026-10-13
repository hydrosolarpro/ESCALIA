import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

// En desarrollo (`npm run dev`) no existen las Vercel Functions: este plugin monta
// api/chat.ts en /api/chat para poder probar el asistente en local.
function devApiPlugin(): Plugin {
  return {
    name: 'escalia-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        const send = (status: number, body: unknown) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
        };
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          const raw = Buffer.concat(chunks).toString('utf8');
          const mod = await server.ssrLoadModule('/api/chat.ts');
          const fakeReq = Object.assign(req, { body: raw ? JSON.parse(raw) : {} });
          const fakeRes: any = res;
          fakeRes.status = (code: number) => {
            res.statusCode = code;
            return fakeRes;
          };
          fakeRes.json = (body: unknown) => send(res.statusCode || 200, body);
          await (mod as any).default(fakeReq, fakeRes);
        } catch (err) {
          send(500, { error: 'Error en la API de desarrollo' });
        }
      });
    },
  };
}

export default defineConfig(({mode}) => {
  // Expone al servidor de desarrollo las variables privadas de .env (sin prefijo VITE_).
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['GEMINI_API_KEY', 'GEMINI_MODEL', 'SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_URL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
