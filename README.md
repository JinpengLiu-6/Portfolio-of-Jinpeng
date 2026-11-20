# Portfolio of Jinpeng

An interactive OS-inspired web resume for Jinpeng Liu, built from the Claude Design export and packaged as a runnable Vite project.

## Run Locally

```bash
npm install
npm run dev
```

Then open the URL printed by Vite.

## Build

```bash
npm run build
```

The static production output is generated in `dist/`.

## Deploy

This project can be deployed as a static site through GitHub Pages, Vercel, Netlify, or any host that serves the generated files.

## Avalon multiplayer game

The resume remains at `/`; the mobile Avalon game is available at `/avalon/` on Vercel.

Run `npm run dev:avalon` to develop both locally. Production requires an Upstash Redis integration (server-only environment variables), then a Vercel redeployment. See [deployment and validation instructions](docs/avalon-deployment.md).

Run `npm test` for rule and concurrency checks. The existing GitHub Pages workflow serves static content only; it does not host the game backend.
