// SPDX-License-Identifier: GPL-3.0-or-later
// 作者全平台ID：宋夏天Dazzle；公众号：送你整个夏天
import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';

const overpassEndpoints = [
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

/**
 * Keeps Overpass credentials and CORS concerns out of the map component while
 * retaining an ordinary public-data request in development. The detail view is
 * intentionally queried on demand, one selected street at a time.
 */
function osmDetailProxy(): Plugin {
  return {
    name: 'shenzhen-osm-detail-proxy',
    configureServer(server) {
      server.middlewares.use('/api/osm-details', (request, response, next) => {
        if (request.method !== 'POST') {
          next();
          return;
        }

        let query = '';
        request.setEncoding('utf8');
        request.on('data', (chunk: string) => {
          query += chunk;
        });
        request.on('error', () => {
          response.statusCode = 400;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ error: 'Unable to read the OpenStreetMap query.' }));
        });
        request.on('end', async () => {
          if (!query.trim()) {
            response.statusCode = 400;
            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            response.end(JSON.stringify({ error: 'The OpenStreetMap query is empty.' }));
            return;
          }

          for (const endpoint of overpassEndpoints) {
            try {
              const remoteResponse = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'User-Agent': 'three-scope-map-shenzhen-detail/1.0',
                },
                body: new URLSearchParams({ data: query }).toString(),
              });
              if (!remoteResponse.ok) continue;
              const payload = await remoteResponse.text();
              response.statusCode = 200;
              response.setHeader('Content-Type', 'application/json; charset=utf-8');
              response.setHeader('Cache-Control', 'no-store');
              response.end(payload);
              return;
            } catch {
              // A public mirror may be busy; try the next Overpass endpoint.
            }
          }

          response.statusCode = 502;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify({ error: 'OpenStreetMap detail service is temporarily unavailable.' }));
        });
      });
    },
  };
}

export default defineConfig({
  // Relative asset URLs keep the viewer working when GitHub Pages serves it
  // beneath a repository path, for example /shenzhen-three-map/.
  base: './',
  plugins: [vue(), osmDetailProxy()],
});
