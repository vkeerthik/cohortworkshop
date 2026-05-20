# Cohort — Workshop Engagement Platform

Click-through prototype for a healthcare patient-workshop engagement platform. Static mock data only, no backend, no real PHI. Demonstrates: dashboard, workshop management, participant rosters, communication templates (email/SMS/voice), campaign builder, voice reminder configuration, participant-facing registration form, post-session feedback survey, attendance tracking, and reporting.

## Run locally

```
npm install
npm run dev
```

Open http://localhost:3000. Login is fake, any credentials work.

## Deploy to GitHub Pages

1. **Set your repo name in `next.config.mjs`.** Find the `REPO_NAME` constant near the top and change it to match your GitHub repo name (the part after `username.github.io/`). If you push to a user/org page repo (`username.github.io` with no subpath), set it to an empty string `""`.

2. **Push to the `main` branch.** The workflow at `.github/workflows/deploy.yml` builds and deploys automatically on every push.

3. **Enable Pages in GitHub:**
   - Go to repo Settings → Pages
   - Under "Build and deployment", set Source to **GitHub Actions**
   - The first workflow run will publish to `https://<your-username>.github.io/<repo-name>/`

4. **First deploy.** After pushing, watch the Actions tab. Once the workflow finishes (about 2 minutes), the URL appears in the deploy job summary.

## What's mocked

All "send", "save", and "import" actions are simulated with toasts and local state. The CSV import shows validation preview without uploading anything. Comm events, attendance marks, and feedback submissions stay client-side only.

## Stack

Next.js 14, React 18, Tailwind CSS, Radix primitives, lucide-react icons. Static export only — no server-side rendering at runtime.
