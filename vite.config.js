// Vite config. We proxy /api/* so the API keys from .env stay on the server
// side and never ship to the browser.
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Empty prefix so we can read non-VITE_ vars like WEATHERSTACK_KEY.
  const env = loadEnv(mode, process.cwd(), '');

  const WEATHERSTACK_KEY =
    env.WEATHERSTACK_KEY || env.VITE_WEATHERSTACK_KEY || '';
  const AVIATIONSTACK_KEY =
    env.AVIATIONSTACK_KEY || env.VITE_AVIATIONSTACK_KEY || '';

  return {
    plugins: [react()],
    server: {
      proxy: {
        // /api/weather?query=London -> weatherstack /current
        '/api/weather': {
          target: 'http://api.weatherstack.com',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://placeholder');
            const query = url.searchParams.get('query') || '';
            return (
              `/current?access_key=${encodeURIComponent(WEATHERSTACK_KEY)}` +
              `&query=${encodeURIComponent(query)}`
            );
          },
        },

        // /api/flights?dep_iata=JFK for departures, arr_iata=JFK for arrivals.
        '/api/flights': {
          target: 'http://api.aviationstack.com',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://placeholder');
            const dep = url.searchParams.get('dep_iata') || '';
            const arr = url.searchParams.get('arr_iata') || '';
            const limit = url.searchParams.get('limit') || '20';
            let upstream =
              `/v1/flights?access_key=${encodeURIComponent(AVIATIONSTACK_KEY)}` +
              `&limit=${encodeURIComponent(limit)}`;
            if (dep) upstream += `&dep_iata=${encodeURIComponent(dep)}`;
            if (arr) upstream += `&arr_iata=${encodeURIComponent(arr)}`;
            return upstream;
          },
        },

        // /api/airports?search=London for autocomplete.
        '/api/airports': {
          target: 'http://api.aviationstack.com',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://placeholder');
            const search = url.searchParams.get('search') || '';
            const limit = url.searchParams.get('limit') || '10';
            return (
              `/v1/airports?access_key=${encodeURIComponent(AVIATIONSTACK_KEY)}` +
              `&limit=${encodeURIComponent(limit)}` +
              (search ? `&search=${encodeURIComponent(search)}` : '')
            );
          },
        },
      },
    },
  };
});
