# DFICC Church Registrar

## Run locally

```powershell
npm install
npm start
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, import the repository and create the project.
3. In the project dashboard, go to **Storage** and add a Postgres integration (Neon is a suitable option).
4. Confirm that the integration adds `DATABASE_URL` to the Production, Preview, and Development environments.
5. Redeploy the project.

Vercel serves the files in `public` and deploys the `api` folder as serverless API endpoints. The hosted site uses Postgres; the local app continues to use SQLite.
