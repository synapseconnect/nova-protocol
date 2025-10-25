# NOVA Monorepo

Workspaces:
- `packages/nova-js` — JavaScript build
- `packages/nova-ts` — TypeScript build

## Commands
```bash
npm install
npm -w nova-ts run build
npm -w nova-js run test
npm -w nova-ts run test
```

## CI
- `.github/workflows/ci.yml` runs build + tests
- `.github/workflows/publish.yml` publishes both packages (needs `NPM_TOKEN` secret)
