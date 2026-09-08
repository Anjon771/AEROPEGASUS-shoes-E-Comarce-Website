
![preview img](/preview.png)

## GitHub Pages image fix

This project is configured with `base: './'` in `vite.config.ts`. That makes Vite generate relative asset URLs, so the bundled images work when the site is deployed to GitHub Pages under a repository URL such as `https://username.github.io/repository-name/`.

Before publishing, run:

```bash
npm install
npm run build
```

Publish the generated `dist` folder, or use a GitHub Actions workflow that deploys the Vite build output.
