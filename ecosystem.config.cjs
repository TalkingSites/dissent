// Site: http://localhost:8190  SpaceDash with local files, no sign-in: http://localhost:8190/admin/
// Its real preview comes from SpaceClub's server on :8192 (run `npm run build` once so it has the site's assets)
module.exports = {
  apps: [
    { name: 'dissent-cafe-and-bar', script: 'npm', args: 'start -- --port 8190', cwd: __dirname },
    { name: 'dissent-cafe-and-bar-cms', script: 'npx', args: 'decap-server', cwd: __dirname, env: { PORT: '8191' } },
    { name: 'dissent-cafe-and-bar-preview', script: 'node_modules/spaceclub/server/index.cjs', cwd: __dirname, env: { PORT: '8192', SPACEDASH_LOCAL: '1', SPACEDASH_ORIGIN: 'http://localhost:8190' } },
  ],
};
