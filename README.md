# Cook in 3D

**See it. Make it. Love it.**

An interactive cookbook with three ten-step recipes: Creamy Tomato & Burrata Pasta, Teriyaki Beef Rice Bowl, and Garlic Butter Shrimp. Drag to orbit the Three.js kitchen, replay each cooking action, or use Play All for a quick visual preview. Serving buttons scale the ingredient and step measurements. A photo and step instructions are available without WebGL.

## Run it on your computer

Install [Node.js 22 LTS](https://nodejs.org/) or a newer LTS version. Open Terminal, change into the project folder, then run these commands one at a time:

```sh
npm ci
npm run dev
```

Open the address printed by Terminal, usually `http://localhost:5173/cook-in-3d/`. Press Control+C in Terminal to stop the server.

```sh
npm test        # recipe measurements and the 30 scene timelines
npm run build   # produce static files in dist/
npm run preview # serve the production build locally
```

## Publish with GitHub Pages

1. Push the committed source to the `main` branch of [carysbrowne24-dot/cook-in-3d](https://github.com/carysbrowne24-dot/cook-in-3d). GitHub requires write access to the repository and permission to add Actions workflows.
2. On GitHub, open the repository’s **Settings → Pages**. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Open the repository’s **Actions** tab and select **Deploy Cook in 3D to GitHub Pages**. If the initial run happened before you enabled Pages, click **Run workflow**, select **main**, and run it again.
4. After the workflow finishes with a green check, open [the public site](https://carysbrowne24-dot.github.io/cook-in-3d/). Try opening a recipe and selecting **Next Step**.

For future updates, pushes to `main` automatically build and deploy. The Vite base path is `/cook-in-3d/`. Recipe links use URL fragments, so opening a recipe directly works on static hosting.

### If you received the ZIP

Unzip it and move the `cook-in-3d` folder to Downloads. Open Terminal and run these lines one at a time to publish to the empty GitHub repository:

```sh
cd ~/Downloads/cook-in-3d
git init -b main
git add .
git commit -m "Build Cook in 3D"
git remote add origin https://github.com/carysbrowne24-dot/cook-in-3d.git
git push -u origin main
```

If GitHub asks you to sign in, authenticate with your GitHub account using GitHub Desktop or GitHub CLI. Then enable **GitHub Actions** in **Settings → Pages**, as described above.

## Source files

- `src/recipes.js` contains ingredients, serving measurements, instructions and timing.
- `src/kitchen.js` builds and animates the 3D cookware, ingredients and utensils.
- `src/main.jsx` contains the recipe library, checklist, lesson controls and completion screen.
- `public/` contains the bundled illustrations and fonts.

The animation timelines are compressed teaching demonstrations. Follow the instruction times and doneness guidance while cooking. The site uses bundled assets and runs without accounts, external APIs or a backend.
