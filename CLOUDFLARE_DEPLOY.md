# Free Full-Stack Deployment on Cloudflare Pages & D1

This guide explains how to deploy the Islamic Studies Family LMS to **Cloudflare Pages** for **100% free hosting** with global edge CDN, unlimited bandwidth, serverless APIs, and Cloudflare D1 SQL database.

---

## Step 1: Push Repository to GitHub
Ensure the latest code is pushed to your GitHub repository:
```bash
git push origin main
```

---

## Step 2: Create Cloudflare Pages Project

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, click **Compute (Workers & Pages)** > **Pages**.
3. Click **Connect to Git** (or **Create application** > **Pages** > **Connect to Git**).
4. Select your repository: `kennyanju/islamic-studies-lms`.
5. Configure the build settings:
   - **Framework preset**: `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `public`
6. Click **Save and Deploy**.

---

## Step 3: Create & Bind Cloudflare D1 Database (Free SQL Storage)

1. In Cloudflare Dashboard, go to **Storage & Databases** > **D1 SQL Database**.
2. Click **Create Database** and name it `islamic-studies-db`.
3. Go back to your Pages Project (`islamic-studies-lms`):
   - Navigate to **Settings** > **Functions**.
   - Under **D1 Database Bindings**, click **Add binding**:
     - **Variable name**: `DB`
     - **D1 Database**: Select `islamic-studies-db`.
4. Apply the database tables:
   - In Cloudflare D1 dashboard for `islamic-studies-db`, go to the **Console** tab and execute the SQL inside [`migrations/0001_initial_schema.sql`](./migrations/0001_initial_schema.sql).

---

## Step 4: Environment Variables (Optional)

In your Pages Project **Settings** > **Environment variables**:
- `SESSION_SECRET`: Set a secure 32+ character random string.
- `ADMIN_EMAIL`: `admin@islamicstudies.org` (or your chosen email).
- `ADMIN_PASSWORD`: `Admin@Islam2026!` (or your chosen password).

---

## Step 5: Custom Domain & Free SSL

1. In your Pages project, go to **Custom domains**.
2. Click **Set up a custom domain** (e.g. `lms.yourdomain.com`).
3. Cloudflare will automatically provision a free SSL/TLS certificate and route traffic globally!

---

### Local Testing with Wrangler (Optional)
To test Cloudflare Pages Functions locally:
```bash
npx wrangler pages dev public
```
