# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Environment variables

Create `.env.dev` or `.env.prod` based on your environment. Use the provided
`.env.example` as a starting point:

```bash
cp .env.example .env.dev
```

By default Nuxt expects Strapi to run locally at `http://localhost:1337`.
To connect to the production Strapi instance set `STRAPI_URL` in your
`.env.dev` or `.env.prod`:

```bash
echo "STRAPI_URL=https://api.slavalarionov.store" >> .env.dev
```

`BACKEND_BASE_ADDRESS` controls the address for the PHP backend and usually
points to your local server, e.g. `http://localhost/`.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
