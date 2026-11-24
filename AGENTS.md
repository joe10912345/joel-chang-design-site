# Instructions for AI assistants (Claude, Codex, Gemini, Copilot, ...)

Several AIs work on this site. To stay in sync:

1. **Before starting**, read `CHANGELOG.md` (what changed recently) and `TODO.md` (what is open), then `README.md` (how the site is built).
2. **After any change**, add an entry at the top of `CHANGELOG.md`: date (UTC+8), what changed, files touched. Update `TODO.md` (tick off / add items).
3. Edit files directly in `site/`. Joel's own changes go in `site/assets/css/custom.css`, `site/assets/js/custom.js` (or `static-overrides.css` / `site.js` / `tilt.js` for Wix-replacement behaviour), with a short comment saying what and why, tagged `(Joel YYYY-MM-DD)`.
4. After editing `custom.css` / `custom.js` etc., bump the `?v=` query on that file in every `site/**/index.html` so browsers do not use a cached copy.
5. **Every fix must cover phone, desktop and iPad at the same time** (Joel's rule). Every page has a desktop file (`site/<page>/index.html`, also what iPads get: laid out 1366px wide and scaled, portrait + landscape, see `TABLET_W` in `site.js`) and a phone file (`site/m/<page>/index.html`). Hover effects need a touch equivalent (`:hover` sticks after a tap, `:active` while pressed). Check all three.
5a. To check all three at once: start both servers in `.claude/launch.json` and open `http://localhost:8766/devices.html` (`?d=phone|ipad|desktop|all&p=/<page>/`).
5b. Changes show on Joel's phone only after they are pushed to GitHub and Pages redeploys; say so when reporting a fix.
6. Do not run `tools/build.py` without reading the warning in `TODO.md`.
7. Joel writes in Traditional Chinese; reply in Traditional Chinese.
8. This folder is a git clone of github.com/joe10912345/joel-chang-design-site (branch `main`; pushing deploys GitHub Pages). Before starting: `git pull`. After a change: commit with a clear message and push. Never commit the unused images in `site/assets/media/` that `git status` shows as untracked.
