// Jest setup: provide a mock for the Vite-injected __APP_VERSION__ global.
// In production builds, Vite replaces this with the version string from
// package.json at build time (see vite.config.ts `define`). In tests, we
// provide a stable value so code that references __APP_VERSION__ works
// under ts-jest without needing import.meta.env.
globalThis.__APP_VERSION__ = '2.4.0';
