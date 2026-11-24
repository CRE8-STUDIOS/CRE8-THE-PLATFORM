# CRE8

The right hand of creative freelancers: projects, clients, contracts, agenda, clock-in, facturen and a client portal in one app.

Built with [SvelteKit 3](https://svelte.dev/docs/kit) (Svelte 5, runes) and [Supabase](https://supabase.com/docs) (database, auth and storage, region Frankfurt).

## Getting started

1. Install the packages:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in the Supabase project URL and publishable key
   (Supabase dashboard, Connect).
3. In the Supabase dashboard, go to **Authentication**, then **URL Configuration** and set the Site URL to
   `http://localhost:5173` and add `http://localhost:5173/**` to the Redirect URLs.
4. Start the app:

   ```sh
   npm run dev
   ```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server on `localhost:5173` |
| `npm run build` | Production build |
| `npm run check` | Type and Svelte checks (svelte-check) |
| `npm run format` | Format all files with Prettier |

## Project structure

```
src/
    env.js                 environment variables ($app/env/public)
    hooks.server.js        Supabase client per request, who is logged in, route protection
    app.css                global styles
    lib/
        atoms/             smallest building blocks (Button, Input, Heading...)
        molecules/         groups of atoms (TextField, ActionButton, NavLinks...)
        organisms/         page sections (ProjectForm, AgendaWeek, PortalContract...)
        server/            server-only helpers (form fields, storage paths)
        utils/             shared helpers (dates, money, fixed lists)
        database.types.ts  generated Supabase types
    routes/
        (app)/             freelancer pages (overview, projects, agenda, finance...)
        portal/            client portal (signup + (client) pages)
        login, signup      authentication
        auth/callback      email confirmation link
```

### How a page is built

- `+page.server.js` loads the data and handles form actions. Data is prepared on the server.
- `+page.svelte` contains only components: it receives `data` and passes each organism what it needs.
- Components follow [atomic design](https://docs.fdnd.nl/conventies.html#atomic-design): atoms never import molecules
  or organisms, molecules never import organisms, and atoms don't fetch data.
- Forms use SvelteKit form actions, so everything works without JavaScript.

### Security

- Every table has Row Level Security: freelancers only see their own data, clients only what is shared with them.
- `hooks.server.js` checks the login with `getClaims()` and protects routes by route id.
- Signing contracts and requests, booking meetings and the clock run through database functions.

## Conventions

This project follows the [FDND conventions](https://docs.fdnd.nl/conventies.html):

- English names: camelCase in JavaScript, kebab-case in CSS and HTML, PascalCase for components.
- Tabs, single quotes, no semicolons (see `prettier.config.js`).
- Branches: `<type>/<description>` (`feature/`, `fix/`, `chore/`...).
- Commits: [Conventional Commits](https://www.conventionalcommits.org), e.g. `feat: add agenda week view`.
- `main` and `dev` are the trunk branches; work is merged into `dev`.
- Notable changes go in [CHANGELOG.md](CHANGELOG.md).
