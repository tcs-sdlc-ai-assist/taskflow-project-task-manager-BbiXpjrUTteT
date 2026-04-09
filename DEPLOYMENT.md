# Deployment Guide — TaskFlow on Vercel

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Vercel CLI** (optional, for CLI-based deployments):
  ```bash
  npm install -g vercel
  ```
- An account on [vercel.com](https://vercel.com)

## Build Configuration

### Build Command

```bash
ng build --configuration production
```

### Output Directory

```
dist/taskflow/browser
```

Vercel needs to know the exact output directory. Angular 17+ with the application builder outputs production files to `dist/<project-name>/browser`.

## vercel.json — SPA Rewrite Configuration

Create a `vercel.json` file in the project root to ensure all routes are handled by the Angular router:

```json
{
  "buildCommand": "ng build --configuration production",
  "outputDirectory": "dist/taskflow/browser",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This rewrite rule ensures that any URL path (e.g., `/tasks`, `/tasks/123`) is served by `index.html`, allowing the Angular Router to handle client-side navigation.

## Environment Variables

**No environment variables are required.** TaskFlow uses `localStorage` for all data persistence and does not connect to any external APIs or databases.

If you extend the application in the future to use an API, add environment variables in the Vercel dashboard under **Settings → Environment Variables** and reference them in `src/environments/environment.prod.ts`.

## Deployment Steps

### Option 1: Git Integration (Recommended)

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Vercel will auto-detect the framework. Verify the following settings:
   - **Framework Preset**: Angular (or "Other" if not detected)
   - **Build Command**: `ng build --configuration production`
   - **Output Directory**: `dist/taskflow/browser`
5. Click **Deploy**.
6. Every subsequent push to the main branch will trigger an automatic deployment. Pull requests will generate preview deployments.

### Option 2: Vercel CLI

1. Navigate to the project root:
   ```bash
   cd taskflow
   ```

2. Run the deploy command:
   ```bash
   vercel deploy
   ```

3. Follow the interactive prompts:
   - Link to an existing project or create a new one.
   - Confirm the build settings when prompted.

4. For a production deployment:
   ```bash
   vercel deploy --prod
   ```

## Troubleshooting

### SPA Routing Returns 404

**Symptom**: Navigating directly to a route like `/tasks` or refreshing the page on a deep link returns a 404 error.

**Cause**: Vercel is trying to find a static file matching the path instead of serving `index.html`.

**Fix**: Ensure `vercel.json` is present in the project root with the rewrite rule shown above. Redeploy after adding or modifying the file.

### Build Fails with "ng: command not found"

**Symptom**: The Vercel build log shows `ng: command not found`.

**Fix**: Ensure `@angular/cli` is listed in `devDependencies` in `package.json`. Vercel installs all dependencies (including devDependencies) during the build step. Do **not** rely on a globally installed Angular CLI.

```bash
npm install --save-dev @angular/cli
```

### Output Directory Mismatch

**Symptom**: Deployment succeeds but the site shows a Vercel directory listing or a blank page.

**Fix**: Verify the output directory matches your Angular project name. Check `angular.json` under `projects.<project-name>.architect.build.options.outputPath`. For Angular 17+ with the application builder, the browser-ready files are in `dist/taskflow/browser`. Update `vercel.json` accordingly if your project name differs.

### Styles or Assets Missing

**Symptom**: The app loads but styles are broken or assets (images, fonts) are missing.

**Fix**: Ensure all assets are referenced with relative paths or are included in the `assets` array in `angular.json`. Absolute paths starting with `/` should work correctly with the SPA rewrite in place.

## Notes on localStorage in Production

TaskFlow persists all task data in the browser's `localStorage`. Be aware of the following limitations in a production environment:

- **Per-device storage**: Data is stored locally in each user's browser. There is no synchronization between devices or browsers. A user accessing TaskFlow from their phone and laptop will see different data on each.
- **Storage quota**: Most browsers limit `localStorage` to approximately **5 MB** per origin. This is sufficient for typical task management usage but could be exceeded with extremely large datasets.
- **Data volatility**: Users can clear their browser data at any time, which will permanently delete all stored tasks. There is no backup or recovery mechanism.
- **No sharing**: Since data lives in the browser, there is no way for multiple users to share or collaborate on tasks.
- **Private/incognito mode**: Some browsers restrict or disable `localStorage` in private browsing mode. TaskFlow may not persist data in these contexts.
- **Vercel-specific**: Vercel's edge network and CDN have no impact on `localStorage` behavior. Data never leaves the user's browser and is not stored on Vercel's servers.

If data persistence across devices or users is required in the future, consider integrating a backend API with a database and updating the Angular services to use `HttpClient` instead of `localStorage`.