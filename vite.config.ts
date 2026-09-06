import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function serveSpecialtyDirectoryIndexes() {
  const rewriteDirectoryIndex = (request: { url?: string }) => {
    if (!request.url) return;
    const [pathname, query] = request.url.split("?", 2);
    if (pathname.startsWith("/specjalizacje/") && pathname.endsWith("/")) {
      request.url = `${pathname}index.html${query ? `?${query}` : ""}`;
    }
  };

  return {
    name: "serve-specialty-directory-indexes",
    configureServer(server: { middlewares: { use: (handler: (request: { url?: string }, response: unknown, next: () => void) => void) => void } }) {
      server.middlewares.use((request, _response, next) => {
        rewriteDirectoryIndex(request);
        next();
      });
    },
    configurePreviewServer(server: { middlewares: { use: (handler: (request: { url?: string }, response: unknown, next: () => void) => void) => void } }) {
      server.middlewares.use((request, _response, next) => {
        rewriteDirectoryIndex(request);
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [serveSpecialtyDirectoryIndexes(), react()],
});
